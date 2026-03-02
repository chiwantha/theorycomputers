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
    const reorder = data.get("reorder");
    const serial = data.get("serial");
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

    let save_query = "";

    if (id == "" || id == null) {
      save_query = `INSERT INTO mst_items ( code, name, description, image, category_id, brand_id, cost, selling, is_serial, reorder_level ) VALUES (?,?,?,?,?,?,?,?,?,?)`;
    }

    const res = await query(save_query, [
      code,
      name,
      description,
      savedImage,
      category,
      brand,
      cost,
      selling,
      serial,
      reorder,
    ]);

    console.log(res);

    return NextResponse.json({ message: `Saved : `, res }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: `Internal Server Error !`, err },
      { status: 500 },
    );
  }
};
