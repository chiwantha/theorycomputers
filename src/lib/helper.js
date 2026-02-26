import fs from "fs";
import path from "path";

export async function saveImage(file, filename, location = "/uploads") {
  try {
    if (!file) return { done: false, error: "No file provided" };

    // Ensure upload folder exists
    const uploadDir = path.join(process.cwd(), "public", location);
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    // Clean name and always use .png
    const safeName = filename.replace(/\s+/g, "_");
    const filePath = path.join(uploadDir, `${safeName}.png`);

    // Convert and save
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filePath, buffer);

    return { done: true, fileUrl: `${location}/${safeName}.png` };
  } catch (err) {
    console.error("saveImage error:", err);
    return { done: false, error: err.message };
  }
}
