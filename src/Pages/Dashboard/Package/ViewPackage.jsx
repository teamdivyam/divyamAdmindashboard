import React, { useEffect, useReducer, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@components/components/ui/input";
import { Label } from "@components/components/ui/label";
import { Button } from "@components/components/ui/button";
import { Textarea } from "@components/components/ui/textarea";
import { Badge } from "@components/components/ui/badge";
import { Toaster } from "@components/components/ui/sonner";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/components/ui/dialog";

import { Switch } from "@components/components/ui/switch";
import ReactStars from "react-rating-stars-component";
import { config } from "../../../../config.js";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { Check, CirclePlus, CloudFog, X } from "lucide-react";
import GalleryGrid from "./components/ImageGrid/GalleryGrid.jsx";
import ModalUploadFiles from "./components/Modal.jsx";
import HandleMultiFileBannerImg from "./components/ImageGrid/UpdateImg/HandleMultiFile-BannerImages.jsx";
import HandleMultiFileProductImg from "./components/ImageGrid/UpdateImg/HandleMultiFIleProductImg.jsx";
import {
  uploadSingleImg,
  uploadSingleProductImg,
} from "../../../store/UploadImages/uploadImageSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { NumericFormat } from "react-number-format";
import fileSize from "../../../utils/fileSize";
import getFileNameFromImgURL from "../../../utils/extractFileNameFromImgUrl.js";

const initialState = {
  name: "",
  capacity: "",
  price: "",
  notes: "",
  description: "",
  packageListTextItems: [],
  productImgs: [],
  bannerImgs: [],
  startCount: null,
  isVisible: null,
  isFeatured: null,
};
const PACKAGE_UPDATE_VALIDATE_SCHEMA = yup.object({
  name: yup.string(),
  capacity: yup.string(),
  price: yup.string(),
  notes: yup.string(),
  description: yup.string(),
  image: yup.string(),
});

const Reducer = (state, action) => {
  switch (action.type) {
    case "ADD_PKG_NAME":
      {
        return { ...state, name: action.payload };
      }
      break;
    case "ADD_CAPACITY": {
      return { ...state, capacity: action.payload };
    }

    case "ADD_PRICE": {
      return { ...state, price: `₹${action.payload}` };
    }
    case "ADD_NOTES": {
      return { ...state, notes: action.payload };
    }

    case "ADD_DESC": {
      return { ...state, description: action.payload };
    }

    case "SET_BANNER_IMG": {
      return { ...state, bannerImgs: action.payload };
    }

    case "SET_PRODUCT_IMG": {
      return { ...state, productImgs: action.payload };
    }
    case "SET_STAR_RATING": {
      return { ...state, startCount: action.payload };
    }

    case "ADD_PKG_TXT": {
      const newItems = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];
      return {
        ...state,
        packageListTextItems: [...state.packageListTextItems, ...newItems],
      };
    }

    case "IMG": {
      return { ...state, image: action.payload };
    }

    case "RMV_PKG_TXT": {
      const rmvItemTxt = state?.packageListTextItems.filter(
        (_, id) => id !== action.payload
      );

      return {
        ...state,
        packageListTextItems: rmvItemTxt,
      };
    }

    case "IS_VISIBLE": {
      return { ...state, isVisible: action.payload };
    }

    case "IS_PKG_FEATURED": {
      return { ...state, isFeatured: action.payload };
    }

    default: {
      return state;
    }
  }
};

