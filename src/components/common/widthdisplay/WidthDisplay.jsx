const WidthDisplay = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white bg-opacity-70 text-black text-xs sm:text-sm font-mono px-2 py-1 rounded shadow-lg pointer-events-none">
      <span className="block sm:hidden">xs</span>
      <span className="hidden sm:block md:hidden">sm</span>
      <span className="hidden md:block lg:hidden">md</span>
      <span className="hidden lg:block xl:hidden">lg</span>
      <span className="hidden xl:block 2xl:hidden">xl</span>
      <span className="hidden 2xl:block">2xl</span>
    </div>
  );
};

export default WidthDisplay;
