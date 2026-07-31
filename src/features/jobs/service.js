import pool from "@/lib/db";
import { validateJobItems } from "./validation";
import { createCustomer } from "../customer/service";
import { sendSms } from "../sms/service";
import { jobTemplates } from "./constant";
import { AppError } from "@/lib/error-handling";

export const loadJobs = async () => {
  try {
    const sql = `SELECT
      job_header.id AS jobId,
      job_header.job_no AS jobNo,
      customers.id AS CustomerId,
      CONCAT(customers.first_name, ' ', customers.last_name) AS customerName,
      customers.phone AS customerPhone,
      job_header.invoice_id,
      job_header.created_at,
      job_header.state AS jobState
  FROM job_header
  INNER JOIN customers
      ON job_header.customer_id = customers.id
  WHERE
      DATE(job_header.created_at) = CURDATE()
      OR job_header.state IN (0,1, 2)
  ORDER BY job_header.state ASC, job_header.created_at DESC;`;

    const jobs = await query(sql);

    if (!jobs || jobs.length == 0) {
      throw new AppError(`No Jobs Found !`, 404);
    }

    return jobs;
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }
    console.error(err);
    throw new AppError(
      "Unable to load jobs right now. Please try again later.",
      500,
    );
  }
};

export const createJob = async (body) => {
  const connection = await pool.getConnection();
  try {
    const data = body;
    const jobItems = JSON.parse(data.get("jobItems"));

    if (jobItems.length > 0) {
      validateJobItems(jobItems);
    }

    const jobNo = data.get(`jobNo`);
    const warranty = data.get(`warranty`);
    const customerState = data.get(`customerState`);
    const customerId = data.get(`customerId`);
    const customerName = data.get(`customerName`);
    const customerPhone = data.get(`customerPhone`);
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

    await connection.beginTransaction();

    // INSERT CUSTOMER
    let customer_id_use;
    if (customerState == `1`) {
      customer_id_use = await createCustomer(connection, {
        firstName: customerName.split(" ")[0],
        lastName: customerName.split(" ")[1],
        phone: customerPhone,
      });
    } else {
      customer_id_use = customerId;
    }

    // console.log(`test 1 passed ✅ !`);

    // INSERT HEADER
    const jobHeaderSql = `INSERT INTO job_header (job_no, customer_id, warranty, gross, discount, net) VALUES (?,?,?,?,?,?)`;
    const [resJobHeader] = await connection.execute(jobHeaderSql, [
      jobNo,
      customer_id_use,
      warranty == "true" ? 1 : 0,
      grossTotal,
      discount,
      netTotal,
    ]);
    if (!resJobHeader.insertId) {
      throw new AppError("Job Header Failed !", 500);
    }
    const header_id = resJobHeader.insertId;

    // INSERT ADVANCE PAYMENT
    if (Number(advance) !== 0 && advance) {
      const jobAdvancePaymentSql = `INSERT INTO trn_payments (reference, reference_id, payment_type, payment_method, amount, note)
      VALUES (?,?,?,?,?,?)`;
      const [resjobAdvancePayment] = await connection.execute(
        jobAdvancePaymentSql,
        [
          `JOB`,
          header_id,
          `DOWN`,
          `CASH`,
          advance,
          `Advance Payment For ${jobNo}`,
        ],
      );
      if (!resjobAdvancePayment.insertId) {
        throw new AppError("Down-Payment Transaction Failed !", 500);
      }
    }

    // console.log(`test 2 passed ✅ !`);

    // INSERT DETAILS
    const jobDetailsSql = `INSERT INTO job_details (header_id, inv_header_id, inv_details_id, item_id, category_id, brand_id, model, serial, username, password, accessories, problem )
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;
    const [resJobDetails] = await connection.execute(jobDetailsSql, [
      header_id,
      invHeaderId || null,
      invDetailsId || null,
      itemId || null,
      category || null,
      brand || null,
      model || null,
      serialNo || null,
      username || null,
      password || null,
      accessories || null,
      problem,
    ]);
    if (!resJobDetails.insertId) {
      throw new AppError("Job Details Failed !", 500);
    }

    // console.log(`test 3 passed ✅ !`);

    // HANDLE JOB ITEMS
    if (jobItems.length > 0) {
      for (const item of jobItems) {
        // INSERT JOB ITEMS
        const jobItemSql = `INSERT INTO job_items (header_id, item_id, billing, unit_price, quantity, line_total) VALUES (?,?,?,?,?,?)`;
        const [resJobItem] = await connection.execute(jobItemSql, [
          header_id,
          item.itemId,
          item.billing,
          item.unitPrice,
          item.quantity,
          item.lineTotal,
        ]);
        if (!resJobItem.insertId) {
          throw new AppError(`Job Item Failed !`, 500);
        }

        // console.log(`test 4 passed ✅ !`);

        // UPDATE STOCK
        if (item.itemType == "P") {
          const updateStockSql = `UPDATE stock SET quantity = quantity - ? WHERE item_id = ? AND quantity >= ?`;
          const [resUpdateStock] = await connection.execute(updateStockSql, [
            item.quantity,
            item.itemId,
            item.quantity,
          ]);
          if (resUpdateStock.affectedRows === 0) {
            throw new AppError(`Update Stock Failed !`, 500);
          }
        }

        // console.log(`test 5 passed ✅ !`);

        // HANDLE SERIAL
        if (item.serial) {
          const serials = item.serials;
          for (const serial of serials) {
            // UPDATE SERIAL STOCK
            const updateSerialStock = `UPDATE stock_items_serials SET stock = ? , reference = ? , reference_id = ? WHERE serial = ?`;
            const [resUpdateSerialStock] = await connection.execute(
              updateSerialStock,
              [0, `JOB`, header_id, serial],
            );
            if (resUpdateSerialStock.affectedRows === 0) {
              throw new AppError(`Update Serial Stock Failed !`, 500);
            }
          }
        }

        // console.log(`test 6 passed ✅ !`);

        // LOG STOCK MOVEMENTS
        if (item.itemType == "P") {
          const logStockMovements = `INSERT INTO stock_movements (item_id, type, quantity, reference, reference_id) VALUES (?,?,?,?,?)`;
          const [resStockMovements] = await connection.execute(
            logStockMovements,
            [item.itemId, `OUT`, item.quantity, `JOB`, header_id],
          );
          if (!resStockMovements.insertId) {
            throw new AppError(`Stock Movements Logging Failed !`, 500);
          }
        }

        // console.log(`test 7 passed ✅ !`);
      }
    }

    // throw new Error(`Test Passed ✅ !`);

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

    await connection.commit();
    return { success: true, status: 200 };
  } catch (err) {
    await connection.rollback();
    if (err instanceof AppError) {
      throw err;
    }
    console.error(err);
    throw new AppError(
      "Unable to create jobs right now. Please try again later.",
      500,
    );
  } finally {
    connection.release();
  }
};
