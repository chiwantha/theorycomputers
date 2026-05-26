import BreadCrumb from "@/components/common/breadcrump/BreadCrumb";

const page = async ({ params }) => {
  const { job_id } = await params;
  return (
    <div className="flex flex-col space-y-4">
      <BreadCrumb />
      <div className="rounded-xl p-4 bg-white shadow-md"></div>
    </div>
  );
};

export default page;
