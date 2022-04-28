import React, { useEffect, useRef } from "react";

export default function VerticalDotsPopUp(props) {
  const el = useRef();
  const popBox = useRef();
  const origin = props.origin;
  const [popUp, setPopUp] = props.state;

  useEffect(() => {
    el.current.classList.add("active");
    function handleOutside(e) {
      if (e.target === popBox.current) return;
      if (e.target !== el.current && e.target !== origin.current) {
        el.current.classList.remove("active");
        setPopUp(false);
      }
    }

    document.addEventListener("click", handleOutside);

    return () => document.removeEventListener("click", handleOutside);
  }, []);

  return (
    <>
      <div
        ref={el}
        className="vertical--dots--popup z-10 grid grid-cols-1 grid-rows-3 rounded-md w-[281px] h-[132px] py-3 bg-white shadow-lg absolute bottom-0 -translate-y-[50%] left-[15%]"
      >
        <div className="flex items-center px-4 hover:bg-gray-100" ref={popBox}>
          <img
            src="https://img.icons8.com/ios-filled/50/000000/lowercase.png"
            width={24}
            height={24}
            className="object-scale-down"
          />
          <span className="ml-5">Change title</span>
        </div>
        <div className="flex items-center px-4 hover:bg-gray-100">
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <span className="ml-5">Delete</span>
        </div>
        <div className="flex items-center px-4 hover:bg-gray-100">
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
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          <span className="ml-5">Open in new tab</span>
        </div>
      </div>
    </>
  );
}
