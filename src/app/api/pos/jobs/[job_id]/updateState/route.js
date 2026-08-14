import { NextResponse } from "next/server";
import { updateJobState } from "@/features/jobs/service";

export const PUT = async (request, { params }) => {
  try {
    const { job_id } = await params;
    const data = await request.json();
    await updateJobState({ ...data, jobId: job_id });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: err.message },
      { status: err.status || 500 },
    );
  }
};
