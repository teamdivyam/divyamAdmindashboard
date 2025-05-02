import React, { useEffect, useState } from "react";
import { config } from "../../../../../config.js";
import Loader from "../../../../components/components/Loader.jsx";
import { NavLink } from "react-router-dom";
const getToken = localStorage.getItem("AppID");

const SINGLE_ORDER_CARD = (Orderid) => {
  console.log(Orderid);
  if (!Orderid) return;

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState();
  const [err, setErr] = useState();

  if (err) {
    return (
      <p className="text-red-500">Something went wrong. Please try again.</p>
    );
  }

  if (loading) {
    <Loader />;
  }
  console.log("LOG_2");

  useEffect(() => {
    setLoading(true);
    const getOrderDetails = async () => {
      try {
        const res = await fetch(
          `${config.BACKEND_URL}/api/admin/order/${Orderid.Orderid}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getToken}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (!res.ok) {
          setErr("can't fetch order details");
          throw new Error(
            "can't make req to server, plz check our Internet connection."
          );
        }

        const results = await res.json();

        if (results.success) {
          setOrder(results?.order);
          setLoading(false);
        }
      } catch (error) {
        setLoading(true);
        throw new Error(error);
      }
    };

    //get-orders-details
    getOrderDetails();
  }, []);

  console.log("LOG_3");

  return (
    <div className="border flex justify-start gap-6  rounded-md  p-2">
      <img
        src={order && order?.product?.productId?.productImg[0]?.imgSrc}
        className="object-cover size-20 rounded-sm  self-center"
      />
      <div className="textContent self-start ">
        <h2 className="font-normal text-md text-neutral-600">
          {order && order.product?.productId?.name}
        </h2>
        <p className=" text-neutral-500 pt-2 text-sm ">
          {order && order.product?.productId?.description}
        </p>
      </div>

      <NavLink
        to={`/dashboard/order/${Orderid.Orderid}`}
        className="self-center ml-20 font-normal text-center text-blue-400 underline"
      >
        View More
      </NavLink>
    </div>
  );
};

export default SINGLE_ORDER_CARD;
