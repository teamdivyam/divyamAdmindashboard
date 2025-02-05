import React, { useEffect, useRef, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import APP from "../../../../dataCred.js";
import { Badge } from "@components/components/ui/badge";
import { IndianRupee, CreditCard, ShoppingBag, Pencil } from "lucide-react";

const OrderView = () => {
  const [order, setOrder] = useState(null);
  const { ORDER_ID } = useParams();

  if (!ORDER_ID) return;

  const getTOKEN = localStorage.getItem("AppID");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${APP.BACKEND_URL}/api/admin/order/${ORDER_ID}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getTOKEN}`,
              "Content-Type": "application/json",
              Accept: "application/json, application/xml",
              "Accept-Language": "en_US",
            },
          }
        );

        const data = await res.json();
        setOrder(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const formateDate = () => {
    if (order) {
      const date = new Date(order.createdAt);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    }
  };

  return (
    <div>
      <div
        className="bg-neutral-100 rounded-lg border p-6 mx-auto w-1/2 dark:bg-slate-500"
        id="oderPreview"
      >
        <div className="cardHeader flex justify-between">
          <Badge
            variant="destructive"
            className="bg-orange-400 hover:bg-orange-500 ease-in transition-colors cursor-pointer"
          >
            {order && `  ${order.order_id}`}
          </Badge>

          <div className="flex gap-2 ">
            <Badge
              variant="destructive"
              className="bg-white text-neutral-500 hover:bg-white"
            >
              <span className="font-semibold">Status</span> :
              <span className="inline-block animate-pulse rounded-full  text-neutral-500 text-sm">
                {order && `  ${order.status}`}{" "}
              </span>
            </Badge>
            <NavLink
              to={`/dashBoard/order-edit/${ORDER_ID}`}
              className="bg-orange-400 text-neutral-500 text-sm rounded-md p-1"
              title="edit order status"
            >
              <Pencil className="size-6 p-1 text-white" />
            </NavLink>
          </div>
        </div>

        {/* cardBody */}

        <div className="cardBody bg-white rounded-md border  dark:border-gray-400 p-6 mt-6 dark:bg-slate-400">
          <div className="products mb-4  ">
            <div className="product hover:bg-neutral-100 text-neutral-600 flex bg-neutral-50 p-2 rounded-md dark:bg-gray-500 dark:text-white">
              <img
                src="https://ptal.in/cdn/shop/files/31_974373bd-58b3-419b-ac7f-5428d38b7075.png"
                className="size-16 rounded-lg"
              />
              <div className="textContent flex">
                <h3 className="items-start pl-10 font-medium text-md">
                  Brass Tawa - Roti Tava in Brass
                </h3>
                <div className="items-end">Price: 565</div>
              </div>
            </div>
          </div>

          <div className="products mb-4  ">
            <div className="product hover:bg-neutral-100 text-neutral-600 flex bg-neutral-50 p-2 rounded-md dark:bg-gray-500 dark:text-white">
              <img
                src="https://ptal.in/cdn/shop/files/31_974373bd-58b3-419b-ac7f-5428d38b7075.png"
                className="size-16 rounded-lg"
              />
              <div className="textContent flex">
                <h3 className="items-start pl-10 font-medium text-md">
                  Brass Tawa - Roti Tava in Brass
                </h3>
                <div className="items-end">Price: 565</div>
              </div>
            </div>
          </div>

          <div className="products mb-4  ">
            <div className="product hover:bg-neutral-100 text-neutral-600 flex bg-neutral-50 p-2 rounded-md dark:bg-gray-500 dark:text-white">
              <img
                src="https://ptal.in/cdn/shop/files/31_974373bd-58b3-419b-ac7f-5428d38b7075.png"
                className="size-16 rounded-lg"
              />
              <div className="textContent flex">
                <h3 className="items-start pl-10 font-medium text-md">
                  Brass Tawa - Roti Tava in Brass
                </h3>
                <div className="items-end">Price: 565</div>
              </div>
            </div>
          </div>

          <div className="orderPreviewFooter dark:text-white mt-8 pt-4 border-t dark:border-t dark:border-gray-300 flex justify-between">
            <div id="date " className="text-neutral-500 dark:text-white">
              {order && formateDate()}
            </div>
            {order && (
              <div className="total flex text-neutral-600 dark:text-white">
                <IndianRupee />
                <span className="font-semibold"> {order.total_amount}</span>
              </div>
            )}
          </div>

          <div id="paymentAND_ProductDetails" className="mt-4">
            <ul className="flex flex-col gap-3 text-neutral-500">
              <li>
                {order && (
                  <span className="flex gap-2">
                    <CreditCard />
                    {order.payment_method}
                  </span>
                )}
              </li>

              <li>
                {order && (
                  <span className="flex gap-2">
                    <ShoppingBag />
                    {order.isPackage ? "Package" : "Product"}
                  </span>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderView;
