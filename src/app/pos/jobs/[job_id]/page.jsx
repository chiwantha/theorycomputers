import BreadCrumb from "@/components/common/breadcrump/BreadCrumb";
import JobRow from "@/components/pos/cards/inputCards/JobRow";
import JobAction from "@/components/pos/sections/jobviewpage/JobAction";
import JobCp from "@/components/pos/sections/jobviewpage/JobCp";
import JobCustomerVIew from "@/components/pos/sections/jobviewpage/JobCustomerVIew";
import JobDetailsVIew from "@/components/pos/sections/jobviewpage/JobDetailsVIew";
import { load_per_job } from "@/data/pos/job";
import { get_items_for_job } from "@/lib/data";

const page = async ({ params }) => {
  const { job_id } = await params;
  const data = await load_per_job(job_id);
  const Job = data?.jobData;
  console.log(Job);
  if (!data.success) {
    return (
      <div className="flex flex-col space-y-4">
        <BreadCrumb />
        <div className="p-5 bg-red-50 text-red-700 rounded-xl">{Job.error}</div>
      </div>
    );
  }

  const itemsList = await get_items_for_job(job_id);

  return (
    <div className="flex flex-col space-y-4">
      <BreadCrumb />
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 gap-y-4 md:gap-y-0">
        <div className="col-span-2  flex flex-col space-y-4 order-2 md:order-1">
          <JobCustomerVIew customerData={Job?.customerRes[0] || false} />
          <JobDetailsVIew
            detailsData={Job?.detailsRes[0] || false}
            headerData={Job?.headerRes[0] || false}
          />
        </div>
        <JobCp paymentsRes={Job?.paymentsRes[0] || false} />
      </div>
      <div className="bg-white shadow-md rounded-xl p-4">
        <JobRow item_list={itemsList} defaultRows={Job?.jobItems} />
      </div>
      <JobAction />
    </div>
  );
};

export default page;
