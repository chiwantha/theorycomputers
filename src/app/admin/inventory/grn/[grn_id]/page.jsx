const page = async ({ params }) => {
  const { grn_id } = await params;
  return <div>Grn Detail Page {grn_id}</div>;
};

export default page;
