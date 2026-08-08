import JobRow from "@/features/jobs/components/JobRow";
import JobAction from "@/features/jobs/components/JobAction";
import JobCp from "@/features/jobs/components/JobCp";
import JobCustomerVIew from "@/features/jobs/components/JobCustomerVIew";
import JobDetailsVIew from "@/features/jobs/components/JobDetailsVIew";
import { get_items_for_job } from "@/lib/data";
import { loadJob } from "@/features/jobs/service";
import AniDiv from "@/components/animatedDiv/AniDiv";

const page = async ({ params }) => {
  const { job_id } = await params;
  const data = await loadJob({
    jobId: job_id,
  });

  // console.log(data);
  if (!data) {
    return (
      <div className="flex flex-col space-y-4">
        {/* <BreadCrumb /> */}
        <div className="p-5 bg-red-50 text-red-700 rounded-xl">
          Error Loading {job_id}
        </div>
      </div>
    );
  }

  const itemsList = await get_items_for_job(job_id);

  return (
    <div className="flex flex-col space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 gap-y-4 md:gap-y-0">
        <div className="col-span-2  flex flex-col space-y-4 order-2 md:order-1">
          <div
            style={{
              animationDelay: `${1 * 100}ms`,
            }}
            className="animate-fade-up opacity-0"
          >
            <JobCustomerVIew customerData={data?.customer || false} />
          </div>
          <div
            style={{
              animationDelay: `${2 * 100}ms`,
            }}
            className="animate-fade-up opacity-0"
          >
            <JobDetailsVIew
              detailsData={data?.jobDetails || false}
              headerData={data?.jobHeader || false}
            />
          </div>
        </div>
        <div
          style={{
            animationDelay: `${3 * 100}ms`,
          }}
          className="order-1 md:order-2 animate-fade-up opacity-0"
        >
          <JobCp paymentsRes={(data?.payments)[0] || false} />
        </div>
      </div>
      <div
        style={{
          animationDelay: `${4 * 100}ms`,
        }}
        className="bg-white shadow-md rounded-xl p-4 animate-fade-up opacity-0"
      >
        <JobRow item_list={itemsList} defaultRows={data?.jobItems} />
      </div>
      <AniDiv delayIndex={5}>
        <JobAction />
      </AniDiv>
    </div>
  );
};

export default page;
