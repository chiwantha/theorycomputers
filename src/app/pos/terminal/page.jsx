import Terminal from "@/features/invoices/components/Terminal";
import { get_customers, get_items, get_jobs, get_warranties } from "@/lib/data";

const TerminalPage = async () => {
  const customersList = await get_customers();
  const itemsList = await get_items();
  const jobList = await get_jobs();
  const warrantyList = await get_warranties();
  // const quotationList = await get_quotations();

  return (
    <Terminal
      customersList={customersList}
      itemsList={itemsList}
      jobList={jobList}
      warrantyList={warrantyList}
      // quotationList={quotationList}
    />
  );
};

export default TerminalPage;
