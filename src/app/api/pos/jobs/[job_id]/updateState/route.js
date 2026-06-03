import { jobTemplates } from "@/constant/SmsTemplate";
import { query } from "@/lib/db";
import { sendSms } from "@/lib/func";
import { NextResponse } from "next/server";

export const PUT = async (request, { params }) => {
  try {
    const { job_id } = await params;
    // console.log(job_id);
    const data = await request.json();

    // console.log(data);

    if (
      (!data ||
        data?.state === undefined ||
        data?.state === null ||
        data?.action === null ||
        data?.action == undefined ||
        data?.customerPhone == null ||
        data?.customerPhone == undefined,
      data?.customerName == null || data?.customerName == undefined,
      data?.jobNo == null || data?.jobNo == undefined,
      data?.netTotal == null || data?.netTotal == undefined)
    ) {
      throw new Error(`Missing Data on Server !`);
    }

    const sql = `UPDATE job_header SET state = ?, updated_at = NOW() WHERE id = ?`;
    const res = await query(sql, [data?.state, job_id]);
    if (!res || res.affectedRows === 0) {
      throw new Error(`Update State Failed on Server`);
    }

    if (data?.action == `Start`) {
      await sendSms(
        data?.customerPhone,
        jobTemplates.STARTED({
          customerName: data?.customerName,
          jobNo: data?.jobNo,
        }),
      );
    } else if (data?.action == `Finish`) {
      await sendSms(
        data?.customerPhone,
        jobTemplates.FINISHED({
          customerName: data?.customerName,
          jobNo: data?.jobNo,
          netTotal: data?.netTotal,
        }),
      );
    } else if (data?.action == `Cancel`) {
      await sendSms(
        data?.customerPhone,
        jobTemplates.CANCELLED({
          customerName: data?.customerName,
          jobNo: data?.jobNo,
          reason: `Customer requested cancellation`,
        }),
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.log(`Internal Server Error : `, err);
    return NextResponse.json(err?.message || `Internal Server Error ! `, {
      status: 500,
    });
  }
};
