import BreadCrumb from "@/components/common/breadcrump/BreadCrumb";
import JobRow from "@/components/pos/cards/inputCards/JobRow";
import JobCustomerVIew from "@/components/pos/sections/jobviewpage/JobCustomerVIew";
import JobDetailsVIew from "@/components/pos/sections/jobviewpage/JobDetailsVIew";
import { get_items_for_job } from "@/lib/data";

async function get_job_data(jobId) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/pos/jobs/${jobId}`,
    );

    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch (err) {
    console.log(`Error Fetching Job Data : `, err);
    return [];
  }
}

const page = async ({ params }) => {
  const { job_id } = await params;
  const Job = await get_job_data(job_id);
  const itemsList = await get_items_for_job(job_id);

  return (
    <div className="flex flex-col space-y-4">
      <BreadCrumb />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2  flex flex-col space-y-4 order-2 md:order-1">
          <JobCustomerVIew customerData={Job?.customerRes[0] || false} />
          <JobDetailsVIew
            detailsData={Job?.detailsRes[0] || false}
            headerData={Job?.headerRes[0] || false}
          />
        </div>
        <div className="rounded-xl p-4 bg-white shadow-md order-1 md:order-2"></div>
      </div>
      <div className="bg-white shadow-md rounded-xl p-4">
        <JobRow item_list={itemsList} defaultRows={Job?.jobItems} />
      </div>
    </div>
  );
};

export default page;
