import React from "react";
import DashCard from "../../cards/dashcard/DashCard";

const DashGrid = () => {
  const cards = [
    {
      title: `Today Sales`,
      image: `/dashboard/sales.png`,
      link: ``,
      value: 1256.0,
      className: ``,
    },
    {
      title: `Pending Jobs`,
      image: `/dashboard/jobs.png`,
      link: ``,
      value: 6,
      className: ``,
    },
    {
      title: `Low Stock`,
      image: `/dashboard/stock.png`,
      link: ``,
      value: 14,
      className: ``,
    },
    {
      title: `New Customers`,
      image: `/dashboard/customers.png`,
      link: ``,
      value: 3,
      className: ``,
    },
    {
      title: `Sms Balance`,
      image: `/dashboard/sms.png`,
      link: ``,
      value: 3259,
      className: `hidden xl:flex`,
    },
  ];
  return (
    <div className=" grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 ">
      {cards.map((card, index) => (
        <DashCard
          key={index}
          className={card.className}
          icon={card.image}
          title={card.title}
          link={card.link}
          value={card.value}
        />
      ))}
    </div>
  );
};

export default DashGrid;
