import PosTerminal from "@/components/pos/forms/posterminal/PosTerminal";
import { get_customers, get_items } from "@/lib/data";

const TerminalPage = async () => {
  const customersList = await get_customers();
  const itemsList = await get_items();

  return <PosTerminal customersList={customersList} itemsList={itemsList} />;
};

export default TerminalPage;
