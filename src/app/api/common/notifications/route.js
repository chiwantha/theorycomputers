import { load_notifications } from "@/data/common/notifications";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const result = await load_notifications();
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: `Notification Error !` },
      { status: 500 },
    );
  }
};
