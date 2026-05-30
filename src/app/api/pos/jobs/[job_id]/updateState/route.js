import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export const PUT = async (request, { params }) => {
  try {
    const { job_id } = await params;
    console.log(job_id);
    const data = await request.json();

    if (!data || data?.state === undefined || data?.state === null) {
      throw new Error(`Missing Data on Server !`);
    }

    const sql = `UPDATE job_header SET state = ?, updated_at = NOW() WHERE id = ?`;
    const res = await query(sql, [data?.state, job_id]);
    if (!res || res.affectedRows === 0) {
      throw new Error(`Update State Failed on Server`);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.log(`Internal Server Error : `, err);
    return NextResponse.json(err?.message || `Internal Server Error ! `, {
      status: 500,
    });
  }
};
