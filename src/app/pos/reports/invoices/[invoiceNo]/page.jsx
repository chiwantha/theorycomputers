import InvoicePreview from "@/features/invoices/components/InvoicePreview";
import { load_per_invoice } from "@/data/pos/terminal";

const InvoicePreviewPage = async ({ params }) => {
  const { invoiceNo } = await params;
  const invoiceData = await load_per_invoice(invoiceNo);
  return (
    <InvoicePreview
      invoiceData={invoiceData}
      backURL={`/pos/reports/invoices`}
    />
  );
};

export default InvoicePreviewPage;
