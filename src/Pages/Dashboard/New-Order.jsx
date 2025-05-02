import React, { useEffect } from "react";
import razorpay from "razorpay";

const NewOrder = () => {
  const products = {
    packageID: "67e284f6b380a3af327eb017",
    qty: 1,
    USER_ID: "67e3c3deb40f89c52fad3d95",
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const createNewOrder = async () => {
    try {
      const CREATE_NEW_ORDER_API = "http://localhost:3004/api/new-order";

      const rezorPayResponse = await fetch(CREATE_NEW_ORDER_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(products),
      });

      const result = await rezorPayResponse.json();

      if (!rezorPayResponse.ok) {
        throw new Error("can't able to fetch data from server");
      }

      if (result) {
        return result;
      }
    } catch (error) {
      throw new Error("oops something went wrong");
    }
  };

  const verifyPayments = async (response) => {
    try {
      const res = await fetch("http://localhost:3004/api/verify-payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(response),
      });

      const results = await res.json();

      if (results) {
        console.log(results);
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  const handlePayments = async () => {
    try {
      const { order } = await createNewOrder();

      if (!order || !order.id) {
        alert("Order creation failed");
        return;
      }

      var options = {
        key_id: "rzp_test_E6nyscZdekkjCM",
        amount: "50000",
        currency: "INR",
        name: "Divyam",
        order_id: order.id,

        handler: function (response) {
          verifyPayments(response);

          // alert("Payment Successful!");
          // alert("Payment ID: " + response.razorpay_payment_id);
          // alert("Order ID: " + response.razorpay_order_id);
          // alert("Signature: " + response.razorpay_signature);
        },

        prefill: {
          name: "Kallu Kuttu",
          email: "kallu.kuttu@example.com",
          contact: "9000090000",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#E0A768",
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error in creating payment order: ", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  const handleForm = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    (async () => {
      await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    })();
  }, []);

  return (
    <div>
      <h3 className="text-neutral-400 text-3xl uppercase border-b p-4">
        Place new Order
      </h3>

      {JSON.stringify(products)}

      <form
        onSubmit={handleForm}
        className="w-[600px] mx-auto border rounded-md p-10 flex flex-col gap-3 mt-4"
      >
        <button
          className="border bg-blue-600 p-4 rounded-md text-3xl uppercase tracking-widest text-white"
          onClick={() => {
            handlePayments();
          }}
        >
          Order Now
        </button>
      </form>
    </div>
  );
};

export default NewOrder;