const ViewPackage = () => {
  const { PKG_ID } = useParams();
  const bannerImgState = useSelector((state) => state.UploadedImgs.banners);

  const productImgState = useSelector(
    (state) => state.UploadedImgs.productImages
  );

  const dispatchReduxState = useDispatch();
  const [state, dispatch] = useReducer(Reducer, initialState);
  // to store package-response
  const [open, setOpen] = useState(false);

  //for product-img-model
  const [isProductModelOpen, setProductImgModel] = useState();
  //for product-banner-model
  const [isProductBannerModelOpen, setProductBannerModelOpen] = useState();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    mode: "all",
    resolver: yupResolver(PACKAGE_UPDATE_VALIDATE_SCHEMA),
    defaultValues: {
      name: "",
      capacity: "",
      price: "",
      notes: "",
      description: "",
    },
  });

  const getTOKEN = localStorage.getItem("AppID");

  const bannerImagesARR = bannerImgState.map((item, idx) => {
    return {
      order: idx + 1,
      imgUrl: item.imgUrl,
      filename: item.filename,
      fileSize: item.fileSize,
      imageType: item.imageType,
      imagePath: getFileNameFromImgURL(item.imgUrl),
    };
  });

  const productImagesARR = productImgState.map((item, idx) => {
    return {
      order: idx + 1,
      imgUrl: item.imgUrl,
      filename: item.filename,
      fileSize: item.fileSize,
      imageType: item.imageType,
      imagePath: getFileNameFromImgURL(item.imgUrl),
    };
  });

  const onSubmit = (data) => {
    const payload = {
      ...data,
      isFeaturedProduct: state.isFeatured,
      packageListTextItems: state.packageListTextItems,
      rating: state.startCount,
      bannerImgs: bannerImagesARR,
      productImgs: productImagesARR,
      isVisible: state.isVisible,
    };

    // state.packageListTextItems.forEach((item) => {
    //   formData.append("packageListTextItems[]", item);
    // });

    const updatePKG = async () => {
      try {
        const res = await fetch(
          `${config.BACKEND_URL}/api/admin/package/${PKG_ID}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${getTOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) {
          toast.error("Something went wrong please try again later.");
        }

        const result = await res.json();

        if (result?.success === true) {
          toast.success("Package updated successfully");
        }
      } catch (error) {
        console.log(error);
      }
    };

    updatePKG(data);
  };

  // DIALOGE FORM
  // Package Lists Items(DIALOGE FORM VALIDATION)
  const PACKAGE_LISTS_ITEMS_VALIDATION_SCHEMA = yup
    .object({
      packageItem: yup
        .string("Please add an item lists of package")
        .min(3)
        .required(),
    })
    .required("You can't submit without fill the form.");

  const {
    register: PACKAGE_LIST_FORM,
    handleSubmit: handlePackageListForm,
    formState: { errors: pkgFormErr },
    setValue,
    reset: restPackageListForm,
  } = useForm({
    mode: "all",
    resolver: yupResolver(PACKAGE_LISTS_ITEMS_VALIDATION_SCHEMA),
    defaultValues: {
      PackageListItems: [],
    },
  });

  // ON SUBMIT OF DIALOGE FORM
  const onPackageListFormSubmit = (data) => {
    dispatch({
      type: "ADD_PKG_TXT",
      payload: data?.packageItem,
    });

    restPackageListForm();
  };

  const handleStartRatingChange = (startCOUNT) => {
    dispatch({ type: "SET_STAR_RATING", payload: startCOUNT });
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(
          `${config.BACKEND_URL}/api/admin/package/${PKG_ID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getTOKEN}`,
              Accept: "application/json, application/xml",
            },
          }
        );
        const data = await response.json();
        if (!data) {
          return;
        }

        // Set all the data into state
        dispatch({ type: "ADD_PKG_NAME", payload: data.name });
        dispatch({ type: "ADD_CAPACITY", payload: data.capacity });
        dispatch({ type: "ADD_PRICE", payload: data.price });
        dispatch({ type: "ADD_NOTES", payload: data.notes });
        dispatch({ type: "ADD_DESC", payload: data.description });
        dispatch({ type: "SET_PRODUCT_IMG", payload: data?.productImg });
        dispatch({ type: "SET_BANNER_IMG", payload: data?.productBannerImgs });
        dispatch({ type: "IS_VISIBLE", payload: data?.isVisible });
        dispatch({ type: "IS_PKG_FEATURED", payload: data?.isFeatured });
        dispatch({
          type: "SET_STAR_RATING",
          payload: data?.rating,
        });

        // ADD PKG TXT ITEM
        data?.packageListTextItems.forEach((item) => {
          dispatch({
            type: "ADD_PKG_TXT",
            payload: item,
          });
        });

        reset({
          name: data?.name,
          capacity: data?.capacity,
          price: data?.price,
          description: data?.description,
        });
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  const toggleBannerImgModal = () => {
    setProductBannerModelOpen((p) => !p);
  };

  const toggleProductImgModal = () => {
    setProductImgModel((p) => !p);
  };

  // dispatch-all-already-uploaded-imags
  useEffect(() => {
    const bannerImgs = state.bannerImgs;
    const productImgs = state.productImgs;

    bannerImgs.map((img) => {
      const payload = {
        imgUrl: img.imgSrc,
        fileName: img.title,
        fileSize: "undefined",
        order: img.order,
      };

      dispatchReduxState(uploadSingleImg(payload));
    });

    productImgs.map((img) => {
      const payload = {
        imgUrl: img.imgSrc,
        fileName: img.title,
        fileSize: "undefined",
        order: img.order,
      };

      dispatchReduxState(uploadSingleProductImg(payload));
    });
  }, [state.bannerImgs, state.productImgs]);

  return (
    <div>
      <ModalUploadFiles
        isModalOpen={isProductBannerModelOpen}
        id="update-product-banner-images"
      >
        <HandleMultiFileBannerImg
          Images={state.bannerImgs}
          ToggleModal={toggleBannerImgModal}
          Title="Update Banner Images"
        />
      </ModalUploadFiles>
      {/* END_MODAL */}

      <ModalUploadFiles
        isModalOpen={isProductModelOpen}
        id="update-product-modal-images"
      >
        <HandleMultiFileProductImg
          Images={state.productImg}
          ToggleModal={toggleProductImgModal}
          Title="Update Product Images"
        ></HandleMultiFileProductImg>
      </ModalUploadFiles>
      {/* END_MODAL */}

      <Toaster richColors />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Package lists items </DialogTitle>
            <DialogDescription>
              <span className="block mb-4 pt-1 border-b">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              </span>
              <span>
                {state.packageListTextItems &&
                  state.packageListTextItems.map((item, id) => {
                    return (
                      <span
                        key={Math.random()}
                        className="packagesListsWrapper"
                      >
                        <span className="bg-neutral-100 rounded p-1 text-lg flex items-center justify-between my-2">
                          {item}
                          <span>
                            <X
                              role="button"
                              className="size-4   rounded-full text-black cursor-pointer transition-colors ease-out duration-300 hover:bg-orange-300 hover:text-white"
                              onClick={(e) => {
                                dispatch({ type: "RMV_PKG_TXT", payload: id });
                              }}
                            />
                          </span>
                        </span>
                      </span>
                    );
                  })}
              </span>
              <span>
                <form onSubmit={handlePackageListForm(onPackageListFormSubmit)}>
                  <span className="dialog__footer  flex mt-8 ">
                    <Input
                      className="h-10 focus-visible:ring-offset-0 focus-visible:ring-0 rounded-r-none"
                      placeholder="Add new package lists item"
                      {...PACKAGE_LIST_FORM("packageItem")}
                    />

                    <button
                      type="submit"
                      className="bg-orange-400 rounded-md w-12 flex items-center justify-center text-white rounded-l-none"
                    >
                      <CirclePlus />
                    </button>
                  </span>
                  <p className="text-red-400 capitalize mt-1">
                    {pkgFormErr && pkgFormErr.packageItem?.message}
                  </p>
                </form>
              </span>

              <span className="flex justify-end mt-4 ">
                <Button
                  className="bg-orange-400 hover:bg-orange-300 w-32"
                  onClick={() => setOpen((prev) => !prev)}
                >
                  Done
                </Button>
              </span>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <h2 className="text-2xl border-b mx-4 font-medium">Update Package</h2>
      <div className="p-20 flex justify-between">
        <div
          className="bg-gray-200 p-6 w-96 h-auto rounded-lg "
          id="preview_package"
        >
          <span className="textPackage">
            <h3 className="mb-4 font-semibold text-2xl text-wrap capitalize">
              {state && state.name}
            </h3>

            <h2 className=" font-normal text-neutral-600 border-b">
              Product Images
            </h2>

            <GalleryGrid Images={state.productImgs} />

            <h2 className="font-normal text-neutral-600 border-b">
              Banners Images
            </h2>
            <GalleryGrid Images={state.bannerImgs} />

            <div className="w-full flex justify-between mx-auto mt-8 gap-4">
              <Button
                onClick={() => setProductImgModel(true)}
                className="w-1/2 bg-stone-300 text-stone-600 hover:bg-stone-300 capitalize
              font-medium text-xs "
              >
                Update product images
              </Button>
              <Button
                onClick={() => setProductBannerModelOpen(true)}
                className="w-1/2 bg-stone-300 text-stone-600 hover:bg-stone-300 capitalize
              font-medium text-xs "
              >
                Update Banner images
              </Button>
            </div>

            {/* Price and Capacity */}
            <div className="price_Cap">
              <div className="flex gap-3 justify-end pt-2 pb-3">
                <Badge
                  variant="destructive"
                  className="bg-orange-500 hover:bg-gray-700"
                >
                  Price:
                  {state && (
                    <NumericFormat
                      value={state.price}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"₹"}
                    />
                  )}
                </Badge>

                <Badge
                  variant="destructive"
                  className="bg-black hover:bg-gray-700"
                >
                  Capacity:
                  {state && `  ${state.capacity}`} People
                </Badge>
              </div>

              <div className="flex flex-col gap-2">
                {state.packageListTextItems && state.packageListTextItems
                  ? state.packageListTextItems.map((item, id) => {
                      return (
                        <div
                          key={id}
                          className="flex justify-start items-center gap-2"
                        >
                          <span className="bg-green-400 size-4 rounded-full flex justify-center items-center ">
                            <Check className="text-white size-3" />
                          </span>
                          <p className="text-neutral-500">{item}</p>
                        </div>
                      );
                    })
                  : null}
              </div>

              {state && state.description ? (
                <div className="Policy bg-white rounded-md px-5 py-4 mt-2">
                  <h3 className="capitalize font-semibold">Description</h3>
                  {state && state.description}
                </div>
              ) : null}
            </div>
          </span>

          {state && state.notes ? (
            <div className="Policy bg-white rounded-md px-5 py-4 mt-2">
              <h3 className="capitalize font-semibold">Policy</h3>
              {state && state.notes}
            </div>
          ) : null}
        </div>
        <div className="bg-neutral-50 rounded-md p-12 w-1/2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  {...register("name")}
                  type="text"
                  placeholder="Basic Packages"
                  required
                  className="py-6"
                  value={state && state.name}
                  onChange={(e) => {
                    dispatch({ type: "ADD_PKG_NAME", payload: e.target.value });
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  {...register("capacity")}
                  type="text"
                  placeholder="100 People"
                  required
                  className="py-6"
                  value={state && state.capacity}
                  onChange={(e) => {
                    dispatch({ type: "ADD_CAPACITY", payload: e.target.value });
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="text"
                  placeholder="₹45000"
                  {...register("price")}
                  required
                  className="py-6"
                  value={state && state.price.replace("₹", "")}
                  onChange={(e) => {
                    dispatch({ type: "ADD_PRICE", payload: e.target.value });
                  }}
                />
              </div>

              <div className="grid_gap-2">
                <div
                  className="text-sm text-neutral-400 border w-full text-left rounded-lg p-3 cursor-pointer"
                  onClick={() => {
                    setOpen((prev) => !prev);
                  }}
                >
                  Add Package points
                </div>
              </div>

              <div className=" grid gap-2 startRatingsCount">
                <Label htmlFor="notes">Ratings</Label>
                {state && state?.startCount ? (
                  <ReactStars
                    count={5}
                    onChange={handleStartRatingChange}
                    size={24}
                    value={state?.startCount}
                    color2={"#ffd700"}
                  />
                ) : null}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Notes or Policy</Label>
                <Textarea
                  id="notes"
                  {...register("notes")}
                  className="h-2"
                  value={state && state.notes}
                  onChange={(e) => {
                    dispatch({ type: "ADD_NOTES", payload: e.target.value });
                  }}
                />
              </div>

              {/* SWITCH_FOR_TOGGLE_ISFEATURED */}
              <div className="grid gap-2">
                <div className=" rounded-md border p-3 flex justify-between items-center gap-4 shadow-sm">
                  <div>
                    <h2 className="font-normal">Show in Featured Section</h2>
                    <p className="text-xs font-sm">
                      Easily add products to the Featured category with just one
                      click. This button helps you highlight selected products,
                      making them stand out on your website
                    </p>
                  </div>
                  <Switch
                    checked={state && state.isFeatured}
                    onCheckedChange={(crntVal) => {
                      dispatch({ type: "IS_PKG_FEATURED", payload: crntVal });
                    }}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <div className=" rounded-md border p-3 flex justify-between items-center gap-4 shadow-sm">
                  <div>
                    <h2 className="font-normal">Product Visibility</h2>
                    <p className="text-xs font-sm">
                      Turn this switch on to feature this product on the
                      customer UI. When off, the product will remain hidden from
                      customers but still be available in your dashboard
                    </p>
                  </div>
                  <Switch
                    checked={state && state?.isVisible}
                    onCheckedChange={(crntVal) => {
                      dispatch({ type: "IS_VISIBLE", payload: crntVal });
                    }}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>

                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Package description.."
                  className="h-20"
                  value={state && state.description}
                  onChange={(e) => {
                    dispatch({ type: "ADD_DESC", payload: e.target.value });
                  }}
                />
              </div>

              <Button className="bg-theme-color py-6">
                Update Package Now
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ViewPackage;
