import { query } from "@/lib/db";
import { generateNames, saveImage } from "@/lib/helper";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  try {
    const data = await request.formData();

    const id = data.get("id") || null;
    const code = data.get("code") || null;
    const name = data.get("name");
    const brand = data.get("brand");
    const category = data.get("category");
    const description = data.get("description") || null;
    const cost = data.get("cost");
    const selling = data.get("selling");
    const serial = data.get("serial");

    const image = data.get("image") || null; // 👈 this is File object

    let saveIamge = {};
    if (image) {
      saveIamge = await saveImage(
        image,
        generateNames(image?.name),
        `/master/items`,
      );
    }

    let save_query = "";

    if (id == "" || id == null) {
      save_query = `INSERT INTO mst_items ( code, name, description, image, category_id, brand_id, cost, selling, is_serial, reorder_level ) VALUES (?,?,?,?,?,?,?,?,?,?)`;
    }

    const res = await query(save_query, [
      code,
      name,
      description,
      saveIamge?.fileUrl || null,
      category,
      brand,
      cost,
      selling,
      serial,
      "5",
    ]);

    console.log(res);

    return NextResponse.json({ message: "Received", name }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: `Internal Server Error !`, err },
      { status: 500 },
    );
  }
};
