import { query } from "@/lib/db";
import { smsBalance } from "@/lib/func";

export const load_notifications = async () => {
  try {
    const low_stock_sql = `SELECT
    COUNT(stock.id) AS low_stock
FROM stock
INNER JOIN mst_items
    ON mst_items.id = stock.item_id
WHERE mst_items.state = 1
  AND stock.quantity <= COALESCE(mst_items.reorder_level, 0)`;
    const low_stock_res = await query(low_stock_sql);

    const today_issued_invoices = `SELECT COUNT(id) FROM inv_header WHERE DATE(date) = CURDATE()`;
    const issued_invoices_res = await query(today_issued_invoices);

    const sms_balance = await smsBalance();

    const data = {
      low_stock_count: low_stock_res?.[0]?.low_stock ?? 0,
      today_issued_count: issued_invoices_res?.[0]?.["COUNT(id)"] ?? 0,
      sms_balance: sms_balance?.remaining_unit || 0,
    };

    return data;
  } catch (err) {
    console.log(`Error Loading Notifications !`, err);
    return [];
  }
};
