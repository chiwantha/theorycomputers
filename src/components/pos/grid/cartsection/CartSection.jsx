const CartSection = ({ cart, customer, onSave }) => {
  const total = cart.reduce((sum, item) => sum + item.selling * item.qty, 0);

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col">
      <h2 className="font-bold mb-2">Cart</h2>

      <div className="flex-1 overflow-y-auto space-y-2">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between">
            <span>
              {item.name} x{item.qty}
            </span>
            <span>{item.selling * item.qty}</span>
          </div>
        ))}
      </div>

      <div className="border-t mt-3 pt-3 space-y-3">
        <p className="font-bold">Total: {total}</p>

        {/* ✅ SAVE BUTTON */}
        <button
          onClick={onSave}
          disabled={!customer || cart.length === 0}
          className={`w-full py-2 rounded-lg text-white transition ${
            !customer || cart.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Save Invoice
        </button>
      </div>
    </div>
  );
};

export default CartSection;
