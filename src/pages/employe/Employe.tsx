import Logo from "../../components/ui/4eLogo/Logo";
import updateOrders from "/img/refresh.svg";
import ActiveOrders from "./components/ActiveOrders/ActiveOrders";
import EditMenu from "./components/EditMenu/EditMenu";
import Inventory from "./components/Inventory/Inventory";
import Overview from "./components/HeaderOverview/Overview";
import { Variants, motion } from "motion/react";

import { useEffect, useState } from "react";
import PendingOrders from "./components/pendingOrders/PendingOrders";
import handleLogout from "../logut/Logut";
import getOrders from "../../services/employe/getOrders/getOrders";
import { GetOrderInformation } from "../../types/interface/interface";

export default function Employe() {
  const [currentStaff, setCurrentStaff] = useState<boolean>(true);
  const [kitchenOrders, setKitchenOrders] = useState<[]>([]);
  const [refreshOrders, setRefreshOrders] = useState<boolean>(false);

  useEffect(() => {
    if (location.pathname === "/chef") {
      setCurrentStaff(!currentStaff);
    }
  }, [location]);

  const onClickSignOut: Variants = {
    initial: {
      strokeDasharray: 120,
      strokeDashoffset: 120,
    },
    animate: {
      strokeDashoffset: 0,
      transition: { duration: 1 },
    },
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders();

        const kitchenOrders = response.data.filter(
          (order: GetOrderInformation) =>
            order.orderStatus === "kitchen" || order.orderStatus === "cooking"
        );

        setRefreshOrders(false);
        setKitchenOrders(kitchenOrders);
      } catch (error) {
        console.error("Error fetching orders: ", error);
      }
    };

    fetchOrders();

    const interval = setInterval(fetchOrders, 60000);
    return () => {
      clearInterval(interval);
    };
  }, [refreshOrders]);

  return (
    <main className="bg-primary-0 w-full min-h-screen overflow-hidden flex flex-col items-center pt-24">
      <Logo link="/employe" />
      <Overview />
      <motion.div
        initial="initial"
        whileHover="animate"
        className={`absolute top-10 right-14`}
      >
        <button
          className="text-black"
          onClick={() => {
            setCurrentStaff(!currentStaff);
            setRefreshOrders(true);
          }}
        >
          {currentStaff ? "Chef" : "Employe"}
        </button>
        <svg width="60" height="5" className="absolute top-6">
          <motion.path
            variants={onClickSignOut}
            d={`${
              currentStaff
                ? "M0,2 Q10,0 20,2 T32,2 T30,3"
                : "M0,2 Q10,0 20,2 T32,2 T60,3"
            }`}
            fill="none"
            stroke="#C8D6AF"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
      {currentStaff ? (
        // Employe
        <section className="w-auto md:w-2/3 flex flex-col items-center justify-between md:grid md:grid-rows-2 md:grid-cols-3 gap-5 md:items-start md:justify-items-end mt-11 px-8 pb-5">
          <ActiveOrders />
          <Inventory />
          <EditMenu />
        </section>
      ) : (
        // Chef
        <section className="w-full md:w-full flex flex-col items-center justify-between md:grid md:grid-cols-4 gap-4 md:items-start md:justify-items-end mt-11 px-8 pb-8 ">
          <motion.img
            whileTap={{ rotate: 360 }}
            src={updateOrders}
            alt="refresh orders icon"
            className="w-8 absolute bottom-10 right-5 cursor-pointer"
            onClick={() => setRefreshOrders(true)}
          />
          {/* Active orders */}
          {kitchenOrders.map((order, index) => (
            <PendingOrders
              kitchenOrders={order}
              key={index}
              refreshOrders={setRefreshOrders}
            />
          ))}
          {/* <PendingOrders /> */}
        </section>
      )}
      <motion.div
        initial="initial"
        whileHover="animate"
        className="absolute top-10 right-32 md:right-52"
      >
        <span onClick={handleLogout} className="text-black cursor-pointer">
          Sign out
        </span>
        <svg width="60" height="5" className="absolute top-6">
          <motion.path
            variants={onClickSignOut}
            d="M0,2 Q10,0 20,2 T32,2 T60,3"
            fill="none"
            stroke="#C8D6AF"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
    </main>
  );
}
