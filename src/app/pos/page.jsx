import BarChartTemp from "@/components/charts/BarChartTemp";
import LineChartTemp from "@/components/charts/LineChartTemp";
import PieChartTemp from "@/components/charts/PieChartTemp";
import Table from "@/components/table/Table";
import DashCardGrid from "@/features/dashboard/components/DashCardGrid";
import {
  load_payment_methods,
  load_pos_chart_revenue,
  load_pos_chart_sale,
  load_pos_recent_invoices,
} from "@/data/pos/dashboard";

const ShopUserDashMenu = async () => {
  const sale_chart = await load_pos_chart_sale();
  const payment_method_counts = await load_payment_methods();
  const revenue_chart = await load_pos_chart_revenue();
  const recent_invoices = await load_pos_recent_invoices();
  const month = new Date().toLocaleString("en-US", {
    month: "long",
  });
  return (
    <div className=" flex flex-col gap-4">
      <DashCardGrid />
      {/* charts */}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            // stacked
            data={revenue_chart}
            xKey="month"
            bars={[
              { key: "net_total", label: "Revenue", color: "#2563eb" },
              { key: "discount", label: "Discounts", color: "#FFAC1C" },
              { key: "expences", label: "Expences", color: "#DC143C" },
            ]}
            title="Financials"
            description="Daily performance"
          />
        </div>
      </div>
      {/* tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          style={{
            animationDelay: `${1 * 100}ms`,
          }}
          className="animate-fade-up opacity-0"
        >
          <Table
            tablename={`Recent Invoices`}
            rowsPerPage={5}
            rows={recent_invoices}
            push_link={`/pos/reports/invoices/`}
            action={{ view: true, edit: false, delete: false }}
            searchkeys={["inv_no", "items_count"]}
            colunms={[
              {
                header: "Inv No",
                data_name: "inv_no",
                className: "",
                data_className: "",
              },
              {
                header: "Item Count",
                data_name: "items_count",
                className: "md:table-cell hidden",
                data_className: "",
              },
              {
                header: "Net Total",
                data_name: "net_total",
                className: "",
                data_className: "text-blue-400 font-medium",
                type: `money`,
              },
            ]}
          />
        </div>
        <div
          style={{
            animationDelay: `${2 * 100}ms`,
          }}
          className="animate-fade-up opacity-0"
        >
          <Table
            tablename={`Recent Orders`}
            rowsPerPage={5}
            rows={[]}
            action={{ view: true, edit: false, delete: false }}
            colunms={[
              {
                header: "Ord No",
                data_name: "order_no",
                className: "",
                data_className: "",
              },
              {
                header: "Item Count",
                data_name: "items_count",
                className: "md:table-cell hidden",
                data_className: "",
              },
              {
                header: "Net Total",
                data_name: "net_total",
                className: "",
                data_className: "text-blue-400 font-medium",
                type: `money`,
              },
              {
                header: "Delivary",
                data_name: "delivary",
                className: "md:table-cell hidden",
                data_className: "text-amber-500",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default ShopUserDashMenu;
