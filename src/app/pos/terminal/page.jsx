import Terminal from "@/components/pos/forms/terminal/Terminal";
import { get_customers, get_items, get_jobs, get_quotations } from "@/lib/data";

const TerminalPage = async () => {
  const customersList = await get_customers();
  const itemsList = await get_items();
  const jobList = await get_jobs();
  // const quotationList = await get_quotations();

  return (
    <Terminal
      customersList={customersList}
      itemsList={itemsList}
      jobList={jobList}
      // quotationList={quotationList}
    />
  );
};

export default TerminalPage;
