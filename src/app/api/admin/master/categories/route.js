import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  try {
    const sql = `SELECT id, name FROM mst_category WHERE state=1`;
    const res = await query(sql);

    if (!res || res.length == 0) {
      return NextResponse.json(
        { error: `No Category Found !` },
        { status: 404 },
      );
    }

    return NextResponse.json(res, { status: 200 });
  } catch (err) {
    console.log(`Internal Server Error : `, err);
    return NextResponse.json(
      { error: `Internal Server Error !` },
      { status: 200 },
    );
  }
};

export const POST = async (request) => {
  try {
    const data = await request.formData();

    const name = data.get(`name`);

    const sql = `INSERT INTO mst_category (name) VALUES (?)`;
    const values = [name];

    const res = await query(sql, values);

    if (!res || res.insertId == "") {
      return NextResponse.json({ error: `Insert Failed !` }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.log(`Internal Server Error : `, err);
    return NextResponse.json(
      { error: `Internal Server Error !` },
      { status: 200 },
    );
  }
};
