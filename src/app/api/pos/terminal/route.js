import pool from "@/lib/db";
import { generateDocNo } from "@/lib/utils";
import { validateInvItems } from "@/lib/validation";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const connection = await pool.getConnection();
  try {
    // DATA
    const data = await request.formData();

    // HEADER DATA EXTRACT
    const docType = data.get(`docType`);
    const invNo =
      docType === `INVOICE` ? generateDocNo(`INV`) : generateDocNo(`QUT`);
    const invType = data.get(`invType`);
    const quoteId = data.get(`quoteId`) || null;
    const jobId = data.get(`jobId`) || null;
    const customerState = data.get(`customerState`);
    const customerId = data.get(`customerId`);
    const customerName = data.get(`customerName`);
    const customerPhone = data.get(`customerPhone`);
    const grossTotal = data.get(`grossTotal`);
    const discount = data.get(`discount`) || null;
    const netTotal = data.get(`netTotal`);
    const settlement =
      data.get(`paymentMethod`) == `CREDIT` ? `CREDIT` : `IMMEDIATE`;
    const creditAmount = data.get(`creditAmount`) || null;
    const dueDate = data.get(`dueDate`) || null;
    const userId = data.get(`userId`);
    const note = data.get(`note`) || null;

    // INVOICE ITEMS
    const invItems = JSON.parse(data.get("invItems"));
    if (invItems.length > 0) {
      const validation = validateInvItems(invItems);
      if (validation.error) {
        throw new Error(validation.error);
      }
    }

    // PAYMENT DATA
    const paymentMethod = data.get(`paymentMethod`);
    const downPayment = data.get(`downPayment`) || null;
    const cashAmount = data.get(`cashAmount`) || null;
    const cardAmount = data.get(`cardAmount`) || null;
    const bankAmount = data.get(`bankAmount`) || null;
    const cardType = data.get(`cardType`) || null;
    const cardDigits = data.get(`cardDigits`) || null;
    const bankReference = data.get(`bankReference`) || null;

    // ARRANGE PAYMENTS ARRAY
    const payment_rows = [];
    if (Number(cashAmount) > 0) {
      payment_rows.push({
        paymentType: `FULL`,
        paymentMethod: "CASH",
        amount: Number(cashAmount),
        cardType: null,
        cardDigits: null,
        bankReference: null,
      });
    }
    if (Number(cardAmount) > 0) {
      payment_rows.push({
        paymentMethod: "CARD",
        paymentType: `FULL`,
        amount: Number(cardAmount),
        cardType,
        cardDigits,
        bankReference: null,
      });
    }
    if (Number(bankAmount) > 0) {
      payment_rows.push({
        paymentType: `FULL`,
        paymentMethod: "BANK",
        amount: Number(bankAmount),
        cardType: null,
        cardDigits: null,
        bankReference,
      });
    }
    if (
      paymentMethod === "CREDIT" &&
      Number(downPayment) > 0 &&
      payment_rows.length === 0
    ) {
      payment_rows.push({
        paymentType: `DOWN`,
        paymentMethod: "CASH",
        amount: Number(downPayment),
        cardType: null,
        cardDigits: null,
        bankReference: null,
      });
    }

    await connection.beginTransaction();

    // HANDLE CUSTOMER
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

    // INSERT INV HEADER
    const invHeaderSql = `INSERT INTO inv_header (inv_no, doc_type, date, inv_type, job_id, quote_id, gross_total, discount, net_total, settlement, credit_amount, due_date, note, user_id) 
    VALUES (?,?,NOW(),?,?,?,?,?,?,?,?,?,?,?)`;
    const [resInvHeader] = await connection.execute(invHeaderSql, [
      invNo,
      docType,
      invType,
      jobId,
      quoteId,
      grossTotal,
      discount,
      netTotal,
      settlement,
      creditAmount,
      dueDate,
      note,
      userId,
    ]);
    if (!resInvHeader.insertId) {
      throw new Error("Invoice Header Failed !");
    }

    const header_id = resInvHeader.insertId;

    // PAYMENTS
    console.log(payment_rows);
    throw new Error(`Okay OKay `);
    await connection.commit();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    // await connection.rollback();
    console.log("Transaction Failed ! :", err.message);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 },
    );
  } finally {
    connection.release();
  }
};
