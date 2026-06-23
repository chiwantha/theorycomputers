import { query } from "@/lib/db";

export const load_master_items = async (item_id) => {
  try {
    let sql_query;
    const sql = `SELECT mst_items.* , mst_category.name AS category, mst_category.id AS category_id, mst_brand.name AS brand, mst_brand.id AS brand_id 
    , COALESCE(mst_warranty.name, '-') AS warranty_name FROM mst_items
    INNER JOIN mst_category ON mst_items.category_id = mst_category.id
    INNER JOIN mst_brand ON mst_items.brand_id = mst_brand.id
    LEFT JOIN mst_warranty ON mst_items.warranty_id = mst_warranty.id
    WHERE mst_items.state = 1`;
    const sql2 = `SELECT mst_items.* , mst_category.name AS category, mst_category.id AS category_id, mst_brand.name AS brand, mst_brand.id AS brand_id 
    , COALESCE(mst_warranty.name, '-') AS warranty_name FROM mst_items
    INNER JOIN mst_category ON mst_items.category_id = mst_category.id
    INNER JOIN mst_brand ON mst_items.brand_id = mst_brand.id
    LEFT JOIN mst_warranty ON mst_items.warranty_id = mst_warranty.id
    WHERE mst_items.state = 1 AND mst_items.id=${item_id}`;

    if (item_id) {
      sql_query = sql2;
    } else {
      sql_query = sql;
    }

    const data = await query(sql_query);

    if (!data || data.length == 0) {
      return [];
    }

    return data;
  } catch (err) {
    console.log(`Error Loading Items List !`, err);
    return [];
  }
};
export const load_master_categories = async (category_id) => {
  try {
    let sql_query;
    const sql = `SELECT id, name, created_at AS date FROM mst_category WHERE state=1`;
    const sql2 = `SELECT id, name, created_at AS date FROM mst_category WHERE state=1 AND id=${category_id}`;

    if (category_id) {
      sql_query = sql2;
    } else {
      sql_query = sql;
    }

    const data = await query(sql_query);

    if (!data || data.length == 0) {
      return [];
    }

    return data;
  } catch (err) {
    console.log(`Error Loading Category List !`, err);
    return [];
  }
};
export const load_master_brands = async (brand_id) => {
  try {
    let sql_query;
    const sql = `SELECT id, name, created_at AS date FROM mst_brand WHERE state=1`;
    const sql2 = `SELECT id, name, created_at AS date FROM mst_brand WHERE state=1 AND id=${brand_id}`;

    if (brand_id) {
      sql_query = sql2;
    } else {
      sql_query = sql;
    }

    const data = await query(sql_query);

    if (!data || data.length == 0) {
      return [];
    }

    return data;
  } catch (err) {
    console.log(`Error Loading Brands List !`, err);
    return [];
  }
};
export const load_master_suppliers = async (supplier_id) => {
  try {
    let sql_query;
    const sql = `SELECT * FROM mst_suppliers WHERE state=1`;
    const sql2 = `SELECT * FROM mst_suppliers WHERE state=1 AND id=${supplier_id}`;

    if (supplier_id) {
      sql_query = sql2;
    } else {
      sql_query = sql;
    }

    const data = await query(sql_query);

    if (!data || data.length == 0) {
      return [];
    }

    return data;
  } catch (err) {
    console.log(`Error Loading Suppliers List !`, err);
    return [];
  }
};
export const load_master_warranties = async (warranty_id) => {
  try {
    let sql_query;
    const sql = `SELECT id, name, type, duration FROM mst_warranty WHERE state=1`;
    const sql2 = `SELECT id, name, type, duration FROM mst_warranty WHERE state=1 AND id=${warranty_id}`;

    if (warranty_id) {
      sql_query = sql2;
    } else {
      sql_query = sql;
    }

    const data = await query(sql_query);

    if (!data || data.length == 0) {
      return [];
    }

    return data;
  } catch (err) {
    console.log(`Error Loading Warranty List !`, err);
    return [];
  }
};
