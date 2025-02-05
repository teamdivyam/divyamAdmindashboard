import React, { useReducer, useEffect, useState, useMemo } from "react";
import { Input } from "@components/components/ui/input";
import { Label } from "@components/components/ui/label";
import { Button } from "@components/components/ui/button";
import { Textarea } from "@components/components/ui/textarea";
import { Badge } from "@components/components/ui/badge";
import { Toaster } from "@components/components/ui/sonner";
import { toast } from "sonner";
import { CirclePlus, X, Check } from "lucide-react";
import Dropzone from "shadcn-dropzone";
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
  image: yup
    .mixed()
    .required("File is required")
    .test(
      "fileSize",
      "File too large",
      (value) => value && value[0]?.size <= 5000000
    )
    .test(
      "fileType",
      "Unsupported file format",
      (value) => value && ["image/jpeg", "image/png"].includes(value[0]?.type)
    ),
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

import APP from "../../../../dataCred.js";

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
  const [uploadedFIle, setUploadedFile] = useState(null);
  const [uploadFilename, setUploadFileName] = useState(null);

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
      image: "",
      policy: "",
      // PackageListItems: [],
    },
  });

  // set value of policy empty or undefine or null
  setValue("policy", "not available");
  const getTOKEN = localStorage.getItem("AppID");
  // On SUBMIT NEW PACKAGE
  const onSubmit = (data) => {
    console.log("----DATA_FROM_FORM", data);
    // Dialoge package lists item
    const pkgListsItem = packageListItems?.map((item) => {
      return item.packageItem;
    });

    console.log("Package list array", pkgListsItem);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("capacity", data.capacity);
    formData.append("price", data.price);
    formData.append("description", data.description);
    formData.append("notes", data.notes);
    formData.append("policy", data.policy);

    pkgListsItem.forEach((item) => {
      formData.append("packageListTextItems[]", item);
    });

    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }

    // validate pkgListsItem data
    if (pkgListsItem.length <= 0) {
      toast.error("Please list can't be empty");
      return;
    }
    // const prettyDATA = {
    //   ...data,
    //   packageListTextItems: pkgListsItem,
    // };

    const postDataOnServer = async () => {
      try {
        const res = await fetch(
          `${APP && APP.BACKEND_URL}/api/admin/package/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${getTOKEN}`,
            },
            body: formData,
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

  // ON SUBMIT OF DIALOG FORM
  const onPackageListFormSubmit = (data) => {
    // Update state
    setPackageListsItem((prev) => {
      return [...prev, { id: Date.now(), packageItem: data?.packageItem }];
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

    if (!uploadedFIle) return;
    const rawFileSize = uploadedFIle?.size;
    return formatFileSize(rawFileSize);
  }, [uploadedFIle]);

  return (
    <>
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

      <Toaster />
      <div className="p-20 flex justify-between">
        <div
          className="bg-gray-200 p-6 w-[400px] h-auto rounded-lg "
          id="preview_package"
        >
          {/* <img src="https://picsum.photos/400" className="rounded-lg" /> */}
          <div className="bg-zinc-100	 rounded-md p-12">
            <Dropzone
              onDrop={(acceptedFiles) => {
                setValue("image", acceptedFiles);
                setUploadedFile(acceptedFiles[0]);
                setUploadFileName(acceptedFiles[0]?.name);
              }}
              multiple={false}
              maxFiles={1}
              accept="image/*"
            />
            <div className="file_info pt-2 flex gap-2">
              {uploadFilename ? (
                <span className="text-sm truncate">{uploadFilename}</span>
              ) : null}
              {uploadedFileSize ? (
                <span className="text-sm">Size: {uploadedFileSize}</span>
              ) : null}
            </div>
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
