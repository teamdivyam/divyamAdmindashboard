import React, { useReducer, useEffect, useState, useMemo } from "react";
import { Input } from "@components/components/ui/input";
import { Label } from "@components/components/ui/label";
import { Button } from "@components/components/ui/button";
import { Textarea } from "@components/components/ui/textarea";
import { Badge } from "@components/components/ui/badge";
import { Toaster } from "@components/components/ui/sonner";
import { toast } from "sonner";
import { CirclePlus, X, Check } from "lucide-react";
import ModalUploadFiles from "./components/Modal.jsx";
import ReactStars from "react-rating-stars-component";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@components/components/ui/dialog";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

const ADD_NEW_PKG_VALIDATE_SCHEMA = yup.object({
  name: yup.string().required("Package Name is required."),
  capacity: yup.string().required("capacity is required."),
  price: yup.string().required("price is required."),
  description: yup.string().required("description is required."),
  notes: yup.string(),
  policy: yup.string(),
});

// state for reducers..
const initialState = {
  pkg_name: "",
  capacity: "",
  price: "",
  notes: "",
  description: "",
  file: "",
};

import { config } from "../../../../config.js";
import HandleMultiFileUpload from "./components/HandleMultiFile-BannerUploads.jsx";
import HandleMultiFileProductImagesUploads from "./components/HandleMultiFile-ProductImages.jsx";
import { useSelector, useDispatch } from "react-redux";
import getFileNameFromImgURL from "../../../utils/extractFileNameFromImgUrl.js";
import { resetImageStore } from "../../../store/UploadImages/uploadImageSlice.js";
import { useLocation } from "react-router-dom";

const Reducer = (state, action) => {
  switch (action.type) {
    case "ADD_PKG_NAME": {
      return { ...state, pkg_name: action.payload };
    }

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
    default: {
      return state;
    }
  }
};

