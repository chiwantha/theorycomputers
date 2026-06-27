import InvoicePreview from "@/components/pos/sections/terminal/InvoicePreview";
import { get_spc_invoices } from "@/lib/data";

const InvoicePreviewPage = async ({ params }) => {
  const { invoiceNo } = await params;
  const invoiceData = await get_spc_invoices(invoiceNo);
  return (
    <div>
      <InvoicePreview invoiceData={invoiceData} />
    </div>
  );
};

export default InvoicePreviewPage;
