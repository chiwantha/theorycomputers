import PosTerminal from "@/components/pos/forms/terminal/PosTerminal";
import { get_customers, get_items, get_quotations } from "@/lib/data";

const TerminalPage = async () => {
  const customersList = await get_customers();
  const itemsList = await get_items();
  // const quotationList = await get_quotations();

  return (
    <PosTerminal
      customersList={customersList}
      itemsList={itemsList}
      // quotationList={quotationList}
    />
  );
};

export default TerminalPage;
