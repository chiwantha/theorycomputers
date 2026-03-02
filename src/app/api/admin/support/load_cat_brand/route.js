import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const brands = await query(
      `SELECT id AS value , name AS label FROM mst_brand`,
    );
    const categories = await query(
      `SELECT id AS value, name AS label FROM mst_category`,
    );

    if (!brands || !categories) {
      return NextResponse.json(
        { error: `Something Went Wrong !` },
        { status: 500 },
      );
    }

    return NextResponse.json({ brands, categories }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      {
        categories: [],
        brands: [],
      },
      { status: 500 },
    );
  }
};
