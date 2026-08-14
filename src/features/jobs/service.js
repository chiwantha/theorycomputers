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
  //here
  const connection = await pool.getConnection();
  try {
    const { customer, header, payment, details, items: jobItems = [] } = body;

    if (jobItems.length > 0) {
      validateJobItems(jobItems);
    }

    await connection.beginTransaction();

    // HANDLE CUSTOMER
    let customerIdUse;
    if (customer.customerState == `1`) {
      const { customerId } = await insertCustomer(
        {
          firstName: customer.firstName,
          lastName: customer.lastName,
          phone: customer.phone,
          email: customer.email,
          city: customer.city,
          province: customer.province,
          address: customer.address,
        },
        connection,
      );
      customerIdUse = customerId;
    } else {
      customerIdUse = customer.customerId;
    }

    // INSERT HEADER
    const { headerId } = await insertJobHeader(
      {
        jobNo: header.jobNo,
        customerId: customerIdUse,
        warranty: header.warranty,
        grossTotal: header.grossTotal,
        discount: header.discount,
        netTotal: header.netTotal,
      },
      connection,
    );

    // INSERT ADVANCE PAYMENT
    if (Number(payment.advance) !== 0 && payment.advance) {
      await insertPayment(
        {
          reference: "JOB",
          referenceId: headerId,
          paymentType: "DOWN",
          paymentMethod: "CASH",
          amount: payment.advance,
          note: `Advance Payment For ${header.jobNo}`,
        },
        connection,
      );
    }

    // INSERT DETAILS
    await insertJobDetails(
      {
        headerId,
        invHeaderId: details.invHeaderId || null,
        invDetailsId: details.invDetailsId || null,
        itemId: details.itemId || null,
        categoryId: details.categoryId || null,
        brandId: details.brandId || null,
        model: details.model || null,
        serialNo: details.serialNo || null,
        username: details.username || null,
        password: details.password || null,
        accessories: details.accessories || null,
        problem: details.problem,
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
      customer.phone,
      jobTemplates.CREATE({
        jobNo: header.jobNo,
        customerName: `${customer.firstName} ${customer.lastName}`,
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
  console.log("Job Service Body : ", body);
  throw new Error("Test Okay Completed !");
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

export const updateJobState = async (body) => {
  const connection = await pool.getConnection();
  try {
    const { customer, header, state, jobId } = body;

    validateAnyFields({ jobId }, ["jobId"]);
    validateAnyFields(customer, ["firstName", "lastName", "fullName", "phone"]);
    validateAnyFields(header, ["jobNo"]);
    validateAnyFields(state, ["state", "action"]);

    let start = false;
    let restart = false;
    let finish = false;
    let cancel = false;

    if (state.action == "Finish") {
      finish = true;
    } else if (state.action == "Start") {
      start = true;
    } else if (state.action == "Restart") {
      restart = true;
    } else if (state.action == "Cancel") {
      cancel = true;
    } else {
      throw new AppError(`Invalid Action !`, 400);
    }

    await connection.beginTransaction();

    await updateJobHeaderState(
      {
        jobId,
        state: state.state,
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
        customer.phone,
        jobTemplates.STARTED({
          customerName: customer.fullName,
          jobNo: header.jobNo,
        }),
      );
    } else if (restart) {
      await sendSms(
        customer.phone,
        jobTemplates.RESTARTED({
          customerName: customer.fullName,
          jobNo: header.jobNo,
        }),
      );
    } else if (finish) {
      await sendSms(
        customer.phone,
        jobTemplates.FINISHED({
          customerName: customer.fullName,
          jobNo: header.jobNo,
          netTotal: header.netTotal,
        }),
      );
    } else if (cancel) {
      await sendSms(
        customer.phone,
        jobTemplates.CANCELLED({
          customerName: customer.fullName,
          jobNo: header.jobNo,
          reason: state.reason,
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
    // console.log(jobItems);
    // validateJobItems(jobItems);

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
