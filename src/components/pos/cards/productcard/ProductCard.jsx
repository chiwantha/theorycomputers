const ProductCard = ({ name, selling, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="rounded-lg p-4 bg-gray-50 cursor-pointer hover:bg-gray-200 h-full flex flex-col justify-center"
    >
      <h3 className="font-bold text-gray-600">{name}</h3>
      <p>LKR {selling}</p>
    </div>
  );
};

export default ProductCard;
