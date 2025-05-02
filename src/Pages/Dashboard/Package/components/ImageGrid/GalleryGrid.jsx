import React from "react";
import ImagesGrid from "./GridImg";

import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

const GalleryGrid = ({ Images }) => {
  if (!Images) return;
  return (
    <div className="flex gap-2">
      <PhotoProvider>
        {Images.map((img, index) => {
          return (
            <PhotoView key={index} src={img.imgSrc}>
              <img src={img.imgSrc} className="size-12 rounded-lg" />
            </PhotoView>
          );
        })}
      </PhotoProvider>
    </div>
  );
};

export default React.memo(GalleryGrid);
