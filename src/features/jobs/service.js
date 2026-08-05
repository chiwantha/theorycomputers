import pool from "@/lib/db";
import { validateJobItems } from "./validation";
import { sendSms } from "../sms/service";
import { jobTemplates } from "./constant";
import { getCustomer, insertCustomer } from "../customer/repository";
import {
  getJobDetails,
  getJobHeader,
  getJobItems,
  getJobList,
  insertJobDetails,
  insertJobHeader,
  insertJobItem,
} from "./repository";
import { getPayments, insertPayment } from "../payments/repository";
import { insertMovement, updateStock } from "../inventory/stock/repository";
import { STOCK_OPERATION } from "../inventory/stock/constant";
import { updateSerial } from "../inventory/serial/repository";

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
    const customerName = data.get(`customerName`);
    const customerPhone = data.get(`customerPhone`);

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
          firstName: customerName.split(" ")[0],
          lastName: customerName.split(" ")[1],
          phone: customerPhone,
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
      customerPhone,
      jobTemplates.CREATE({
        jobNo: jobNo,
        customerName: customerName,
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
