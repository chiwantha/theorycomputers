import { customerTemplates, jobTemplates } from "@/constant/SmsTemplate";
import pool, { query } from "@/lib/db";
import { sendSms } from "@/lib/func";
import { validateJobItems } from "@/lib/validation";
import { NextResponse } from "next/server";

export const GET = async () => {
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
    OR job_header.state IN (0, 2)
ORDER BY job_header.state ASC, job_header.created_at DESC;`;

    const res = await query(sql);

    if (!res || res.length == 0) {
      return NextResponse.json({ error: `No Jobs Found !` }, { status: 404 });
    }

    return NextResponse.json(res, { status: 200 });
  } catch (err) {
    console.log(`Invernal Server Error ! :`, err);
    return NextResponse.json(
      { error: `Internal Server Error !` },
      { status: 500 },
    );
  }
};

export const POST = async (request) => {
  const connection = await pool.getConnection();
  try {
    const data = await request.formData();
    const jobItems = JSON.parse(data.get("jobItems"));

    if (jobItems.length > 0) {
      const validation = validateJobItems(jobItems);
      if (validation.error) {
        throw new Error(validation.error);
      }
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
    // const serial = data.get(`serial`);
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
      const newCustomerSql = `INSERT INTO customers (first_name, last_name, phone) VALUES (?,?,?)`;
      const [resNewCustomer] = await connection.execute(newCustomerSql, [
        customerName.split(" ")[0],
        customerName.split(" ")[1] || null,
        customerPhone,
      ]);
      if (!resNewCustomer.insertId) {
        throw new Error(`Create Customer Failed !`);
      }
      customer_id_use = resNewCustomer.insertId;
    } else {
      customer_id_use = customerId;
    }

    // console.log(`test 1 passed ✅ !`);

    // INSERT HEADER
    const jobHeaderSql = `INSERT INTO job_header (job_no, customer_id, warranty, advance, gross, discount, net) VALUES (?,?,?,?,?,?,?)`;
    const [resJobHeader] = await connection.execute(jobHeaderSql, [
      jobNo,
      customer_id_use,
      warranty == "true" ? 1 : 0,
      advance,
      grossTotal,
      discount,
      netTotal,
    ]);
    if (!resJobHeader.insertId) {
      throw new Error("Job Header Failed !");
    }
    const header_id = resJobHeader.insertId;

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
        throw new Error("Down-Payment Transaction Failed !");
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
      throw new Error("Job Details Failed !");
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
          throw new Error(`Job Item Failed !`);
        }

        // console.log(`test 4 passed ✅ !`);

        // UPDATE STOCK
        if (item.itemType == "P") {
          const updateStockSql = `UPDATE stock SET quantity = quantity - ? WHERE item_id = ?`;
          const [resUpdateStock] = await connection.execute(updateStockSql, [
            item.quantity,
            item.itemId,
          ]);
          if (resUpdateStock.affectedRows === 0) {
            throw new Error(`Update Stock Failed !`);
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
              throw new Error(`Update Serial Stock Failed !`);
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
            throw new Error(`Stock Movements Logging Failed !`);
          }
        }

        // console.log(`test 7 passed ✅ !`);
      }
    }

    // throw new Error(`Test Passed ✅ !`);

    if (customerState == `1`) {
      await sendSms(
        customerPhone,
        customerTemplates.CREATE({
          customerName: customerName,
        }),
      );
    }

    await sendSms(
      customerPhone,
      jobTemplates.CREATE({
        jobNo: jobNo,
        customerName: customerName,
      }),
    );

    await connection.commit();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    await connection.rollback();
    console.log("Transaction Failed ! :", err.message);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 },
    );
  } finally {
    connection.release();
  }
};

export const PUT = async (request) => {
  const connection = await pool.getConnection();
  try {
    const data = await request.json();
    // await connection.beginTransaction();
    // await connection.commit();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    await connection.rollback();
    console.log("Transaction Failed ! :", err.message);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 },
    );
  } finally {
    connection.release();
  }
};

export const DELETE = async (request) => {
  const connection = await pool.getConnection();
  try {
    const data = await request.json();
    // await connection.beginTransaction();
    // await connection.commit();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    await connection.rollback();
    console.log("Transaction Failed ! :", err.message);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 },
    );
  } finally {
    connection.release();
  }
};
