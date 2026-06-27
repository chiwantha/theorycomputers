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
    const sql = `
SELECT 
    mst_items.id AS value,
    mst_items.name AS label,
    mst_items.*,
    mst_category.name AS category,
    mst_items.is_serial,
    COALESCE(stock.quantity, 0) AS stock,

    COALESCE(
        JSON_ARRAYAGG(
            CASE 
                WHEN stock_items_serials.stock = 1 
                THEN stock_items_serials.serial
            END
        ),
        JSON_ARRAY()
    ) AS serials

FROM mst_items

LEFT JOIN stock 
    ON mst_items.id = stock.item_id

LEFT JOIN stock_items_serials 
    ON mst_items.id = stock_items_serials.item_id

INNER JOIN mst_category 
    ON mst_items.category_id = mst_category.id

WHERE mst_items.state = 1

GROUP BY mst_items.id

ORDER BY stock DESC;
`;

    const data = await query(sql);

    if (!data || data.length == 0) {
      return [];
    }

    return data.map((item) => {
      let serials = [];

      try {
        serials = JSON.parse(item.serials || "[]");
      } catch (e) {
        serials = [];
      }

      return {
        ...item,
        serials: serials.filter(Boolean).map((s) => ({
          label: s,
          value: s,
        })),
      };
    });
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
export const get_quotations = async () => {
  try {
    const sql = `SELECT inv_header.id AS value, CONCAT(inv_header.inv_no, " - ", CONCAT(customers.first_name, " ", customers.last_name), " - ", customers.phone) AS label FROM inv_header 
    INNER JOIN customers ON inv_header.customer_id = customers.id
    WHERE inv_header.is_qoute = 1 AND inv_header.state = 1`;

    const data = await query(sql);

    if (!data || data.length == 0) {
      return [];
    }

    return data;
  } catch (err) {
    console.log(`Error Loading Quotations List !`, err);
    return [];
  }
};
export const get_items_for_job = async (job_id) => {
  try {
    const extraCondition = job_id
      ? `OR (stock_items_serials.reference = 'JOB' AND stock_items_serials.reference_id = ${job_id})`
      : "";

    const sql = `
SELECT 
    mst_items.id AS value,
    mst_items.id,
    mst_items.name AS label,
    mst_items.*,
    mst_category.name AS category,
    mst_items.is_serial,
    COALESCE(stock.quantity, 0) AS stock,

    COALESCE(
        JSON_ARRAYAGG(
            CASE 
                WHEN stock_items_serials.stock = 1
                ${extraCondition}
                THEN stock_items_serials.serial
            END
        ),
        JSON_ARRAY()
    ) AS serials

FROM mst_items

LEFT JOIN stock 
    ON mst_items.id = stock.item_id

LEFT JOIN stock_items_serials 
    ON mst_items.id = stock_items_serials.item_id

INNER JOIN mst_category 
    ON mst_items.category_id = mst_category.id

WHERE mst_items.state = 1

GROUP BY mst_items.id

ORDER BY stock DESC;
`;

    const data = await query(sql);

    if (!data || data.length == 0) {
      return [];
    }

    return data.map((item) => {
      let serials = [];

      try {
        serials = JSON.parse(item.serials || "[]");
      } catch (e) {
        serials = [];
      }

      return {
        ...item,
        serials: serials.filter(Boolean).map((s) => ({
          label: s,
          value: s,
        })),
      };
    });
  } catch (err) {
    console.log(`Error Loading Items List !`, err);
    return [];
  }
};
export const get_warranties = async () => {
  try {
    const sql = `SELECT mw.id AS value, mw.name AS label, mw.* FROM mst_warranty mw WHERE state = 1`;

    const data = await query(sql);

    if (!data || data.length == 0) {
      return [];
    }

    return data;
  } catch (err) {
    console.log(`Error Loading Warranty List !`, err);
    return [];
  }
};
export const get_jobs = async () => {
  try {
    const sql = `SELECT jh.id AS value, CONCAT(jh.job_no, " - ", c.phone) AS label, jh.* FROM job_header jh
    INNER JOIN customers c ON c.id = jh.customer_id 
    WHERE jh.state=2 AND jh.invoice_id is NULL`;

    const data = await query(sql);

    if (!data || data.length == 0) {
      return [];
    }

    return data;
  } catch (err) {
    console.log(`Error Loading Job List !`, err);
    return [];
  }
};
