import { loadJob, updateJob } from "@/features/jobs/service";
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
  try {
    const { job_id } = await params;
    const data = await request.formData();
    const body = Object.fromEntries(data.entries());

    await updateJob({ jobId: job_id, ...body });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: err.message },
      { status: err.status || 500 },
    );
  }
};
