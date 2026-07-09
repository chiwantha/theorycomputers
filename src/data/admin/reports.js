import { query } from "@/lib/db";

export const load_rpt_stock = async (item_id) => {
  try {
    let sql_query;
    const sql = `SELECT 
    stock.*, 
     CASE 
        WHEN stock.quantity < COALESCE(mst_items.reorder_level, 0) 
        THEN 'LOW' 
        ELSE 'NORMAL' 
    END AS stock_level,
    mst_items.name, 
    mst_items.cost, 
    (stock.quantity * mst_items.cost) AS stock_average_worth
FROM stock
INNER JOIN mst_items 
    ON mst_items.id = stock.item_id 
WHERE mst_items.state = 1`;
    const sql2 = `SELECT 
    stock.*, 
    mst_items.name, 
    mst_items.cost, 
    (stock.quantity * mst_items.cost) AS stock_average_worth
FROM stock
INNER JOIN mst_items 
    ON mst_items.id = stock.item_id 
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
    console.log(`Error Loading Stock !`, err);
    return [];
  }
};
