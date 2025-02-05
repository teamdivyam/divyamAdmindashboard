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

import Dropzone from "shadcn-dropzone";
import APP from "../../../../dataCred.js";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { Check, CirclePlus, CloudFog, X } from "lucide-react";

const initialState = {
  name: "",
  capacity: "",
  price: "",
  notes: "",
  description: "",
  packageListTextItems: [],
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

    default: {
      return state;
    }
  }
};
const initialFileState = {
  fileSize: "",
  fileName: "",
  fileType: "",
};

const fileReducers = (state, action) => {
  switch (action.type) {
    case "SET_FILE_SIZE": {
      return { ...state, fileSize: action.payload };
    }

    case "SET_FILE_NAME": {
      return { ...state, fileName: action.payload };
    }
    case "SET_FILE_TYPE": {
      return { ...state, fileType: action.payload };
    }
    default: {
      return state;
    }
  }
};

const ViewPackage = () => {
  const { PKG_ID } = useParams();
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(Reducer, initialState);
  const [open, setOpen] = useState(false);
  const [openUploadImgDialog, setOpenUploadImgDialog] = useState(false);

  const [fileState, dispatchFileState] = useReducer(
    fileReducers,
    initialFileState
  );

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
      image: "",
    },
  });

  const getTOKEN = localStorage.getItem("AppID");

  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("capacity", data.capacity);
    formData.append("price", data.price);
    formData.append("description", data.description);
    formData.append("notes", data.notes);
    formData.append("policy", "not available..");

    state.packageListTextItems.forEach((item) => {
      formData.append("packageListTextItems[]", item);
    });
    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }

    for (var pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    const updatePKG = async () => {
      try {
        const res = await fetch(
          `${APP.BACKEND_URL}/api/admin/package/${PKG_ID}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${getTOKEN}`,
            },
            body: formData,
          }
        );

        if (!res.ok) {
          toast.error(result?.msg);
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

  const uploadedFileSize = useMemo(() => {
    function formatFileSize(bytes) {
      if (bytes < 1024) {
        return `${bytes} bytes`;
      } else if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(2)} KB`;
      } else if (bytes < 1024 * 1024 * 1024) {
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
      } else {
        return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
      }
    }

    if (!fileState && !fileState.fileSize) return;
    const rawFileSize = fileState?.fileSize;
    return formatFileSize(rawFileSize);
  }, [fileState.fileSize]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(
          `${APP.BACKEND_URL}/api/admin/package/${PKG_ID}`,
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
        dispatch({ type: "IMG", payload: data?.images });

        // console.log(data?.packageListTextItems);

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

  return (
    <div>
      <Dialog open={openUploadImgDialog} onOpenChange={setOpenUploadImgDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload images</DialogTitle>
            <DialogDescription>
              <span className="border block p-12 rounded-md bg-orange-100 w-full h-auto">
                <Dropzone
                  onDrop={(acceptedFiles) => {
                    dispatchFileState({
                      type: "SET_FILE_SIZE",
                      payload: acceptedFiles[0]?.size,
                    });

                    // dispatch file name
                    dispatchFileState({
                      type: "SET_FILE_NAME",
                      payload: acceptedFiles[0]?.name,
                    });

                    setValue("image", acceptedFiles[0]);
                  }}
                  accept="image/*"
                />
              </span>
              <span className="file-info">
                <span className="flex gap-4 mt-3">
                  {fileState.fileName && <span>{fileState.fileName}</span>}
                  {fileState.fileSize && <span>Size:{uploadedFileSize}</span>}
                </span>
              </span>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

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
          {state?.image ? (
            <img
              loading="lazy"
              src={`${APP && APP.IMG_PATH}/Uploads/package/${state.image}`}
              alt="Package"
              className="w-full rounded-lg"
              onError={(e) =>
                (e.currentTarget.src =
                  "https://placehold.co/280x200?text=Not%20available")
              }
            />
          ) : (
            <p className="text-gray-500">Can't get image</p>
          )}

          <Button
            className="w-full mt-2 hidden"
            variant="secondary"
            onClick={() => setOpenUploadImgDialog(!openUploadImgDialog)}
          >
            Change uploaded images
          </Button>
          <span className="textPackage">
            <h3 className="mt-4 font-medium text-2xl text-wrap">
              {state && state.name}
            </h3>

            {/* Price and Capacity */}
            <div className="price_Cap">
              <div className="flex gap-3 justify-end pt-2 pb-3">
                <Badge
                  variant="destructive"
                  className="bg-orange-500 hover:bg-gray-700"
                >
                  Price:
                  {state && `  ${state.price}`}
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
