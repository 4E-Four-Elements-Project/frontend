const BASE_URL = "https://rwxvokmlrj.execute-api.eu-north-1.amazonaws.com";

export const getCartItems = async () => {
    try {
        const response = await fetch(`${BASE_URL}/cart/get/`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`Error fetching cart items: ${response.statusText}`);
        }

        const data = await response.json();
        // console.log("API response:", data);

        // Returnera endast items från svaret
        return data.data.items;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
};