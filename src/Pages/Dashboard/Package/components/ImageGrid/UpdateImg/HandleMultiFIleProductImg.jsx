import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import { nanoid } from "@reduxjs/toolkit";
import { Skeleton } from "@components/components/ui/skeleton";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import ShowUploadedFile from "../../ShowUploadedFile.jsx";
import { config } from "../../../../../../../config.js";
import {
  uploadSingleImg,
  uploadSingleProductImg,
} from "../../../../../../store/UploadImages/uploadImageSlice.js";

const getTOKEN = localStorage.getItem("AppID");

const getSignedUrl = async (fileName) => {
  try {
    const response = await fetch(
      `${config.BACKEND_URL}/api/admin/get-presigned-url`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getTOKEN}`,
        },
        body: JSON.stringify({ fileName }),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("cant get presigned url");
  }
};

const HandleMultiFileProductImg = ({ ToggleModal, Images, Title }) => {
  const [isUploading, setIsUploading] = useState();
  const dispatch = useDispatch();

  const uploadedFiles = useSelector(
    (state) => state.UploadedImgs.productImages
  );

  const onDrop = async (file) => {
    const fileName = `UI/product-Img/${nanoid(12)}-${file[0].name}`;
    setIsUploading(true);

    try {
      const { url, key } = await getSignedUrl(fileName); //file-path or file-name
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedImg = await imageCompression(file[0], options);

      // console.log("SIGNED_URL", url);
      const uploadImgOnServer = async () => {
        const res = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": file[0].type,
          },
          body: compressedImg,
        });

        if (!res.ok) {
          throw new Error("Error during file upload");
        }

        const uploadedImageUrl = `${config.IMAGE_CDN}/${fileName}`;
        console.log("Uploaded Image URL:", uploadedImageUrl);

        setIsUploading(false);

        // update state
        const payload = {
          imgUrl: uploadedImageUrl,
          fileName: file[0].name,
          fileSize: compressedImg.size,
        };

        dispatch(uploadSingleProductImg(payload));
      };

      await uploadImgOnServer();
    } catch (error) {
      console.error("Upload Error:", error);
      setIsUploading(false);
    }
  };

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
  });

  return (
    <>
      <div className="lg:min-w-[800px] max-w-[800px]  h-[350px]  overflow-y-auto">
        <div className="file_Upload__header border-b flex justify-between p-4">
          <h2 className="text-gray-600 text-2xl ">{Title}</h2>
          <span
            className="close-icon hover:bg-gray-800 size-10 flex justify-center items-center rounded-full group ease-in duration-75 transition-colors"
            id="modal-close"
            onClick={ToggleModal}
          >
            <X className="text-gray-300 size-8 cursor-pointer group-hover:text-white" />
          </span>
        </div>

        <div className="file-upload-wrapper px-4 my-4">
          <div
            {...getRootProps({ className: "dropzone" })}
            className="rounded-md border-2 border-dashed mx-auto w-5/6 my-4 p-6 cursor-copy"
          >
            <input {...getInputProps()} />
            <p className="text-gray-300">
              Drag 'n' drop some files here, or click to select files
            </p>
          </div>
          {/* Display Uploded files */}

          {isUploading && (
            <div className="container border p-3 rounded-md transition-all ease-in mb-2">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[50px]" />
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {uploadedFiles &&
              uploadedFiles.length >= 0 &&
              uploadedFiles.map((file) => (
                <ShowUploadedFile
                  File={file}
                  Size={file.fileSize}
                  key={file.id}
                  ImgUrl={file.imgUrl}
                  ISUploading={isUploading}
                />
              ))}
          </div>

          {/* {Images &&
            Images.map((img) => (
              <ShowUploadedFile
                File={{}}
                Size={99897}
                key={Math.random()}
                ImgUrl={img.imgSrc}
                isUploading={false}
              />
            ))} */}
        </div>
      </div>
    </>
  );
};

export default React.memo(HandleMultiFileProductImg);
