import { query } from "@/lib/db";

export const load_rpt_invoice_list = async () => {
  try {
    const sql = `
        SELECT
        ih.inv_no,
        ih.inv_no AS id,
        ih.doc_type,
        ih.date,
        ih.inv_type,
        CASE
            WHEN ih.inv_type = 'JOB' THEN ih.job_id
            WHEN ih.inv_type = 'QUOTE' THEN ih.quote_id
            WHEN ih.inv_type = 'DIRECT' THEN '-'
            ELSE 'ERR'
        END AS reference,

        ih.gross_total,
        ih.discount,
        ih.net_total,

        CASE
            WHEN ih.settlement = 'IMMEDIATE' THEN 'IMMEDIATE'
            WHEN ih.settlement = 'CREDIT' THEN CONCAT('CREDIT / ', ih.credit_amount)
            ELSE 'UNKNOWN'
        END AS settlement,

        mu.last_name AS cashier,

        (
            SELECT COUNT(*)
            FROM inv_details idt
            WHERE idt.header_id = ih.id
        ) AS items_count,

        CONCAT(ct.first_name, ' ', ct.last_name) AS customer_name,
        ct.phone AS customer_phone

        FROM inv_header ih

        INNER JOIN customers ct
            ON ih.customer_id = ct.id

        INNER JOIN mst_users mu
            ON ih.user_id = mu.id

        WHERE DATE(ih.date) = CURDATE()

        ORDER BY ih.created_at DESC;
    `;

    const data = await query(sql);

    if (!data || data.length == 0) {
      return [];
    }

    return data;
  } catch (err) {
    console.log(`Error Loading Invoice List !`, err);
    return [];
  }
};
