import React from "react";

const page = async ({ params }) => {
  const { ord_id } = await params;
  return <div>Order View {ord_id}</div>;
};

export default page;
