import CommonCardGrid from "@/components/common/commoncardgrid/CommonCardGrid";
import ProductCard from "../../cards/productcard/ProductCard";

const ProductListGrid = ({ itemsList, addToCart }) => {
  return (
    <CommonCardGrid
      itemsList={itemsList}
      searchKeys={["name", "description"]} // ✅ search across name & description
      defaultItemsPerPage={12}
    >
      {(item) => <ProductCard {...item} onClick={() => addToCart(item)} />}
    </CommonCardGrid>
  );
};

export default ProductListGrid;
