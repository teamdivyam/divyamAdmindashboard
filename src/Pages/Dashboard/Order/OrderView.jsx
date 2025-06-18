import React, { useEffect, useRef, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { config } from "../../../../config.js";
import { Badge } from "@components/components/ui/badge";
import { Button } from "@components/components/ui/button";
import { IndianRupee, Pencil, Phone } from "lucide-react";
import OrderedProduct from "./components/OrderedProduct.jsx";
import { useReactToPrint } from "react-to-print";
import { X, ShieldCheck, PhoneCall, MoveHorizontal } from "lucide-react";
import Modal from "../Package/components/Modal.jsx";
import Loader from "../../../components/components/Loader.jsx";
import moment from "moment/moment.js";

const OrderView = () => {
  const [loading, setLoading] = useState(true);
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

  const bookingDate = () => {
    const startBookingDate = moment(order.booking?.startDate).format(
      "DD-MM-YYYY"
    );
    const endBookingDate = moment(order.booking?.endDate).format("DD-MM-YYYY");

    return (
      <div className="flex gap-4">
        {startBookingDate} <MoveHorizontal className="text-neutral-400" />
        {endBookingDate}
      </div>
    );
  };
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

        const result = await res.json();
        setOrder(result.Order);
        setTimeout(() => {
          setLoading(false);
        }, 600);
      } catch (error) {
        setLoading(true);
        console.log(error);
      }
    };

    fetchData();
  }, []);

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

      {loading ? (
        <Loader />
      ) : (
        <>
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
                    {order && ` OrderID: ${order.orderId}`}
                  </Badge>

                  <div className="flex gap-2 ">
                    <Badge
                      variant="destructive"
                      className="bg-white text-neutral-500 hover:bg-white"
                    >
                      <span className="inline-block rounded-full  text-neutral-400 text-sm font-normal  capitalize">
                        {order && order.orderStatus}
                      </span>
                    </Badge>
                    <NavLink
                      to={`/dashBoard/edit-order/${ORDER_ID}`}
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
                            <p className="text-gray-400 whitespace-no-wrap">
                              <span className="flex items-center gap-2">
                                {order?.customer?.avatar && (
                                  <img
                                    src={`${config.IMAGE_CDN}/Uploads/users/${
                                      order?.customer?.avatar || null
                                    }`}
                                    className="size-7 rounded-full shadow-sm"
                                    onClick={() => {
                                      setIsphotoViewer((p) => !p);
                                    }}
                                  />
                                )}

                                {order?.customer?.fullName || (
                                  <span>Not available</span>
                                )}
                              </span>
                            </p>
                          </td>
                        </tr>

                        <tr>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">
                              Booking Date:
                            </p>
                          </td>

                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-400 whitespace-no-wrap">
                              {bookingDate()}
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
                            <p className="text-gray-400 whitespace-no-wrap">
                              {order?.customer?.gender || "not available"}
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
                            <p className="text-gray-400 whitespace-no-wrap">
                              <div className="flex gap-1">
                                {order?.transaction?.paymentMethod ||
                                  "Not available"}
                                {order?.transaction?.status == "success" ? (
                                  <ShieldCheck className="text-green-500 bg-neutral-100 rounded-full p-1" />
                                ) : null}
                              </div>
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
                            <p className="text-gray-400 whitespace-no-wrap">
                              {order && order.orderStatus}
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
                            <p className="text-gray-400 whitespace-no-wrap">
                              {`${order.booking.address.area}  ${order.booking.address.city} ${order.booking.address.state} 
                             ${order.booking.address.pinCode} Landmark : ${order.booking.address.landMark}`}
                              <span className="flex items-center mt-2">
                                <span className="flex justify-center items-center bg-blue-500 size-5  rounded-full w-[300]">
                                  <Phone className="text-white " size={10} />
                                </span>
                                <span className="ml-2">
                                  {order.booking.address.contactNumber}
                                </span>
                              </span>
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
                            <p className="text-gray-800 whitespace-no-wrap font-semibold">
                              <span className="flex items-center">
                                <IndianRupee className="size-4" />{" "}
                                {order && order?.transaction?.amount}
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
                  className="w-40 uppercase transition-colors duration-150 ease-in bg-amber-600 font-semibold tracking-widest "
                  onClick={handlePrintOrder}
                >
                  Print Now
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default OrderView;
