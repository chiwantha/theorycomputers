import CommonCardGrid from "@/components/common/commoncardgrid/CommonCardGrid";
import ProductCard from "../../cards/productcard/ProductCard";

const ProductListGrid = ({ itemsList, addToCart }) => {
  return (
    <CommonCardGrid
      itemsList={itemsList}
      searchKeys={["name", "description"]}
      defaultItemsPerPage={15}
      grid={`grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4`}
    >
      {(item) => <ProductCard {...item} onClick={() => addToCart(item)} />}
    </CommonCardGrid>
  );
};

export default ProductListGrid;
