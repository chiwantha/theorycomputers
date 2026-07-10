import { query } from "@/lib/db";

export const load_rpt_sale = async () => {
  try {
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

    const data = await query(sql);

    if (!data || data.length == 0) {
      return [];
    }

    return data;
  } catch (err) {
    console.log(`Error Loading Sale !`, err);
    return [];
  }
};
