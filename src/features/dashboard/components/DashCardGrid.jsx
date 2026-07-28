import DashCard from "@/features/dashboard/components/DashCard";
import { load_pos_dash_cards } from "@/data/pos/dashboard";
import {
  FileCheck,
  FileInput,
  Hammer,
  Mail,
  Package,
  User,
} from "lucide-react";

const cards = [
  {
    title: `Issued Invoices`,
    icon: <FileCheck />,
    link: `/pos/reports/invoices`,
    data_name: `issued_invoices`,
    className: `bg-green-100`,
    period: `Daily`,
  },
  {
    title: `Open Orders`,
    icon: <FileInput />,
    link: `/pos/reports/invoices`,
    data_name: `issued_quotations`,
    className: `bg-blue-100`,
    period: `Daily`,
  },
  {
    title: `Pending Jobs`,
    icon: <Hammer />,
    link: `/pos/jobs`,
    data_name: `pending_jobs`,
    className: `bg-amber-100`,
    period: `From All`,
  },
  {
    title: `Low Stock`,
    icon: <Package />,
    link: `/pos/reports/stock`,
    data_name: `low_stock`,
    className: `bg-red-100`,
    period: `From All`,
  },
  {
    title: `New Customers`,
    icon: <User />,
    link: ``,
    data_name: `new_customers`,
    className: `bg-purple-100`,
    period: `Monthly`,
  },
  {
    title: `Sms Balance`,
    icon: <Mail />,
    link: `https://sms.send.lk/dashboard`,
    data_name: `sms_balance`,
    className: ` bg-blue-50`,
    period: `Live`,
  },
];

const DashCardGrid = async () => {
  const data = await load_pos_dash_cards();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, index) => (
        <DashCard
          key={index}
          className={card.className}
          title={card.title}
          link={card.link}
          value={data[card.data_name]}
          icon={card.icon}
          period={card.period}
          index={index}
        />
      ))}
    </div>
  );
};

export default DashCardGrid;
