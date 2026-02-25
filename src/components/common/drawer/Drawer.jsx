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

const Drawer = ({ button, close, form }) => {
  return (
    <div className="">
      <Sheet className={``}>
        <SheetTrigger>
          <Button name={`Add Item`} />
        </SheetTrigger>
        <SheetContent
          className={`bg-white p-4 border-none md:min-w-[62%] min-w-screen lg:min-w-[55%] xl:min-w-[45%]`}
        >
          <SheetHeader className={`px-0`}>
            <SheetTitle>This Is My Sheet</SheetTitle>
            <SheetDescription>Lets Practice to use Sheets</SheetDescription>
          </SheetHeader>
          <div className="">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Non,
            debitis blanditiis eaque nulla enim deserunt dolores mollitia
            quibusdam. Harum hic expedita omnis similique ex rem dolor culpa
            repudiandae id cum.
          </div>
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
