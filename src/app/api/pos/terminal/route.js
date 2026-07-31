import { createInvoice } from "@/features/invoices/service";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  try {
    // DATA
    const data = await request.formData();
    await createInvoice(data);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: err.message },
      { status: err.status || 500 },
    );
  }
};

// export const POSTT = async (request) => {
//   const connection = await pool.getConnection();
//   try {
//     // DATA
//     const data = await request.formData();

//     // HEADER DATA EXTRACT
//     const docType = data.get(`docType`);
//     const invNo =
//       docType === `INVOICE` ? generateDocNo(`INV`) : generateDocNo(`QUT`);
//     const invType = data.get(`invType`);
//     const quoteId = data.get(`quoteId`) || null;
//     const jobId = data.get(`jobId`) || null;
//     const customerState = data.get(`customerState`);
//     const customerId = data.get(`customerId`);
//     const customerName = data.get(`customerName`);
//     const customerPhone = data.get(`customerPhone`);
//     const grossTotal = data.get(`grossTotal`);
//     const discount = data.get(`discount`) || null;
//     const netTotal = data.get(`netTotal`);
//     const settlement =
//       data.get(`paymentMethod`) == `CREDIT` ? `CREDIT` : `IMMEDIATE`;
//     const creditAmount = data.get(`creditAmount`) || null;
//     const dueDate = data.get(`dueDate`) || null;
//     const quoteExpiryDate = data.get(`quoteExpiryDate`) || null;
//     const userId = data.get(`userId`);
//     const note = data.get(`note`) || null;

//     // INVOICE ITEMS
//     const invItems = JSON.parse(data.get("invItems"));
//     if (invItems.length > 0) {
//       const validation = validateInvItems(invItems, docType);
//       if (validation.error) {
//         throw new Error(validation.error);
//       }
//     }

//     // PAYMENT DATA
//     const paymentMethod = data.get(`paymentMethod`);
//     const downPayment = data.get(`downPayment`) || null;
//     const cashAmount = data.get(`cashAmount`) || null;
//     const cardAmount = data.get(`cardAmount`) || null;
//     const bankAmount = data.get(`bankAmount`) || null;
//     const cardType = data.get(`cardType`) || null;
//     const cardDigits = data.get(`cardDigits`) || null;
//     const bankReference = data.get(`bankReference`) || null;

//     // ARRANGE PAYMENTS ARRAY
//     const payment_rows = [];
//     if (Number(cashAmount) > 0) {
//       payment_rows.push({
//         paymentType: `FULL`,
//         paymentMethod: "CASH",
//         amount: Number(cashAmount),
//         cardType: null,
//         cardDigits: null,
//         bankReference: null,
//       });
//     }
//     if (Number(cardAmount) > 0) {
//       payment_rows.push({
//         paymentMethod: "CARD",
//         paymentType: `FULL`,
//         amount: Number(cardAmount),
//         cardType,
//         cardDigits,
//         bankReference: null,
//       });
//     }
//     if (Number(bankAmount) > 0) {
//       payment_rows.push({
//         paymentType: `FULL`,
//         paymentMethod: "BANK",
//         amount: Number(bankAmount),
//         cardType: null,
//         cardDigits: null,
//         bankReference,
//       });
//     }
//     if (
//       paymentMethod === "CREDIT" &&
//       Number(downPayment) > 0 &&
//       payment_rows.length === 0
//     ) {
//       payment_rows.push({
//         paymentType: `DOWN`,
//         paymentMethod: "CASH",
//         amount: Number(downPayment),
//         cardType: null,
//         cardDigits: null,
//         bankReference: null,
//       });
//     }

//     await connection.beginTransaction();

//     // HANDLE CUSTOMER
//     let customer_id_use;
//     if (customerState == `1`) {
//       const newCustomerSql = `INSERT INTO customers (first_name, last_name, phone) VALUES (?,?,?)`;
//       const [resNewCustomer] = await connection.execute(newCustomerSql, [
//         customerName.split(" ")[0],
//         customerName.split(" ")[1] || null,
//         customerPhone,
//       ]);
//       if (!resNewCustomer.insertId) {
//         throw new Error(`Create Customer Failed !`);
//       }
//       customer_id_use = resNewCustomer.insertId;
//     } else {
//       customer_id_use = customerId;
//     }

//     // INSERT INV HEADER
//     const invHeaderSql = `INSERT INTO inv_header (inv_no, doc_type, customer_id, date, inv_type, job_id, quote_id, gross_total, discount, net_total, settlement, credit_amount, due_date, quote_expiry_date, note, user_id)
//     VALUES (?,?,?,NOW(),?,?,?,?,?,?,?,?,?,?,?,?)`;
//     const [resInvHeader] = await connection.execute(invHeaderSql, [
//       invNo,
//       docType,
//       customer_id_use,
//       invType,
//       jobId,
//       quoteId,
//       grossTotal,
//       discount,
//       netTotal,
//       settlement,
//       creditAmount,
//       dueDate,
//       quoteExpiryDate,
//       note,
//       userId,
//     ]);
//     if (!resInvHeader.insertId) {
//       throw new Error("Invoice Header Failed !");
//     }

