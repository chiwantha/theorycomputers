import BreadCrumb from "@/components/common/breadcrump/BreadCrumb";
import JobGrid from "@/components/pos/grid/jobgrid/JobGrid";
import { load_job_list } from "@/data/pos/job";

export const dynamic = "force-dynamic";

const PosJobPage = async () => {
  const jobList = await load_job_list();
  return (
    <div className="flex flex-col space-y-4">
      <BreadCrumb />
      <JobGrid jobList={jobList} />
    </div>
  );
};

export default PosJobPage;
