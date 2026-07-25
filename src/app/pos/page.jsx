import BarChartTemp from "@/components/common/charts/BarChartTemp";
import LineChartTemp from "@/components/common/charts/LineChartTemp";
import PieChartTemp from "@/components/common/charts/PieChartTemp";
import Table from "@/components/common/table/Table";
import DashCardGrid from "@/components/pos/grid/dashcardgrid/DashCardGrid";
import {
  load_payment_methods,
  load_pos_chart_sale,
} from "@/data/pos/dashboard";
import { Eye } from "lucide-react";

const ShopUserDashMenu = async () => {
  const sale_chart = await load_pos_chart_sale();
  const payment_method_counts = await load_payment_methods();
  const month = new Date().toLocaleString("en-US", {
    month: "long",
  });
  return (
    <div className=" flex flex-col gap-4">
      <DashCardGrid />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <LineChartTemp
          data={sale_chart}
          xKey="day"
          lines={[
            { key: "direct_sale", label: "Direct Sale", color: "#2563eb" },
            { key: "job_sale", label: "Job Sale", color: "#f97316" },
          ]}
          title="Sale By Type"
          description={`${month || `This Month`} performance`}
        />
        <div className="grid grid-cols-2 gap-4">
          <PieChartTemp
            data={[
              {
                name: "Cash",
                value: Number(payment_method_counts[0]?.cash_method),
              },
              {
                name: "Card",
                value: Number(payment_method_counts[0]?.card_method),
              },
              {
                name: "Bank",
                value: Number(payment_method_counts[0]?.bank_method),
              },
            ]}
            title="PAY METHOD"
            description={`${month || `This Month`} performance`}
          />
          <BarChartTemp
            stacked
            data={[
              {
                month: "Jan",
                revenue: 4200,
                cost: 2300,
                expenses: 650,
                profit: 1250,
              },
              {
                month: "Feb",
                revenue: 3850,
                cost: 1950,
                expenses: 575,
                profit: 1325,
              },
              {
                month: "Mar",
                revenue: 5120,
                cost: 2740,
                expenses: 720,
                profit: 1660,
              },
              {
                month: "Apr",
                revenue: 4680,
                cost: 2480,
                expenses: 685,
                profit: 1515,
              },
              {
                month: "May",
                revenue: 6340,
                cost: 3350,
                expenses: 810,
                profit: 2180,
              },
              {
                month: "Jun",
                revenue: 5925,
                cost: 3125,
                expenses: 790,
                profit: 2010,
              },
              {
                month: "Jul",
                revenue: 7150,
                cost: 3790,
                expenses: 920,
                profit: 2440,
              },
              {
                month: "Aug",
                revenue: 6810,
                cost: 3610,
                expenses: 880,
                profit: 2320,
              },
              {
                month: "Sep",
                revenue: 7485,
                cost: 3960,
                expenses: 980,
                profit: 2545,
              },
              {
                month: "Oct",
                revenue: 8290,
                cost: 4380,
                expenses: 1050,
                profit: 2860,
              },
              {
                month: "Nov",
                revenue: 7865,
                cost: 4180,
                expenses: 990,
                profit: 2695,
              },
              {
                month: "Dec",
                revenue: 9450,
                cost: 4980,
                expenses: 1160,
                profit: 3310,
              },
            ]}
            xKey="month"
            bars={[
              { key: "revenue", label: "Revenue", color: "#2563eb" },
              { key: "cost", label: "Cost", color: "#FFAC1C" },
              { key: "expenses", label: "Expenses", color: "#D22B2B" },
              { key: "profit", label: "Profit", color: "#50C878" },
            ]}
            title="Revenue vs Expenses"
            description="Monthly performance"
          />
        </div>
      </div>
    </div>
  );
};

export default ShopUserDashMenu;
