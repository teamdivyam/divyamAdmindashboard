import React, { useEffect, useRef, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { config } from "../../../../config.js";
import { Badge } from "@components/components/ui/badge";
import { Button } from "@components/components/ui/button";
import { IndianRupee, CreditCard, ShoppingBag, Pencil } from "lucide-react";
import OrderedProduct from "./components/OrderedProduct.jsx";
import { useReactToPrint } from "react-to-print";
import moment from "moment/moment.js";
import { X } from "lucide-react";
import Modal from "../Package/components/Modal.jsx";
const OrderView = () => {
  const [order, setOrder] = useState(null);
  const { ORDER_ID } = useParams();

  const [isPhotoeViewer, setIsphotoViewer] = useState();

  const orderContainerRef = useRef(null);
  if (!ORDER_ID) return;

  const getTOKEN = localStorage.getItem("AppID");

  const handlePrintOrder = useReactToPrint({
    contentRef: orderContainerRef,
    documentTitle: "Order-Info",
    bodyClass: "react-pdf-print-document-width-full",
    // pageStyle: "@page { size: 5.5in 4in }",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${config.BACKEND_URL}/api/admin/order/${ORDER_ID}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getTOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();
        setOrder(data.order);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  if (!order) {
    return;
  }

  return (
    <>
      {isPhotoeViewer && (
        <Modal isModalOpen={isPhotoeViewer} id="img_viewer">
          <div className="modal__container w-[300px] p-4">
            <div className="modal__header border-b flex justify-end">
              <button
                onClick={() => {
                  setIsphotoViewer((p) => !p);
                }}
              >
                <X className="text-slate-700 " />
              </button>
            </div>
            <div className="modal__body">
              <img
                src={`${config.IMAGE_CDN}/Uploads/users/${order.customer.avatar}`}
                className="object-cover"
              />
            </div>
          </div>
        </Modal>
      )}

      <div id="order-wrapper">
        <div
          className="bg-neutral-100 rounded-lg border p-6 mx-auto w-1/2 dark:bg-slate-500"
          id="oderPreview"
        >
          <div ref={orderContainerRef} id="container-wrapper">
            <div className="cardHeader flex justify-between">
              <Badge
                variant="destructive"
                className="bg-orange-400 hover:bg-orange-500 ease-in transition-colors cursor-pointer"
              >
                {order && ` OrderID: ${order.orderId.split("_").at(1)}`}
              </Badge>

              <div className="flex gap-2 ">
                <Badge
                  variant="destructive"
                  className="bg-white text-neutral-500 hover:bg-white"
                >
                  <span className="inline-block rounded-full  text-neutral-400 text-sm font-normal  uppercase">
                    {order.orderStatus}
                  </span>
                </Badge>
                <NavLink
                  to={`/dashBoard/order-edit/${ORDER_ID}`}
                  className="bg-orange-400 text-neutral-500 text-sm rounded-md p-1
                  edit-order-icon
                  "
                  title="edit order status"
                >
                  <Pencil className="size-6 p-1 text-white edit-order-icon" />
                </NavLink>
              </div>
            </div>
            {/* cardBody */}
            <div className="cardBody bg-white rounded-md border  dark:border-gray-400 p-6 mt-6 dark:bg-slate-400">
              <div className="products mb-4  product-card ">
                {order && <OrderedProduct Product={order.product} />}
              </div>
            </div>

            {/* display order-info */}
            <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
              <div className="inline-block min-w-full shadow-sm rounded-sm overflow-hidden">
                <table className="min-w-full leading-normal">
                  <tbody>
                    <tr>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          Name:
                        </p>
                      </td>

                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          <span className="flex items-center gap-2">
                            <img
                              src={`${config.IMAGE_CDN}/Uploads/users/${order.customer.avatar}`}
                              className="size-7 rounded-full shadow-sm"
                              onClick={() => {
                                setIsphotoViewer((p) => !p);
                              }}
                            />
                            {order.customer.fullName}
                          </span>
                        </p>
                      </td>
                    </tr>

                    <tr>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">Dob:</p>
                      </td>

                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {moment(order.customer.dob).format("DD-MM-YYYY")}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          Gender:
                        </p>
                      </td>

                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {order.customer.gender}
                        </p>
                      </td>
                    </tr>

                    <tr>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          Payment mode:
                        </p>
                      </td>

                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {order.payment.method}
                        </p>
                      </td>
                    </tr>

                    <tr>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          Order status
                        </p>
                      </td>

                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {order.orderStatus}
                        </p>
                      </td>
                    </tr>

                    <tr>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          Address:
                        </p>
                      </td>

                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {order?.customer?.address}
                        </p>
                      </td>
                    </tr>

                    <tr>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap font-semibold">
                          Total Amount:
                        </p>
                      </td>

                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap font-semibold">
                          <span className="flex items-center">
                            <IndianRupee className="size-4" />
                            {order.totalAmount}
                          </span>
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-end">
            <Button
              className="w-40 uppercase bg-amber-600 font-normal"
              onClick={handlePrintOrder}
            >
              Print Now
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderView;
