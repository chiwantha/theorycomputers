import pool from "@/lib/db";
import { validateJobItems } from "@/lib/validation";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    return NextResponse.json({ success: true }, { status: 200 });
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

    await connection.beginTransaction();

    // INSERT HEADER
    const jobHeaderSql = `INSERT INTO job_header (job_no, customer_id, warranty, advance) VALUES (?,?,?,?)`;
    const [resJobHeader] = await connection.execute(jobHeaderSql, [
      data.jobNo,
      data.customerId,
      data.warranty,
      data.advance,
    ]);
    if (!resJobHeader.insertId) {
      throw new Error("Job Header Failed !");
    }

    console.log(data);
    console.log(jobItems);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    // await connection.rollback();
    console.log("Transaction failed:", err.message);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 },
    );
  } finally {
    // connection.release();
  }
};
