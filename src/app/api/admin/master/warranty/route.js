import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  try {
    const sql = `SELECT id, name, type, duration FROM mst_warranty WHERE state=1`;
    const res = await query(sql);

    if (!res || res.length == 0) {
      return NextResponse.json(
        { error: `No Warranty Found !` },
        { status: 404 },
      );
    }

    return NextResponse.json(res, { status: 200 });
  } catch (err) {
    console.log(`Internal Server Error : `, err);
    return NextResponse.json(
      { error: `Internal Server Error !` },
      { status: 500 },
    );
  }
};

export const POST = async (request) => {
  try {
    const data = await request.formData();

    const name = data.get(`name`);
    const type = data.get(`type`);
    const duration = data.get(`duration`);

    if (!name || !type || !duration) {
      return NextResponse.json({ error: "Data Missing !" }, { status: 404 });
    }

    const sql = `INSERT INTO mst_warranty (name, type, duration) VALUES (?,?,?)`;
    const res = await query(sql, [name, type, duration]);

    if (!res || res.insertId == null) {
      return NextResponse.json({ error: `Insert Failed !` }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.log(`Internal Server Error : `, err);
    return NextResponse.json(
      { error: `Internal Server Error !` },
      { status: 500 },
    );
  }
};

export const PUT = async (request) => {
  try {
    const data = await request.formData();

    const id = data.get(`id`);
    const name = data.get(`name`);
    const type = data.get(`type`);
    const duration = data.get(`duration`);

    if (!id || !name || !type || !duration) {
      return NextResponse.json({ error: "Data Missing !" }, { status: 404 });
    }

    const sql = `UPDATE mst_warranty SET name=?, type=?, duration=? WHERE id=?`;
    const res = await query(sql, [name, type, duration, id]);

    if (!res || res.affectedRows == 0) {
      return NextResponse.json({ error: `Update Failed !` }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.log(`Internal Server Error : `, err);
    return NextResponse.json(
      { error: `Internal Server Error !` },
      { status: 500 },
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

    const sql = `UPDATE mst_warranty SET state=0 WHERE id=?`;
    const res = await query(sql, [id]);

    if (!res || res.affectedRows == 0) {
      return NextResponse.json({ error: `Delete Failed !` }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.log(`Internal Server Error : `, err);
    return NextResponse.json(
      { error: `Internal Server Error !` },
      { status: 500 },
    );
  }
};
