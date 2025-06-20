import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { config } from "../../../../config.js";

const UserCard = ({ User, isSearchResults }) => {
  let userImgSrc = User?.avatar;

  if (!userImgSrc) {
    userImgSrc = "https://placehold.co/150x150?text=NA";
  }

  return (
    <li
      id="userLists"
      className={
        isSearchResults
          ? "bg-green-50 dark:bg-slate-500 border-neutral-400  p-4 flex w-full flex-row justify-between items-center rounded-2xl"
          : "dark:bg-slate-500 border-neutral-400 bg-neutral-200 p-4 flex w-full flex-row justify-between items-center rounded-2xl"
      }
    >
      <div className="flex flex-row">
        <img
          src={userImgSrc}
          onError="this.onerror=null; this.src='https://placehold.co/150x150?text=NA'"
          className="size-16 rounded-full"
        />

        <div className="profileListTextContent pl-8 content-center	">
          <h3 className="font-bold">
            {User?.fullName ? User.fullName : "Not Available."}
          </h3>
          <h4 className="text-neutral-600 font-light dark:text-white capitalize">
            {User?.mobileNum ? User.mobileNum : "Not Available."}
          </h4>
        </div>
      </div>
      <div className="viewMore">
        <NavLink
          to={`${config && config.APP_URL}/dashboard/user/${User._id}`}
          className="text-neutral-500"
        >
          View More
        </NavLink>
      </div>
    </li>
  );
};

export default UserCard;
