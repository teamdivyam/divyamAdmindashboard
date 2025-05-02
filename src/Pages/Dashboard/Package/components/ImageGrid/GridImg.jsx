import React from "react";

const ImagesGrid = ({ Images }) => {
  if (!Images) return;

  return (
    <div className="image-grid-wrapper  grid w-full grid-cols-6 gap-2">
      {Images.map((img, idx) => (
        <img
          key={idx}
          src={img.imgSrc}
          onError={(e) => {
            e.target.src = "https://placehold.co/200x200?text=Loading..";
            e.onError = null;
          }}
        />
      ))}
    </div>
  );
};

export default ImagesGrid;
