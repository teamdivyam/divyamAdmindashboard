import React from "react";

const NOT_FOUND = () => {
  return (
    <div className="w-full h-screen  flex justify-center items-center">
      <div>
        <h1 className="uppercase font-medium tracking-widest text-8xl text-neutral-500">
          404
        </h1>
        <p className="font-thin">
          The page you're looking for is out of reach. Go back to the {""}
          <a href="/" className="text-blue-500">
            homepage
          </a>{" "}
          {""}
          or try navigating through the menu.
        </p>
      </div>
    </div>
  );
};

export default NOT_FOUND;
