import pool from "@/lib/db";
import { validateInvItems } from "@/lib/validation";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  //   const connection = await pool.getConnection();
  try {
    const data = await request.formData();
    const invItems = JSON.parse(data.get("invItems"));

    if (invItems.length > 0) {
      const validation = validateInvItems(invItems);
      if (validation.error) {
        throw new Error(validation.error);
      }
    }

    // header data extract
    const invNo = data.get(`invNo`);
    const docType = data.get(`docType`);
    const invType = data.get(`invType`);
    const quoteId = data.get(`quoteId`);
    const jobId = data.get(`jobId`);
    const grossTotal = data.get(`grossTotal`);
    const discount = data.get(`discount`);
    const netTotal = data.get(`netTotal`);
    const settlement =
      data.get(`paymentMethod`) == `CREDIT` ? `CREDIT` : `IMMEDIATE`;
    const dueDate = data.get(`dueDate`);
    const userId = data.get(`userId`);
    const note = data.get(`note`);

    const invNo = data.get(`invNo`);
    const invNo = data.get(`invNo`);

    // await connection.commit();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    // await connection.rollback();
    console.log("Transaction Failed ! :", err.message);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 },
    );
  } finally {
    // connection.release();
  }
};
