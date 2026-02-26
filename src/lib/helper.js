import fs from "fs";
import path from "path";
import sharp from "sharp";

export async function saveImage(file, filename, location = "/uploads") {
  try {
    if (!file) return { done: false, error: "No file provided" };

    // Ensure upload folder exists
    const uploadDir = path.join(process.cwd(), "public", location);
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    // Clean the filename and ensure .png
    const safeName = filename.replace(/\s+/g, "_").substring(0, 50); // optional max length
    const filePath = path.join(uploadDir, `${safeName}`);

    // Convert to PNG using sharp & reduce size
    const buffer = Buffer.from(await file.arrayBuffer());
    await sharp(buffer)
      .png({ quality: 80, compressionLevel: 8 }) // adjust quality/compression
      .resize({ width: 1200, withoutEnlargement: true }) // optional: max width 1200px
      .toFile(filePath);

    return { done: true, fileUrl: `${location}/${safeName}` };
  } catch (err) {
    console.error("saveImage error:", err);
    return { done: false, error: err.message };
  }
}

export function generateNames(name) {
  const cleanedName = (name || "").toLowerCase().replace(/[^a-z0-9]/g, "");

  let prefix = cleanedName.substring(0, 3);
  if (prefix.length < 3) {
    prefix = prefix.padEnd(3, "x");
  }

  const timePart = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 7);

  const unique = (timePart + randomPart).substring(0, 12);

  return `${prefix}${unique}.png`;
}
