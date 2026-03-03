import { query } from "./db";

export const get_brands = async () => {
  try {
    const sql = `SELECT id AS value, name AS label FROM mst_brand WHERE state = 1`;

    const data = await query(sql);

    if (!data || data.length == 0) {
      return [];
    }

    return data;
  } catch (err) {
    console.log(`Error Loading Brands List !`, err);
    return [];
  }
};
export const get_categories = async () => {
  try {
    const sql = `SELECT id AS value, name AS label FROM mst_category WHERE state = 1`;

    const data = await query(sql);

    if (!data || data.length == 0) {
      return [];
    }

    return data;
  } catch (err) {
    console.log(`Error Loading Categories List !`, err);
    return [];
  }
};