//     const header_id = resInvHeader.insertId;

//     // HANDLE PAYMENTS
//     if (payment_rows.length > 0) {
//       for (const row of payment_rows) {
//         const paymentsSql = `INSERT INTO trn_payments (reference, reference_id, payment_type, payment_method, amount, card_type, card_last4, bank_reference, note) VALUES (?,?,?,?,?,?,?,?,?)`;
//         const [resPayments] = await connection.execute(paymentsSql, [
//           `INVOICE`,
//           header_id,
//           row?.paymentType,
//           row?.paymentMethod,
//           row?.amount,
//           row?.cardType,
//           row?.cardDigits,
//           row?.bankReference,
//           null,
//         ]);
//         if (!resPayments.insertId) {
//           throw new Error(`Failed to Save Payments !`);
//         }
//       }
//     }

//     // HANDLE ITEMS
//     if (invItems.length > 0) {
//       for (const item of invItems) {
//         // console.log(item);
//         // HANDLE INVOICE ITEMS
//         const invItemsSql = `INSERT INTO inv_details (header_id, item_id, item_name, unit_cost, unit_selling, quantity, line_total, warranty_id, warranty_name, warranty_end_date, note) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
//         const [resInvItems] = await connection.execute(invItemsSql, [
//           header_id,
//           item.itemId,
//           item.itemName,
//           item.cost,
//           item.selling,
//           item.quantity,
//           item.lineTotal,
//           item.warrantyId,
//           item.warrantyName,
//           item.warrantyEndDate,
//           item.note || null,
//         ]);
//         if (!resInvItems.insertId) {
//           throw new Error(`Failed to Save Invoice Item ${item?.itemName} !`);
//         }

//         // UPDATE STOCK
//         if (item.itemType == "P" && docType === `INVOICE` && !jobId) {
//           const updateStockSql = `UPDATE stock SET quantity = quantity - ? WHERE item_id = ? AND quantity >= ?`;
//           const [resUpdateStock] = await connection.execute(updateStockSql, [
//             item.quantity,
//             item.itemId,
//             item.quantity,
//           ]);
//           if (resUpdateStock.affectedRows === 0) {
//             throw new Error(`Update Stock Failed !`);
//           }
//         }

//         // HANDLE SERIAL
//         if (item.serial && docType === `INVOICE` && !jobId) {
//           const serials = item.serials;
//           for (const serial of serials) {
//             // UPDATE SERIAL STOCK
//             const updateSerialStock = `UPDATE stock_items_serials SET stock = ? , reference = ? , reference_id = ? WHERE serial = ?`;
//             const [resUpdateSerialStock] = await connection.execute(
//               updateSerialStock,
//               [0, `INV`, header_id, serial],
//             );
//             if (resUpdateSerialStock.affectedRows === 0) {
//               throw new Error(`Update Serial Stock Failed !`);
//             }
//           }
//         }

//         // LOG STOCK MOVEMENTS
//         if (item.itemType == "P" && docType === `INVOICE` && !jobId) {
//           const logStockMovements = `INSERT INTO stock_movements (item_id, type, quantity, reference, reference_id) VALUES (?,?,?,?,?)`;
//           const [resStockMovements] = await connection.execute(
//             logStockMovements,
//             [item.itemId, `OUT`, item.quantity, `INV`, header_id],
//           );
//           if (!resStockMovements.insertId) {
//             throw new Error(`Stock Movements Logging Failed !`);
//           }
//         }
//       }
//     } else {
//       throw new Error(`Failed to Find Items !`);
//     }

//     // HANDLE JOB STATUS
//     if (invType === `JOB`) {
//       if (!jobId) {
//         throw new Error(`Job Id Not Found !`);
//       }
//       const jobStatusSql = `UPDATE job_header SET state=?, invoice_Id=?, updated_at=NOW() WHERE id=?`;
//       const resJobStatus = await connection.execute(jobStatusSql, [
//         3,
//         header_id,
//         jobId,
//       ]);

//       if (resJobStatus.affectedRows === 0) {
//         throw new Error(`Update Job Payment Failed !`);
//       }
//     }

//     await connection.commit();

//     if (customerState == `1`) {
//       await sendSms(
//         customerPhone,
//         customerTemplates.CREATE({
//           customerName: customerName,
//         }),
//       );
//     }

//     await sendSms(
//       customerPhone,
//       invoiceTempaltes.THANKYOU({
//         customerName,
//         docType,
//       }),
//     );

//     return NextResponse.json(
//       {
//         success: true,
//         invoiceNo: invNo,
//         invoiceId: header_id,
//         date: format_date(Date.now()),
//       },
//       { status: 200 },
//     );
//   } catch (err) {
//     await connection.rollback();
//     console.log("Transaction Failed ! :", err.message);
//     return NextResponse.json(
//       { error: err.message || "Internal Server Error" },
//       { status: 500 },
//     );
//   } finally {
//     connection.release();
//   }
// };
