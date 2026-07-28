import { query } from "@/lib/db";
import { smsBalance } from "@/lib/func";

export const load_pos_dash_cards = async () => {
  try {
    const sql = `SELECT
        (SELECT COUNT(id)
        FROM inv_header
        WHERE date >= CURDATE()
          AND date < CURDATE() + INTERVAL 1 DAY
          AND doc_type = 'INVOICE'
          AND state = 1) AS issued_invoices,

        (SELECT COUNT(id)
        FROM inv_header
        WHERE date >= CURDATE()
          AND date < CURDATE() + INTERVAL 1 DAY
          AND doc_type = 'QUOTATION'
          AND state = 1) AS issued_quotations,

        (SELECT COUNT(id)
        FROM job_header
        WHERE state=0) AS pending_jobs,

        (SELECT COUNT(stock.id)
        FROM stock
        INNER JOIN mst_items
          ON mst_items.id = stock.item_id
        WHERE mst_items.state = 1
          AND stock.quantity <= COALESCE(mst_items.reorder_level, 0)
        ) AS low_stock,

        (SELECT COUNT(id)
        FROM customers
        WHERE YEAR(created_at) = YEAR(CURDATE())
          AND MONTH(created_at) = MONTH(CURDATE())
        ) AS new_customers;
    `;

    const res = await query(sql);

    if (!res || res.length == 0) {
      return [];
    }

    const smsRes = await smsBalance();

    return { ...res[0], sms_balance: smsRes?.remaining_unit };
  } catch (err) {
    console.log(`Error Loading Sale !`, err);
    return [];
  }
};
export const load_pos_chart_sale = async () => {
  try {
    const sql = `SELECT 
        DAY(ih.date) AS day,
        SUM(CASE 
            WHEN ih.inv_type = 'DIRECT' THEN ih.net_total 
            ELSE 0 
        END) AS direct_sale,

        SUM(CASE 
            WHEN ih.inv_type = 'JOB' THEN ih.net_total 
            ELSE 0 
        END) AS job_sale

    FROM inv_header ih

    WHERE 
        ih.state = 1
        AND MONTH(ih.date) = MONTH(CURDATE())
        AND YEAR(ih.date) = YEAR(CURDATE())
        AND ih.doc_type = "INVOICE"

    GROUP BY DAY(ih.date)

    ORDER BY DAY(ih.date) ASC;`;

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
export const load_payment_methods = async () => {
  try {
    const sql = `SELECT 
        SUM(CASE 
            WHEN tp.payment_method = 'CASH' THEN 1 
            ELSE 0 
        END) AS cash_method,

        SUM(CASE 
            WHEN tp.payment_method = 'CARD' THEN 1 
            ELSE 0 
        END) AS card_method,

        SUM(CASE 
            WHEN tp.payment_method = 'BANK' THEN 1 
            ELSE 0 
        END) AS bank_method

    FROM trn_payments tp WHERE 
        tp.state = 1
        AND MONTH(tp.created_at) = MONTH(CURDATE())
        AND YEAR(tp.created_at) = YEAR(CURDATE());`;

    const data = await query(sql);

    if (!data || data.length == 0) {
      return [];
    }

    return data;
  } catch (err) {
    console.log(`Error Loading Payment Method Counts !`, err);
    return [];
  }
};
export const load_pos_chart_revenue = async () => {
  try {
    const sql = `SELECT 
    SUM(ih.net_total) AS net_total,
    SUM(ih.discount) AS discount
    FROM inv_header ih
    WHERE ih.state=1 AND DATE(ih.date) = DATE(CURDATE()) AND ih.doc_type='INVOICE';`;

    const data = await query(sql);

    if (!data || data.length == 0) {
      return [];
    }

    return data;
  } catch (err) {
    console.log(`Error Loading Reveue Chart !`, err);
    return [];
  }
};
export const load_pos_recent_invoices = async () => {
  try {
    const sql = `SELECT 
    ih.inv_no AS id, 
    ih.inv_no, 
    COUNT(idet.id) AS items_count, 
    ih.net_total 
    FROM inv_header ih
    INNER JOIN inv_details idet ON ih.id = idet.header_id
    WHERE ih.state=1 
    GROUP BY ih.id 
    ORDER BY ih.date DESC LIMIT 10`;

    const data = await query(sql);

    if (!data || data.length == 0) {
      return [];
    }

    return data;
  } catch (err) {
    console.log(`Error Loading Recent Invoices !`, err);
    return [];
  }
};
