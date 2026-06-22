import { query } from "@/lib/db";

export const load_inventory_adjustments = async (adjustment_id) => {
  try {
    let sql_query;
    const sql = `SELECT
        ah.id,
        ah.adj_no,
        ah.type,
        ah.date ,
        (
            SELECT COUNT(ad.id)
            FROM adj_details ad
            WHERE ad.header_id = ah.id
        ) AS item_count,

        (
            SELECT SUM(ad.quantity * mi.cost)
            FROM adj_details ad
            INNER JOIN mst_items mi
                ON mi.id = ad.item_id
            WHERE ad.header_id = ah.id
            AND ad.type = 'P'
        ) AS totalP,

        (
            SELECT SUM(ad.quantity * mi.cost)
            FROM adj_details ad
            INNER JOIN mst_items mi
                ON mi.id = ad.item_id
            WHERE ad.header_id = ah.id
            AND ad.type = 'M'
        ) AS totalM

    FROM adj_header ah`;
    const sql2 = ``;

    if (adjustment_id) {
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
    console.log(`Error Loading Adjustment List !`, err);
    return [];
  }
};
export const load_inventory_grns = async (grn_id) => {
  try {
    let sql_query;
    const sql = `SELECT 
  gh.*, 
  ms.name AS supplier_name,
  COUNT(gd.id) AS item_count
FROM grn_header gh
INNER JOIN mst_suppliers ms 
  ON ms.id = gh.supplier_id
LEFT JOIN grn_details gd 
  ON gd.header_id = gh.id
WHERE gh.state = 1
GROUP BY gh.id`;
    const sql2 = ``;

    if (grn_id) {
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
    console.log(`Error Loading Grn List !`, err);
    return [];
  }
};
export const load_inventory_serials = async (serial_id) => {
  try {
    let sql_query;
    const sql = `SELECT 
    stock_items_serials.*, 
    mst_items.name,
    CASE 
        WHEN stock_items_serials.stock = 1 THEN 'IN_STOCK'
        ELSE 'NOT_AVL'
    END AS stock_status
FROM stock_items_serials
INNER JOIN mst_items 
    ON mst_items.id = stock_items_serials.item_id
WHERE mst_items.state = 1 AND stock_items_serials.stock = 1
ORDER BY stock_items_serials.stock DESC, stock_items_serials.id ASC`;
    const sql2 = ``;

    if (serial_id) {
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
    console.log(`Error Loading Serials List !`, err);
    return [];
  }
};