// COMPONENT___
const ADD_NEW_PKG = () => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  const [open, setOpen] = useState(false);
  const [packageListItems, setPackageListsItem] = useState([]);
  const [starCount, setStartCount] = useState();
  const [isShowBannerDiloge, setShowbannerialoge] = useState();
  const [isShowProductDiloge, setShowProductdialoge] = useState();

  const location = useLocation();

  const storeDispatch = useDispatch();

  const productBannerImg = useSelector((state) => state.UploadedImgs.banners);
  const productImgs = useSelector((state) => state.UploadedImgs.productImages);

  const productBannerImgArr = useMemo(() => {
    const returnValue = productBannerImg?.map((banner, idx) => {
      return {
        imgPath: getFileNameFromImgURL(banner.imgUrl),
        order: idx + 1,
        title: banner.filename,
        imageType: banner.imageType,
      };
    });
    return returnValue;
  });

  const productMainImg = useMemo(() => {
    const returnValue = productImgs.map((productImg, idx) => {
      return {
        imgPath: getFileNameFromImgURL(productImg.imgUrl),
        order: idx + 1,
        title: productImg.filename,
        imageType: productImg.imageType,
      };
    });
    return returnValue;
  });

  // New Package creation Validation Form

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    mode: "all",
    resolver: yupResolver(ADD_NEW_PKG_VALIDATE_SCHEMA),
    defaultValues: {
      name: "",
      capacity: "",
      price: "",
      description: "",
      notes: "",
      packageListTextItems: "",
      policy: "",
      PackageListItems: [],
    },
  });

  // set value of policy empty or undefine or null
  setValue("policy", "not available");

  const getTOKEN = localStorage.getItem("AppID");

  // On SUBMIT NEW PACKAGE
  const onSubmit = (data) => {
    if (!starCount) return;

    // Dialoge package lists item
    const pkgListsItem = packageListItems?.map((item) => {
      return item.packageItem;
    });

    const payload = {
      name: data.name,
      description: data.description,
      capacity: data.capacity,
      price: Number(data.price),
      notes: data.notes,
      policy: data.policy,
      packageListTextItems: pkgListsItem,
      productBannerImgArr,
      productMainImgArr: productMainImg,
      rating: starCount,
    };

    // pkgListsItem.forEach((item) => {
    //   formData.append("packageListTextItems[]", item);
    // });

    // validate pkgListsItem data
    if (pkgListsItem.length <= 0) {
      toast.error("Please list can't be empty");
      return;
    }

    const postDataOnServer = async () => {
      try {
        const res = await fetch(
          `${config && config.BACKEND_URL}/api/admin/package/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getTOKEN}`,
            },
            body: JSON.stringify(payload),
          }
        );
        if (!res.ok) {
          toast("Internal error");
        }

        const results = await res.json();
        console.log(results);

        if (!results?.success) {
          toast("Opps something wen wrong.");
        }
        // on SUccess
        toast("New package added successfully..");

        // Reset-package-store
        dispatchREDUX(resetImageStore());
      } catch (error) {
        console.log(error);
      }
    };

    postDataOnServer();
  };

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
    reset: restPackageListForm,
  } = useForm({
    mode: "all",
    resolver: yupResolver(PACKAGE_LISTS_ITEMS_VALIDATION_SCHEMA),
    defaultValues: {
      PackageListItems: [],
    },
  });

  const ratingChanged = (starCount) => {
    setStartCount(starCount);
  };

  // ON SUBMIT OF DIALOG FORM
  const onPackageListFormSubmit = (data) => {
    // Update state
    setPackageListsItem((prev) => {
      return [...prev, { id: Date.now(), packageItem: data.packageItem }];
    });

    setTimeout(() => {
      restPackageListForm();
    }, 100);
  };

  const handlbannerModal = () => {
    setShowbannerialoge((p) => !p);
  };

  const handleproductModal = () => {
    setShowProductdialoge((p) => !p);
  };

  useEffect(() => {
    storeDispatch(resetImageStore());
  }, [location.pathname]);

  return (
    <>
      <Toaster richColors />

      <ModalUploadFiles
        isModalOpen={isShowBannerDiloge}
        contentLabel="banner-ui" // Upload-product-banner-images
        id="product-banner"
      >
        <HandleMultiFileUpload ToggleModal={handlbannerModal} />
      </ModalUploadFiles>

      <ModalUploadFiles
        isModalOpen={isShowProductDiloge}
        contentLabel="banner-ui" // Upload-product-banner-images
        id="product-banner"
      >
        <HandleMultiFileProductImagesUploads ToggleModal={handleproductModal} />
      </ModalUploadFiles>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Package lists items </DialogTitle>
            <DialogDescription>
              <span className="block mb-4 pt-1 border-b">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              </span>
              <span>
                {packageListItems &&
                  packageListItems.map((item) => {
                    return (
                      <span key={item.id} className="packagesListsWrapper">
                        <span className="bg-neutral-100 rounded p-1 text-lg flex items-center justify-between my-2">
                          {item.packageItem}
                          <span>
                            <X
                              className="size-4   rounded-full text-black cursor-pointer transition-colors ease-out duration-300 hover:bg-orange-300 hover:text-white"
                              onClick={(e) => {
                                const removeListItem = packageListItems.filter(
                                  (pkg) => {
                                    return pkg.id != item.id;
                                  }
                                );
                                setPackageListsItem(removeListItem);
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

      <div className="p-20 flex justify-between">
        <div
          className="bg-gray-200 p-6 w-[400px] h-auto rounded-lg "
          id="preview_package"
        >
          <div className="flex flex-col gap-3">
            <Button onClick={handlbannerModal} className="w-full bg-blue-400">
              Upload Banners images
            </Button>
            <Button
              onClick={handleproductModal}
              className="w-full bg-amber-400"
            >
              Uplaod Product images
            </Button>
          </div>

          <span className="textPackage">
            <h3 className="mt-4 font-medium text-2xl text-wrap">
              {state && state.pkg_name}
            </h3>

            {/* Price and Capacity */}
            <div className="price_Cap">
              <div className="flex gap-3 justify-end pt-2 pb-3">
                {state && state.price ? (
                  <Badge
                    variant="destructive"
                    className="bg-orange-500 hover:bg-gray-700"
                  >
                    Price:
                    {state && `  ${state.price}`}
                  </Badge>
                ) : null}

                {state && state.capacity ? (
                  <Badge
                    variant="destructive"
                    className="bg-black hover:bg-gray-700"
                  >
                    Capacity:
                    {state && `  ${state.capacity}`} People
                  </Badge>
                ) : null}
              </div>
              {/* PACKAGE LISTS */}
              <div className="flex flex-col gap-2 ">
                {packageListItems &&
                  packageListItems.map((pkg) => {
                    return (
                      <div
                        key={pkg.id}
                        className="flex justify-start items-center gap-2"
                      >
                        <span className="bg-green-400 size-4 rounded-full flex justify-center items-center ">
                          <Check className="text-white size-3" />
                        </span>
                        <p className="text-neutral-500">{pkg.packageItem}</p>
                      </div>
                    );
                  })}
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
                  type="text"
                  placeholder="Basic Packages"
                  required
                  className="py-6"
                  value={state && state.pkg_name}
                  {...register("name")}
                  onChange={(e) => {
                    dispatch({ type: "ADD_PKG_NAME", payload: e.target.value });
                  }}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="text"
                  placeholder="100 People"
                  required
                  className="py-6"
                  value={state && state.capacity}
                  {...register("capacity")}
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
                  required
                  className="py-6"
                  value={state && state.price.replace("₹", "")}
                  {...register("price")}
                  onChange={(e) => {
                    dispatch({ type: "ADD_PRICE", payload: e.target.value });
                  }}
                />
              </div>
              <div className="grid-gap-2">
                <Label htmlFor="price">Package rating</Label>
                <ReactStars
                  count={5}
                  onChange={ratingChanged}
                  size={24}
                  activeColor="#ffd700"
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

              <div className="grid gap-2">
                <Label htmlFor="policy">Notes or Policy</Label>
                <Textarea
                  id="policy"
                  className="h-2"
                  value={state && state.notes}
                  {...register("notes")}
                  onChange={(e) => {
                    dispatch({ type: "ADD_NOTES", payload: e.target.value });
                  }}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>

                <Textarea
                  id="description"
                  placeholder="Package description.."
                  className="h-20"
                  value={state && state.description}
                  {...register("description")}
                  onChange={(e) => {
                    dispatch({ type: "ADD_DESC", payload: e.target.value });
                  }}
                />
              </div>

              <Button type="submit" className="bg-theme-color py-6 ">
                Add New Package
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ADD_NEW_PKG;
