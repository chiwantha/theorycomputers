export const invoiceTempaltes = {
  THANKYOU: ({ customerName, docType }) => `
Hello ${customerName},

${
  docType === "QUOTATION"
    ? `Thank you for requesting a quotation from Theory Computer Solutions. Please let us know if you have any questions or would like to proceed.`
    : `Thank you for your purchase and for choosing Theory Computer Solutions.`
}

Regards,
Theory Computer Solutions
`,
};
