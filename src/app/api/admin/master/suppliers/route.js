import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  try {
    const sql = `SELECT * FROM mst_suppliers WHERE state=1`;
    const res = await query(sql);

    if (!res || res.length == 0) {
      return NextResponse.json(
        { error: `No Suppliers Found !` },
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
    const data = await request.formdata();
    const name = data.get("name");
    const agent = data.get("agent");
    const phone = data.get("phone");
    const whatsapp = data.get("whatsapp");
    const email = data.get("email");
    const address = data.get("address");

    const sql = `INSERT INTO mst_suppliers (name, agent, phone, whatsapp, email, address) VALUES (?,?,?,?,?,?)`;
    const values = [name, agent, phone, whatsapp, email, address];

    const res = await query(sql, values);

    if (!res || res.insertId == null) {
      return NextResponse.json({ error: `Insert Failed !` }, { status: 400 });
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
