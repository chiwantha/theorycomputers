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
    const data = await request.json();
    const { header, ...rest } = data;

    await updateJob({
      header: { ...header, jobId: job_id },
      ...rest,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: err.message },
      { status: err.status || 500 },
    );
  }
};
