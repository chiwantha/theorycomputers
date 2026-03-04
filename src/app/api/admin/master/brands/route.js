import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  try {
    const sql = `SELECT id, name, created_at AS date FROM mst_brand WHERE state=1`;
    const res = await query(sql);

    if (!res || res.length == 0) {
      return NextResponse.json({ error: `No Brand Found !` }, { status: 404 });
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

    const sql = `INSERT INTO mst_brand (name) VALUES (?)`;
    const values = [name];

    const res = await query(sql, values);

    if (!res || res.insertId == null) {
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

export const PUT = async (request) => {
  try {
    const data = await request.formData();

    const id = data.get(`id`);
    const name = data.get(`name`);

    if (!id || id == ``) {
      return NextResponse.json({ error: `No Id Found !` }, { status: 404 });
    }

    const sql = `UPDATE mst_brand SET name=? WHERE id=?`;
    const values = [name, id];
    const res = await query(sql, values);

    if (!res || res.affectedRows == 0) {
      return NextResponse.json({ error: `Update Failed !` }, { status: 400 });
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

export const DELETE = async (request) => {
  try {
    const data = await request.formData();
    const id = data.get(`id`);

    if (!id || id == ``) {
      return NextResponse.json({ error: `No Id Found !` }, { status: 404 });
    }

    const sql = `UPDATE mst_brand SET state=0 WHERE id=?`;
    const res = await query(sql, [id]);

    if (!res || res.affectedRows == 0) {
      return NextResponse.json({ error: `Delete Failed !` }, { status: 400 });
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
