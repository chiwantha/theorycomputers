import pool from "@/lib/db";
import { validateJobItems } from "./validation";
import { sendSms } from "../sms/service";
import { jobTemplates } from "./constant";
import { getCustomer, insertCustomer } from "../customer/repository";
import {
  deleteJobItems,
  getJobDetails,
  getJobHeader,
  getJobItems,
  getJobList,
  insertJobDetails,
  insertJobHeader,
  insertJobItem,
  updateJobDetails,
  updateJobHeaderState,
  updateJobTotals,
} from "./repository";
import { getPayments, insertPayment } from "../payments/repository";
import { insertMovement, updateStock } from "../inventory/stock/repository";
import { STOCK_OPERATION } from "../inventory/stock/constant";
import { releaseSerials, updateSerial } from "../inventory/serial/repository";
import { validateAnyFields } from "@/lib/validation";
import { AppError } from "@/lib/error-handling";

export const loadJobList = async () => {
  try {
    const { jobList } = await getJobList();

    return jobList;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const loadJob = async (body) => {
  try {
    const { jobId } = body;

    // Load Job Header
    const { jobHeader } = await getJobHeader({
      jobId,
    });
    const { customer } = await getCustomer({
      customerId: jobHeader.customer_id,
    });
    const { jobDetails } = await getJobDetails({
      jobId,
    });
    const { jobItems } = await getJobItems({
      jobId,
    });
    const { payments } = await getPayments({
      reference: `JOB`,
      referenceId: jobId,
    });

    return {
      jobHeader,
      customer,
      jobDetails,
      jobItems,
      payments,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const createJob = async (body) => {
  const connection = await pool.getConnection();
  try {
    const data = body;

    const customerState = data.get(`customerState`);
    const customerId = data.get(`customerId`);
    const firstName = data.get(`firstName`);
    const lastName = data.get(`lastName`);
    const phone = data.get(`phone`);
    const city = data.get(`city`);
    const province = data.get(`province`);
    const address = data.get(`address`);
    const email = data.get(`email`);

    const jobNo = data.get(`jobNo`);
    const warranty = data.get(`warranty`);
    const grossTotal = data.get(`grossTotal`);
    const discount = data.get(`discount`);
    const netTotal = data.get(`netTotal`);

    const invHeaderId = data.get(`invHeaderId`);
    const invDetailsId = data.get(`invDetailsId`);
    const itemId = data.get(`itemId`);
    const category = data.get(`category`);
    const brand = data.get(`brand`);
    const model = data.get(`model`);
    const serialNo = data.get(`serialNo`);
    const username = data.get(`username`);
    const password = data.get(`password`);
    const advance = data.get(`advance`);
    const accessories = data.get(`accessories`);
    const problem = data.get(`problem`);

    const jobItems = JSON.parse(data.get("jobItems"));

    if (jobItems.length > 0) {
      validateJobItems(jobItems);
    }

    await connection.beginTransaction();

    // HANDLE CUSTOMER
    let customerIdUse;
    if (customerState == `1`) {
      const { customerId } = await insertCustomer(
        {
          firstName,
          lastName,
          phone,
          email,
          city,
          province,
          address,
        },
        connection,
      );
      customerIdUse = customerId;
    } else {
      customerIdUse = customerId;
    }

    // INSERT HEADER
    const { headerId } = await insertJobHeader(
      {
        jobNo,
        customerId: customerIdUse,
        warranty,
        grossTotal,
        discount,
        netTotal,
      },
      connection,
    );

    // INSERT ADVANCE PAYMENT
    if (Number(advance) !== 0 && advance) {
      await insertPayment(
        {
          reference: "JOB",
          referenceId: headerId,
          paymentType: "DOWN",
          paymentMethod: "CASH",
          amount: advance,
          note: `Advance Payment For ${jobNo}`,
        },
        connection,
      );
    }

    // INSERT DETAILS
    await insertJobDetails(
      {
        headerId,
        invHeaderId: invHeaderId || null,
        invDetailsId: invDetailsId || null,
        itemId: itemId || null,
        categoryId: category || null,
        brandId: brand || null,
        model: model || null,
        serialNo: serialNo || null,
        username: username || null,
        password: password || null,
        accessories: accessories || null,
        problem: problem,
      },
      connection,
    );

    // HANDLE JOB ITEMS
    if (jobItems.length > 0) {
      for (const item of jobItems) {
        // INSERT JOB ITEMS
        await insertJobItem(
          {
            headerId,
            itemId: item.itemId,
            billing: item.billing,
            unitCost: item.unitCost,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            lineTotal: item.lineTotal,
          },
          connection,
        );

        // UPDATE STOCK
        if (item.itemType == "P") {
          await updateStock(
            {
              itemId: item.itemId,
              quantity: item.quantity,
              type: STOCK_OPERATION.OUT,
            },
            connection,
          );
        }

        // HANDLE SERIAL
        if (item.serial) {
          const serials = item.serials;
          for (const serial of serials) {
            await updateSerial(
              {
                type: 0,
                reference: "JOB",
                referenceId: headerId,
                serialNo: serial,
              },
              connection,
            );
          }
        }

        // LOG STOCK MOVEMENTS
        if (item.itemType == "P") {
          await insertMovement(
            {
              itemId: item.itemId,
              type: STOCK_OPERATION.OUT,
              quantity: item.quantity,
              reference: "JOB",
              referenceId: headerId,
            },
            connection,
          );
        }
      }
    }

    await connection.commit();

    const result = await sendSms(
      phone,
      jobTemplates.CREATE({
        jobNo: jobNo,
        customerName: `${firstName} ${lastName}`,
      }),
    );

    if (!result.success) {
      console.log(result.message);
    }

    return {
      success: true,
      jobId: headerId,
    };
  } catch (err) {
    await connection.rollback();
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
};

export const updateJob = async (body) => {
  const connection = await pool.getConnection();
  try {
    const {
      jobId,
      section,
      username,
      password,
      accessories,
      problem,
      grossTotal,
      discount,
      netTotal,
    } = body;

    validateAnyFields(body, [`jobId`, `section`]);

    await connection.beginTransaction();

    if (section == "HEADER") {
      validateAnyFields(body, [`problem`]);
      await updateJobDetails(
        {
          jobId,
          username,
          password,
          accessories,
          problem,
        },
        connection,
      );
    } else if (section === "ITEMS") {
      await removeJobItemsAndReverseStock(jobId, connection);

      const jobItems = JSON.parse(body?.jobItems);

      if (jobItems.length > 0) {
        validateJobItems(jobItems);

        for (const item of jobItems) {
          // INSERT JOB ITEMS
          await insertJobItem(
            {
              headerId: jobId,
              itemId: item.itemId,
              billing: item.billing,
              unitCost: item.unitCost,
              unitPrice: item.unitPrice,
              quantity: item.quantity,
              lineTotal: item.lineTotal,
            },
            connection,
          );

          // UPDATE STOCK
          if (item.itemType === "P") {
            await updateStock(
              {
                itemId: item.itemId,
                quantity: item.quantity,
                type: STOCK_OPERATION.OUT,
              },
              connection,
            );
          }

          // HANDLE SERIAL
          if (item.serial) {
            for (const serial of item.serials) {
              await updateSerial(
                {
                  type: 0,
                  reference: "JOB",
                  referenceId: jobId,
                  serialNo: serial,
                },
                connection,
              );
            }
          }

          // LOG STOCK MOVEMENTS
          if (item.itemType === "P") {
            await insertMovement(
              {
                itemId: item.itemId,
                type: STOCK_OPERATION.OUT,
                quantity: item.quantity,
                reference: "JOB",
                referenceId: jobId,
              },
              connection,
            );
          }
        }
      }

      validateAnyFields(body, ["grossTotal", "discount", "netTotal"]);

      await updateJobTotals(
        {
          jobId,
          grossTotal,
          discount,
          netTotal,
        },
        connection,
      );
    }

    await connection.commit();

    return {
      success: true,
    };
  } catch (err) {
    await connection.rollback();
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
};

export const upateJobState = async (body) => {
  const connection = await pool.getConnection();
  try {
    validateAnyFields(body, [
      "jobId",
      "jobNo",
      "netTotal",
      "state",
      "action",
      "phone",
      "name",
    ]);

    const {
      jobId,
      jobNo,
      netTotal,
      state,
      action,
      phone,
      name,
      reason = `Customer requested cancellation`,
    } = body;

    let start = false;
    let restart = false;
    let finish = false;
    let cancel = false;

    if (action == "Finish") {
      finish = true;
    } else if (action == "Start") {
      start = true;
    } else if (action == "Restart") {
      restart = true;
    } else if (action == "Cancel") {
      cancel = true;
    } else {
      throw new AppError(`Invalid Action !`, 400);
    }

    await connection.beginTransaction();

    await updateJobHeaderState(
      {
        jobId,
        state,
        start,
        restart,
        finish,
      },
      connection,
    );

    if (cancel) {
      await removeJobItemsAndReverseStock(jobId, connection);
    }

    await connection.commit();

    // SMS Send
    if (start) {
      await sendSms(
        phone,
        jobTemplates.STARTED({
          name,
          jobNo,
        }),
      );
    } else if (restart) {
      await sendSms(
        phone,
        jobTemplates.RESTARTED({
          name,
          jobNo,
        }),
      );
    } else if (finish) {
      await sendSms(
        phone,
        jobTemplates.FINISHED({
          name,
          jobNo,
          netTotal,
        }),
      );
    } else if (cancel) {
      await sendSms(
        phone,
        jobTemplates.CANCELLED({
          name,
          jobNo,
          reason,
        }),
      );
    }

    return {
      success: true,
    };
  } catch (err) {
    await connection.rollback();
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
};

const removeJobItemsAndReverseStock = async (jobId, connection) => {
  validateAnyFields({ jobId }, ["jobId"]);

  const { jobItems } = await getJobItems({ jobId }, connection);

  if (jobItems.length > 0) {
    validateJobItems(jobItems);

    for (const row of jobItems) {
      if (row?.item_type === "P") {
        await updateStock(
          {
            itemId: row.item_id,
            quantity: row.quantity,
            type: STOCK_OPERATION.IN,
          },
          connection,
        );

        await insertMovement(
          {
            itemId: row.item_id,
            type: STOCK_OPERATION.IN,
            quantity: row.quantity,
            reference: "JOB",
            referenceId: jobId,
            note: "Reverse Stock",
          },
          connection,
        );
      }
    }

    await deleteJobItems({ jobId }, connection);

    await releaseSerials({ referenceId: jobId }, connection);
  }
};
