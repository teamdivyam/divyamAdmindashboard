import React from "react";
import { IndianRupee } from "lucide-react";

const OrderedProduct = ({ Product }) => {
  if (!Product) return;

  // product-first-image
  const imgSRC = Product?.productId?.productImg[0]?.imgSrc;

  return (
    <>
      <div
        id="ordered-product-card"
        className="flex  justify-between items-center"
      >
        <img src={imgSRC} className="size-16 rounded-lg" />

        <div className="ordered-product-text flex flex-col gap-1 pl-4">
          <h1 className="ordered-product-heading">
            {Product?.productId?.name}
          </h1>
          <p className="ordered-product-card-text-info w-[390px] text-sm font-thin truncate">
            {Product?.productId?.description}
          </p>
        </div>
        <div className="ordered-product-amount flex ">
          <IndianRupee /> <span>{Product && Product.price}</span>
        </div>
      </div>
    </>
  );
};

export default OrderedProduct;
