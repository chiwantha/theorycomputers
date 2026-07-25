import { query } from "@/lib/db";

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
