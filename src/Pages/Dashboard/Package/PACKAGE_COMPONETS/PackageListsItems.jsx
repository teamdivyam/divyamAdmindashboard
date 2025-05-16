import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@components/components/ui/dialog";

const PackageListsItems = () => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Package Lists Items</DialogTitle>
          <DialogDescription>
            <span className="block mb-4 pt-1 border-b">
              Add the items that are included in this package.
            </span>
            <div className="packageItemsList">
              {packageListItems && packageListItems.length > 0 ? (
                packageListItems?.map((item) => (
                  <div key={item.id} className="packagesListsWrapper">
                    <div className="bg-neutral-100 rounded p-1 text-lg flex items-center justify-between my-2">
                      <span>{item.packageItem}</span>
                      <span>
                        <X
                          className="size-4 rounded-full text-black cursor-pointer transition-colors ease-out duration-300 hover:bg-orange-300 hover:text-white"
                          onClick={() => handleRemoveListItem(item.id)}
                        />
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-neutral-500 italic">
                  No items added yet. Add items below.
                </div>
              )}
            </div>
            <div>
              <form onSubmit={handlePackageListForm(onPackageListFormSubmit)}>
                <div className="dialog__footer flex mt-8">
                  <Input
                    className="h-10 focus-visible:ring-offset-0 focus-visible:ring-0 rounded-r-none"
                    placeholder="Add new package list item"
                    {...PACKAGE_LIST_FORM("packageItem")}
                  />

                  <button
                    type="submit"
                    className="bg-orange-400 rounded-md w-12 flex items-center justify-center text-white rounded-l-none"
                  >
                    <CirclePlus />
                  </button>
                </div>
                <p className="text-red-400 capitalize mt-1">
                  {pkgFormErr && pkgFormErr.packageItem?.message}
                </p>
              </form>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                className="bg-orange-400 hover:bg-orange-300 w-32"
                onClick={() => setOpen(false)}
              >
                Done
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PackageListsItems;
