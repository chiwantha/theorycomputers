import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Button from "../button/Button";

const Drawer = ({ title, description, button, close, form }) => {
  return (
    <div className="">
      <Sheet className={``}>
        <SheetTrigger>
          <Button name={`Add Item`} />
        </SheetTrigger>
        <SheetContent
          className={`bg-white p-4 md:p-6 border-none md:min-w-[62%] min-w-screen lg:min-w-[55%] xl:min-w-[45%] `}
        >
          <SheetHeader className={`px-0 ${!title && `hidden`}`}>
            <SheetTitle>This Is My Drawer</SheetTitle>
            <SheetDescription>Lets Practice to use Drawer</SheetDescription>
          </SheetHeader>
          <div className="">{form}</div>
          <SheetFooter>
            {close && (
              <SheetClose>
                <Button name={`Close`} />
              </SheetClose>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Drawer;
