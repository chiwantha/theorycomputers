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
export const get_suppliers = async () => {
  try {
    const sql = `SELECT id AS value, name AS label FROM mst_suppliers WHERE state = 1`;

    const data = await query(sql);

    if (!data || data.length == 0) {
      return [];
    }

    return data;
  } catch (err) {
    console.log(`Error Loading Suppliers List !`, err);
    return [];
  }
};
export const get_items = async () => {
  try {
    const sql = `SELECT mst_items.id AS value, mst_items.name AS label, mst_items.*, mst_items.is_serial FROM mst_items WHERE state = 1`;

    const data = await query(sql);

    if (!data || data.length == 0) {
      return [];
    }

    return data;
  } catch (err) {
    console.log(`Error Loading Items List !`, err);
    return [];
  }
};
export const get_customers = async () => {
  try {
    const sql = `SELECT id AS value, CONCAT(first_name, ' ', last_name, ' - ', phone) AS label, phone FROM customers WHERE state = 1`;

    const data = await query(sql);

    if (!data || data.length == 0) {
      return [];
    }

    return data;
  } catch (err) {
    console.log(`Error Loading Customers List !`, err);
    return [];
  }
};
