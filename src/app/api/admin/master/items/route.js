import { query } from "@/lib/db";
import { generateNames, saveImage } from "@/lib/helper";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  try {
    const sql = `SELECT mst_items.* , mst_category.name AS category, mst_category.id AS category_id, mst_brand.name AS brand, mst_brand.id AS brand_id 
    , COALESCE(mst_warranty.name, '-') AS warranty_name FROM mst_items
    INNER JOIN mst_category ON mst_items.category_id = mst_category.id
    INNER JOIN mst_brand ON mst_items.brand_id = mst_brand.id
    LEFT JOIN mst_warranty ON mst_items.warranty_id = mst_warranty.id
    WHERE mst_items.state = 1`;

    const data = await query(sql);

    if (!data || data.length == 0) {
      return NextResponse.json([], { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.log(`Internal Server Error :`, err);
    return NextResponse.json(
      { erroe: `Internal Server Error !` },
      { status: 500 },
    );
  }
};

export const POST = async (request) => {
  try {
    const data = await request.formData();

    const code = data.get("code") || null;
    const name = data.get("name");
    const brand = data.get("brand");
    const category = data.get("category");
    const description = data.get("description") || null;
    const warranty =
      data.get("warranty") === "null" || data.get("warranty") === ""
        ? null
        : Number(data.get("warranty"));
    const cost = data.get("cost");
    const selling = data.get("selling");
    const reorder = data.get("reorder");
    const serial = data.get("serial");
    const type = data.get("type");
    const online = data.get("online");
    const image = data.get("image");

    let savedImage = null;
    if (image) {
      if (image instanceof File) {
        // 👉 New file → upload it
        savedImage = await saveImage(
          image,
          generateNames(image.name),
          `/master/items`,
        );
        savedImage = savedImage?.fileUrl;
      } else if (typeof image === "string") {
        // 👉 Already a URL/path → keep as-is
        savedImage = image;
      }
    }

    // console.log(...data, { imagesave: savedImage });
    // return NextResponse.json(true, { status: 200 });

    const save_query = `INSERT INTO mst_items ( code, name, description, image, category_id,
     brand_id, warranty_id, cost, selling, is_serial, reorder_level, type, online )
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    const res = await query(save_query, [
      code,
      name,
      description,
      savedImage,
      category,
      brand,
      warranty,
      cost,
      selling,
      serial,
      reorder,
      type,
      online,
    ]);

    if (!res || res.insertId == null) {
      return NextResponse.json({ error: `Insert Failed !` }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: `Internal Server Error !`, err },
      { status: 500 },
    );
  }
};

export const PUT = async (request) => {
  try {
    const data = await request.formData();

    const id = data.get("id") || null;
    const code = data.get("code") || null;
    const name = data.get("name");
    const brand = data.get("brand");
    const category = data.get("category");
    const description = data.get("description") || null;
    const warranty =
      data.get("warranty") === "null" || data.get("warranty") === ""
        ? null
        : Number(data.get("warranty"));
    const cost = data.get("cost");
    const selling = data.get("selling");
    const reorder = data.get("reorder");
    const serial = data.get("serial");
    const type = data.get("type");
    const online = data.get("online");
    const image = data.get("image");

    let savedImage = null;
    if (image) {
      if (image instanceof File) {
        // 👉 New file → upload it
        savedImage = await saveImage(
          image,
          generateNames(image.name),
          `/master/items`,
        );
        savedImage = savedImage?.fileUrl;
      } else if (typeof image === "string") {
        // 👉 Already a URL/path → keep as-is
        savedImage = image;
      }
    }

    if (!id || id == "") {
      return NextResponse.json({ error: `Id Not Found !` }, { status: 404 });
    }

    const sql = `UPDATE mst_items SET code=?, name=?, description=?, image=?, category_id=?, brand_id=?, warranty_id=?, cost=?, selling=?, is_serial=?, reorder_level=?, type=?, online=? WHERE id=?`;

    const values = [
      code,
      name,
      description,
      savedImage,
      category,
      brand,
      warranty,
      cost,
      selling,
      serial,
      reorder,
      type,
      online,
      id,
    ];

    const res = await query(sql, values);

    if (!res || res.affectedRows == 0) {
      return NextResponse.json({ error: `Update Failed !` }, { status: 400 });
    }
    // return NextResponse.json(true, { status: 200 });
    return NextResponse.json(`In put Method !`, { status: 200 });
  } catch (err) {
    console.log(`Internal Server Error ! : `, err);
    return NextResponse.json(
      { error: `Internal Server Error !` },
      { status: 500 },
    );
  }
};

export const DELETE = async (request) => {
  try {
    const data = await request.formData();
    const id = data.get("id") || null;

    if (!id || id == "") {
      return NextResponse.json({ error: `Id Not Found !` }, { status: 404 });
    }

    const sql = `UPDATE mst_items SET state=0 WHERE id=?`;
    const res = await query(sql, [id]);

    if (!res || res.affectedRows == 0) {
      return NextResponse.json({ error: `Delete Failed !` }, { status: 400 });
    }
    return NextResponse.json({ message: `Deleted : `, id }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: `Internal Server Error !`, err },
      { status: 500 },
    );
  }
};
