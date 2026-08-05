import BreadCrumb from "@/components/breadcrump/BreadCrumb";
import JobGrid from "@/features/jobs/components/JobGrid";
import { loadJobList } from "@/features/jobs/service";

export const dynamic = "force-dynamic";

const PosJobPage = async () => {
  const jobList = await loadJobList();
  return (
    <div className="flex flex-col space-y-4">
      {/* <BreadCrumb /> */}
      <JobGrid jobList={jobList} />
    </div>
  );
};

export default PosJobPage;
