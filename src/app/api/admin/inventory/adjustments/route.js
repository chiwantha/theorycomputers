import { NextResponse } from "next/server";

export const POST = async (request) => {
  try {
    const data = await request.formData();
    console.log(data);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.log("Transaction failed:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 },
    );
  }
};
