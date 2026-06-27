export const load_per_invoice = async (invNo) => {
  if (!invNo) {
    return {
      success: false,
      message: `Invalid Invoice No !`,
    };
  }
  try {
    const invHeaderSql = `SELECT it.* , CONCAT(ct.first_name, " ", ct.last_name) AS customerName , ct.phone FROM inv_header it 
    INNER JOIN customers ct ON ct.id = it.customer_id WHERE it.inv_no=?`;
    const invHeaderRes = await query(invHeaderSql, [invNo]);
    if (!invHeaderRes || invHeaderRes.length === 0) {
      return {
        success: false,
        message: `No Invoice Found !`,
      };
    }
    const header_id = invHeaderRes[0]?.id;
    const job_id = invHeaderRes[0]?.job_id || null;

    const invItemsSql = `SELECT item_id, item_name, unit_selling, quantity, line_total, warranty_id, warranty_name FROM inv_details WHERE header_id = ?`;
    const invDetailsRes = await query(invItemsSql, [header_id]);
    if (!invDetailsRes || invDetailsRes.length === 0) {
      return {
        success: false,
        message: `No Invoice Details Found !`,
      };
    }

    const invItemSerials = `SELECT item_id,serial FROM stock_items_serials WHERE reference=? AND reference_id=?`;
    const invItemSerialsRes = await query(invItemSerials, [`INV`, header_id]);

    const details = invDetailsRes.map((item) => {
      const serials = invItemSerialsRes
        .filter((s) => s.item_id === item.item_id)
        .map((s) => s.serial);

      return {
        ...item,
        serial: serials.length > 0,
        serials,
      };
    });

    let paymentConditions = job_id ? `OR (reference=? AND reference_id=?)` : ``;
    let paymentValues = job_id
      ? [`INVOICE`, header_id, `JOB`, job_id]
      : [`INVOICE`, header_id];
    const invPaymentsSql = `SELECT reference AS doc, payment_type, payment_method, amount FROM trn_payments WHERE (reference=? AND reference_id=?) ${paymentConditions}`;
    const resInvPayments = await query(invPaymentsSql, paymentValues);

    // console.log(resInvPayments);

    return {
      success: true,
      message: `Nice`,
      data: {
        header: invHeaderRes[0],
        details: details,
        payments: resInvPayments,
      },
    };
  } catch (err) {
    console.log(`Error Loading Invoice ${invNo} !`, err);
    return [];
  }
};
