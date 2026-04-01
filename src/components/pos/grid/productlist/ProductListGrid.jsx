import CommonCardGrid from "@/components/common/commoncardgrid/CommonCardGrid";
import ProductCard from "../../cards/productcard/ProductCard";

const ProductListGrid = ({ itemsList, addToCart }) => {
  return (
    <div className="shadow rounded-xl bg-white overflow-hidden ">
      <CommonCardGrid
        itemsList={itemsList}
        searchKeys={["name", "category"]}
        defaultItemsPerPage={15}
        grid={`grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5`}
      >
        {(item) => <ProductCard {...item} onClick={() => addToCart(item)} />}
      </CommonCardGrid>
    </div>
  );
};

export default ProductListGrid;
