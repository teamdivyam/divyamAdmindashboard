import React, { useEffect, useState } from "react";
import { config } from "../../../../../config.js";
import Loader from "../../../../components/components/Loader.jsx";
import { NavLink } from "react-router-dom";
const getToken = localStorage.getItem("AppID");

const truncate = (str) => {
  let count;
  let tempStr = "";

  for (let i = 0; i < str.length; i++) {
    if (count <= 40) return;
    count = count + 1;
    tempStr = str[i];
  }
  console.log(tempStr);
};

const SINGLE_ORDER_CARD = (Orderid) => {
  if (!Orderid) return;
  const [order, setOrder] = useState();
  const [err, setErr] = useState();
  if (err) {
    return (
      <p className="text-red-500">Something went wrong. Please try again.</p>
    );
  }

  // if (loading) {
  //   return (
  //     <div className="wrap-loader relative ">
  //       <span className="absolute left-0 top-0">
  //         <Loader />
  //       </span>
  //     </div>
  //   );
  // }

  useEffect(() => {
    (async () => {
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
        if (results?.success) {
          setOrder(results?.order);
        }
      } catch (error) {
        throw new Error(error);
      }
    })();
  }, []);

  return (
    <>
      <div className="border flex justify-around gap-2  rounded-md  p-2">
        <img
          src={order && order?.product?.productId?.productImg[0]?.imgSrc}
          className="object-cover size-20 rounded-sm  self-center"
        />
        <div className="textContent self-start ">
          <h2 className="font-normal text-md text-neutral-600 ">
            {order && order.product?.productId?.name}
          </h2>
          <p className=" text-neutral-500 pt-2 text-sm ">
            <span className="line-clamp-1 max-w-96">
              {order && order.product?.productId?.description}
            </span>
          </p>
        </div>

        <NavLink
          to={`/dashboard/order/${Orderid.Orderid}`}
          className="self-center text-blue-500 text-sm"
        >
          View More
        </NavLink>
      </div>
    </>
  );
};

export default SINGLE_ORDER_CARD;
