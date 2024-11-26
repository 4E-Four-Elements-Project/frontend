import { MenuItemProps } from "../../types/interface/interface";
import { motion, Variants } from "motion/react";
import addBtnFront from "../../assets/img/addBtn.svg";
import addBtnOutline from "../../assets/img/addBtnOutline.svg";

export default function MenuItem({
  itemName = "Mediterranean Salad",
  itemDesc = "Mixed salad greens, cherry tomatoes, cucumber, Kalamata olives, feta cheese, and red onion.",
  itemPrice = 219,
}: MenuItemProps) {
  const addBtnAnimation: Variants = {
    initial: { y: 0, x: 0 },
    animate: { y: -1, x: -2 },
  };

  return (
    <section className="w-72 h-44 border border-slate-300 rounded-lg bg-white px-2 pt-2">
      <h3 className="font-Londrina font-semibold text-2xl tracking-widest">
        {itemName}
      </h3>
      <p className="font-Roboto font-sm">{itemDesc}</p>
      <p className="font-semibold font-Londrina relative top-6 left-0 text-2xl tracking-widest">
        {itemPrice} :-
      </p>

      {/* Add Button */}
      <motion.div
        initial="initial"
        animate="initial"
        whileHover="animate"
        className="relative -top-3 left-36 cursor-pointer w-24"
      >
        <motion.img src={addBtnFront} variants={addBtnAnimation} alt="" />
        <motion.img
          src={addBtnOutline}
          alt=""
          className="absolute -top-1 -left-1"
        />
      </motion.div>
    </section>
  );
}
