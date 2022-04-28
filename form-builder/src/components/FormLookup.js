import React, { useEffect, useRef, useState } from "react";
import VerticalDotsPopUp from "./VerticalDotsPopUp";

export default function FormLookup(props) {
  const [popUp, setPopUp] = useState(false);
  const self = useRef();

  function handleVerticalDotsClick() {
    setPopUp((prev) => !prev);
  }

  return (
    <>
      <div className="w-[206px] h-[246px] flex flex-col border border-[#d8d8e0] relative cursor-pointer hover:border-purple-600 rounded-md">
        <div className="formlookup--image--holder overflow-hidden rounded-t-md">
          <img src="https://ssl.gstatic.com/docs/templates/thumbnails/1nH6B53VXm-ujDY-fH9hKLk7IwfrzED4uTjWLjhE7xTk_400.png"></img>
        </div>
        <div className="footer--content px-5 py-4 text-special-gray border-t border-t-[#d8d8e0]">
          <p className="truncate ...">{props.title}</p>
          <div className="flex items-center gap-2">
            <div className="forms--logo">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <span className=" text-xs">{props.lastModified}</span>
            <div
              className="icon--dots-vertical rounded-full hover:bg-slate-200 ml-auto p-1 active:bg-gray-300"
              onClick={handleVerticalDotsClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                ref={self}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </div>
          </div>
        </div>
        {popUp && <VerticalDotsPopUp origin={self} state={[popUp, setPopUp]} />}
      </div>
    </>
  );
}
