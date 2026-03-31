const page = async ({ params }) => {
  const { job_id } = await params;
  return <div>page {job_id}</div>;
};

export default page;
