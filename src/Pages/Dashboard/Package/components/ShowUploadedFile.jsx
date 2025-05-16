import { X } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeSingleUploadedImg } from "../../../../store/UploadImages/uploadImageSlice.js";
import fileSize from "../../../../utils/fileSize.js";

const ShowUploadedFile = ({ Size, ImgUrl, TimeStamp, ISUploading, File }) => {
  if (!ImgUrl) return;

  const dispatch = useDispatch();
  var size = fileSize(Size);

  const bannerIMG = useSelector((state) => state.banners);

  return (
    <>
      <div className="file-wrapper flex justify-between border items-center gap-4 p-3 rounded-md">
        <div className="flex gap-4">
          <img loading="lazy" src={ImgUrl} className="size-12 rounded-md" />
          <div className=" rounded-sm" id="fileTextContent">
            <h3 className="text-gray-500 font-normal capitalize">
              {File.filename}
            </h3>
            <span className="bg-gray-100 text-amber-400 px-2 py-1 text-sm rounded-full font-normal ">
              {size}
            </span>
          </div>
        </div>
        <span
          className="size-10 flex justify-center items-center rounded-full hover:bg-gray-700 ease-in duration-100 transition-colors group"
          onClick={() => {
            dispatch(removeSingleUploadedImg(File));
          }}
        >
          <X className="text-neutral-400 cursor-pointer group-hover:text-white" />
        </span>
      </div>
    </>
  );
};

export default ShowUploadedFile;
