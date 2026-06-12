import pool from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  //   const connection = await pool.getConnection();
  try {
    const data = await request.formData();
    const invItems = JSON.parse(data.get("invItems"));
    console.log(data);

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
