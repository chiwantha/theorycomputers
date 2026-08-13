import { createJob, loadJobList } from "@/features/jobs/service";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const res = await loadJobList(data);

    return NextResponse.json(res, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.status || 500 },
    );
  }
};

export const POST = async (request) => {
  try {
    const data = await request.json();

    await createJob(data);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: err.message },
      { status: err.status || 500 },
    );
  }
};
