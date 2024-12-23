import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/layout/header/Header";
import MenuButton from "../../components/layout/menu-button/menu-button";
import deleteItem from "/img/delete.svg";

interface CartItem {
  menuId: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
}

const ShoppingCart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialCart: CartItem[] = location.state?.cart || []; // Hämta varukorgen från state
  const [cart, setCart] = useState<CartItem[]>(initialCart);
  const [paymentMethod, setPaymentMethod] = useState<string>(""); // Ny state för betalningsmetod
  const [additionalInfo, setAdditionalInfo] = useState<string>(""); // Ny state för ytterligare information

  const handleIncrease = (id: string) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.menuId === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {

      alert("Your cart is empty. Add products before checking out.");

      return;
    }
  
    // const token = localStorage.getItem("authToken");
    // console.log('token', token);
    
    // Kombinera data för att skapa en enda order
    const orderData = {
      comment: additionalInfo || "No comment",
      paymentMethod: paymentMethod || "Pay Online", // Standardbetalningsmetod
    };
    try {
      const token = localStorage.getItem("authToken");
      // Construct headers dynamically
     const headers: Record<string, string> = {
       "Content-Type": "application/json",
     };

     if (token) {
       headers["Authorization"] = `Bearer ${token}`;
     }

      const response = await fetch(
        "https://j4u384wgne.execute-api.eu-north-1.amazonaws.com/order/post",
        {
          method: "POST",
          headers,
          body: JSON.stringify(orderData),
        }
      );

      const responseData = await response.json();

      if (response.ok) {

        alert(`Your order has been confirmed! Order ID: ${responseData.data.orderItem.orderId}`);

        navigate("/confirmation", {
          state: {
            cart, // Skickar varukorgens innehåll
            orderId: responseData.data.orderItem.orderId, // Skickar order-ID
            total: calculateTotal(), // Skickar totalpris
          },
        });
      } else {
        alert(`Error in order processing: ${responseData.data?.message || "Okänt fel"}`);
      }
    } catch (error) {
      console.error("Nätverksfel:", error);
      alert("Kunde inte skicka order. Kontrollera din internetanslutning.");
    }
  };

  const handleDecrease = (id: string) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.menuId === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const deleteCartItem = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.menuId !== id));
  };

  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center">
        <Header />
        <h2 className="mt-20 text-xl">Your cart is empty.</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center mb-24">
      <Header
        cartCount={cart.reduce((count, item) => count + item.quantity, 0)}
      />
      <div className="w-80 sm:w-1/2 h-full flex justify-center flex-col mt-5">
        <div className="flex items-start w-full mb-7">
          <h1 className="font-Londrina text-4xl lg:text-6xl lg:pl-5 pb-2 border-b-2 border-black w-full">
            Cart
          </h1>
        </div>

        <ul className="flex flex-col gap-3 font-thin">
          {cart.map((item) => (
            <li
              key={item.menuId}
              className="border border-black rounded-xl p-3 flex items-center flex-row gap-2 bg-[#f1f1f1] justify-between"
            >
              <div className="font-roboto flex flex-col gap-2">
                <p className="text-sm font-semibold md:text-xl">{item.menuId}</p>
                <p>{item.price} kr</p>
              </div>
              <div className="flex gap-1.5 md:gap-3 items-center justify-center">
                <button
                  onClick={() => handleDecrease(item.menuId)}
                  className="px-2 py-0.5 bg-gray-400 rounded"
                >
                  -
                </button>
                <p className="font-semibold">{item.quantity}</p>
                <button
                  onClick={() => handleIncrease(item.menuId)}
                  className="mr-3 px-2 py-0.5 bg-gray-400 rounded"
                >
                  +
                </button>
                <button
                  onClick={() => deleteCartItem(item.menuId)}
                  className="w-5 h-5"
                >
                  <img
                    src={deleteItem}
                    alt="Delete item"
                    className="flex item-center justify-center w-5 h-5"
                  />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex justify-between mt-5">
          <h2 className="font-bold text-xl">TOTAL</h2>
          <h2 className="font-bold text-xl">{calculateTotal()} kr</h2>
        </div>

        <div className="mt-[60px]">
          <h1 className="font-Londrina text-3xl">
            Additional information? Allergies etc?
          </h1>
          <input
            type="text"
            className="border border-black rounded-lg w-full h-20 mt-5"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
          />
        </div>

        <div className="mt-[60px] flex flex-col items-center justify-between gap-2 md:gap-10 md:flex-row">
          <h1 className="font-Londrina text-3xl">Payment</h1>
          <div className="flex items-center font-Roboto justify-center mt-5 gap-5">
            <h5>PAY ONLINE</h5>
            <input
              type="radio"
              name="payment-method"
              value="Pay Online"
              onChange={(e) => setPaymentMethod(e.target.value)}
              checked={paymentMethod === "Pay Online"}
              className="border border-black rounded-lg"
            />
            <h5>PAY AT RESTAURANT</h5>
            <input
              type="radio"
              name="payment-method"
              value="Pay on Pickup"
              onChange={(e) => setPaymentMethod(e.target.value)}
              checked={paymentMethod === "Pay on Pickup"}
              className="border border-black rounded-lg"
            />
          </div>
        </div>

        <MenuButton
          type="button"
          onClick={handleCheckout}
          className="before:bg-secondary-0 before:absolute before:content-[''] before:top-1/4 before:left-0 before:ml-2 before:w-[calc(100%)] before:h-10 before:bg-secondary before:rounded before:border before:border-black before:-z-10 before:transition-transform before:duration-300 hover:before:translate-x-[-8px] hover:before:translate-y-[-7px] mt-14 w-1/4"
        >
          Checkout
        </MenuButton>
      </div>
    </div>
  );
};

export default ShoppingCart;
