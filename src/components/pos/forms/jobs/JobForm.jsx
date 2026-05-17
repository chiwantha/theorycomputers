import SelectCustomer from "../customer/SelectCustomer";

const JobForm = ({ form_props }) => {
  const { customersList } = form_props || {};
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SelectCustomer customersList={customersList} />
    </div>
  );
};

export default JobForm;
