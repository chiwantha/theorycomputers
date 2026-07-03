import DashCard from "@/components/common/cards/dashcard/DashCard";
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
    link: ``,
    value: 20,
    className: `bg-green-100`,
  },
  {
    title: `Issued Qutations`,
    icon: <FileInput />,
    link: ``,
    value: 2,
    className: `bg-blue-100`,
  },
  {
    title: `Pending Jobs`,
    icon: <Hammer />,
    link: ``,
    value: 6,
    className: `bg-amber-100`,
  },
  {
    title: `Low Stock`,
    icon: <Package />,
    link: ``,
    value: 14,
    className: `bg-red-100`,
  },
  {
    title: `New Customers`,
    icon: <User />,
    link: ``,
    value: 3,
    className: `bg-purple-100`,
  },
  {
    title: `Sms Balance`,
    icon: <Mail />,
    link: ``,
    value: 3259,
    className: `hidden xl:flex bg-blue-50`,
  },
];

const DashCardGrid = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <DashCard
          key={index}
          className={card.className}
          title={card.title}
          link={card.link}
          value={card.value}
          icon={card.icon}
        />
      ))}
    </div>
  );
};

export default DashCardGrid;
