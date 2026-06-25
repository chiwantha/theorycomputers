import InvoicePreview from "@/components/pos/sections/terminal/InvoicePreview";

const InvoicePreviewPage = async ({ params }) => {
  const { invoiceNo } = await params;
  return (
    <div>
      <InvoicePreview />
    </div>
  );
};

export default InvoicePreviewPage;
