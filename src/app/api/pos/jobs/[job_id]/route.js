import { loadJob } from "@/features/jobs/service";
import { validateJobItems } from "@/features/jobs/validation";
import pool from "@/lib/db";
import { validateFields } from "@/lib/validation";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  try {
    const { job_id } = await params;
    const res = await loadJob({
      jobId: job_id,
    });

    return NextResponse.json(res, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.status || 500 },
    );
  }
};

export const PUT = async (request, { params }) => {
  const connection = await pool.getConnection();
  try {
    const { job_id } = await params;
    const header_id = job_id;
    const data = await request.formData();

    // console.log(`Job Id : ${job_id} , Job Data : ${data}`);
    // console.log(data);

    const jobItems = JSON.parse(data.get("jobItems"));
    const grossTotal = data.get(`grossTotal`);
    const discount = data.get(`discount`);
    const netTotal = data.get(`netTotal`);
    const section = data.get(`section`);
    const username = data.get(`username`);
    const password = data.get(`password`);
    const accessories = data.get(`accessories`);
    const problem = data.get(`problem`);

    if (section === "HEADER") {
      let validate = validateFields(
        {
          problem,
        },
        [`problem`],
      );
      if (!validate.isValid) {
        throw new Error(validate.emptyFields);
      }
    } else if (section === "ITEMS") {
      if (jobItems.length > 0) {
        const validation = validateJobItems(jobItems);
        if (validation.error) {
          throw new Error(validation.error);
        }

        // console.log(jobItems);
      }
    } else {
      throw new Error(`Unidentifined Function !`);
    }

    await connection.beginTransaction();

    if (section === "HEADER") {
      const sql = `UPDATE job_details SET username=?, password=?, accessories=?, problem=?, updated_at=NOW() WHERE header_id=? `;
      const [resHeaderUpdate] = await connection.execute(sql, [
        username || null,
        password || null,
        accessories || null,
        problem,
        job_id,
      ]);
      if (resHeaderUpdate.affectedRows === 0) {
        throw new Error(`Update Job Details Failed !`);
      }
    } else if (section === "ITEMS") {
      // REVERSE STOCK
      await reverseStock(connection, job_id);

      // INSERT NEW JOB ITEMS
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

          if (item.itemType == "P") {
            // LOG STOCK MOVEMENTS
            const logStockMovements = `INSERT INTO stock_movements (item_id, type, quantity, reference, reference_id) VALUES (?,?,?,?,?)`;
            const [resStockMovements] = await connection.execute(
              logStockMovements,
              [item.itemId, `OUT`, item.quantity, `JOB`, header_id],
            );
            if (!resStockMovements.insertId) {
              throw new Error(`Stock Movements Logging Failed !`);
            }
          }
        }

        // UPDATE TOTALS FOR JOB HEADER
        const updateHeaderTotals = `UPDATE job_header SET gross=?, discount=?, net=? WHERE id=?`;
        const [resUpdateHeaderTotals] = await connection.execute(
          updateHeaderTotals,
          [grossTotal, discount, netTotal, job_id],
        );
        if (resUpdateHeaderTotals.affectedRows === 0) {
          throw new Error(`Update Header Totals Failed !`);
        }
      }
    }

    // throw new Error(`Stop for Testing !`);
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
