import Button from "../button/Button";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerSlide,
  DrawerTitle,
  DrawerTrigger,
} from "../drawerslide/DrawerSlide";

const Drawer = ({ title, description, button, close, form }) => {
  return (
    <div className="">
      <DrawerSlide>
        <DrawerTrigger>
          <Button name="Add Item" />
        </DrawerTrigger>

        <DrawerContent className="bg-white p-4 md:p-6 border-none md:min-w-[62%] min-w-screen lg:min-w-[55%] xl:min-w-[45%]">
          <DrawerHeader className={`px-0 ${!title && "hidden"}`}>
            <DrawerTitle>This Is My Drawer</DrawerTitle>
            <DrawerDescription>Lets Practice to use Drawer</DrawerDescription>
          </DrawerHeader>

          <div>{form}</div>

          <DrawerFooter>
            {close && (
              <DrawerClose>
                <Button name="Close" />
              </DrawerClose>
            )}
          </DrawerFooter>
        </DrawerContent>
      </DrawerSlide>
    </div>
  );
};

export default Drawer;
