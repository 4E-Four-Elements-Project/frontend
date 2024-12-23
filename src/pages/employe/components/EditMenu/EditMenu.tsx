import { useEffect, useState } from "react";
import AddItemToMenu from "../addItemToMenu/AddItemToMenu";
import MenuItemEdit from "../MenuItemEditor/MenuItemEdit";
import { motion } from "motion/react";
import getMenu from "../../../../services/menu/getMenu/getMenuApi";
import {
  MenuApiResponse,
  MenuItems,
} from "../../../../types/interface/interface";

export default function EditMenu() {
  const [toggleNewItem, setToggleNewItem] = useState<boolean>(false);
  const [fetchItems, setFetchItems] = useState<boolean>(false);
  const [menu, setMenu] = useState<MenuItems[]>();

  const handleCloseNewItem = (): void => {
    setToggleNewItem((prev) => !prev);
  };

  // Updates menu when a item gets added
  const fetchMenu = (): void => {
    setFetchItems(!fetchItems);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response: MenuApiResponse = await getMenu();
      const menuData = response.data.menu;
      // Sort by category
      menuData?.sort((a, b) => {
        const categoryA = a.category || "";
        const categoryB = b.category || "";

        return categoryA.localeCompare(categoryB);
      });
      setMenu(menuData);
    };

    fetchData();
  }, [fetchItems]);

  return (
    <div className="w-full bg-white h-80 overflow-y-scroll rounded-md scroll-smooth no-scrollbar col-span-3 border border-black flex flex-col gap-4 px-2 py-3 font-Roboto ">
      <div className="w-full flex justify-between items-center">
        <h5 className="">Edit menu</h5>
        <div className="w-24 h-8 border border-black bg-secondary-0 cursor-pointer select-none">
          <motion.div
            whileHover={{ x: 2, y: 2 }}
            whileTap={{ scale: 0.95 }}
            className="w-24 h-8 border border-black bg-white flex items-center justify-center rounded-sm relative -top-1 -left-1"
            onClick={() => {
              setToggleNewItem(!toggleNewItem);
            }}
          >
            Add item
          </motion.div>
        </div>
      </div>
      {/* Add every menu and a edit function */}
      {toggleNewItem && (
        <AddItemToMenu
          toggleItem={toggleNewItem}
          closeNewItem={handleCloseNewItem}
          fetchAllItems={fetchMenu}
        />
      )}
      {menu?.map((item) => (
        <MenuItemEdit
          key={item.menuId}
          category={item.category}
          description={item.description}
          menuId={item.menuId}
          ingredients={item.ingredients}
          price={item.price}
        />
      ))}
    </div>
  );
}
