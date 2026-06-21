import BreadCrumb from "@/components/common/breadcrump/BreadCrumb";
import JobGrid from "@/components/pos/grid/jobgrid/JobGrid";

export const dynamic = "force-dynamic";

async function get_job_list() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/pos/jobs`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch (err) {
    console.log(`Error Fetching Jobs List : `, err);
    return [];
  }
}

const PosJobPage = async () => {
  const jobList = await get_job_list();
  return (
    <div className="flex flex-col space-y-4">
      <BreadCrumb />
      <JobGrid jobList={jobList} />
    </div>
  );
};

export default PosJobPage;
