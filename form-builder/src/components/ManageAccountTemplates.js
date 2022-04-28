import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ManageAccountTemplates(props) {
  const navigate = useNavigate();
  function handleClick() {
    document.getElementById(JSON.stringify(props.id)).classList.add("active");
    setTimeout(() => {
      navigate(props.navigate);
    }, 400);
  }
  function handleEnter() {
    if (props.id === 1) {
      const el = document.getElementById(JSON.stringify((props.id + 1) * 11));
      el.classList.add("wider");
    } else if (props.id === 6 || props.id === 4) {
      const el = document.getElementById(JSON.stringify(props.id * 11));
      el.classList.add("wider");
    } else if (props.id === 5) {
      const el = document.getElementById(JSON.stringify((props.id + 1) * 11));
      el.classList.add("wider");
    } else {
      const el = document.getElementById(JSON.stringify(props.id * 11));
      const el2 = document.getElementById(JSON.stringify((props.id + 1) * 11));
      el.classList.add("wider");
      el2.classList.add("wider");
    }
  }

  function handleLeave() {
    if (props.id === 1) {
      const el = document.getElementById(JSON.stringify((props.id + 1) * 11));
      el.classList.remove("wider");
    } else if (props.id === 6 || props.id === 4) {
      const el = document.getElementById(JSON.stringify(props.id * 11));
      el.classList.remove("wider");
    } else if (props.id === 5) {
      const el = document.getElementById(JSON.stringify((props.id + 1) * 11));
      el.classList.remove("wider");
    } else {
      const el = document.getElementById(JSON.stringify(props.id * 11));
      const el2 = document.getElementById(JSON.stringify((props.id + 1) * 11));
      el.classList.remove("wider");
      el2.classList.remove("wider");
    }
  }

  return (
    <>
      <div
        className="hover:bg-gray-100 cursor-pointer account--info--item relative"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        id={props.id}
      >
        {!props.first && (
          <div
            className="border-t border-t-[#dadce0] h-[1px] ml-5 spacer--manage--account"
            id={props.idSpacer}
          ></div>
        )}
        <div
          onClick={handleClick}
          className="flex flex-col ml-5 py-4 items-center pr-3"
        >
          <div className="w-full pr-5 flex items-center">
            <div className="w-[80%] flex items-center template--account--info">
              <div className="flex items-center mr-[24px] pt-1 secondbasis--manage--account--title">
                <span className="text-[#5f6368] text-[.6875rem] w-auto font-medium leading-4 tracking-[.07272727em]">
                  {props.title}
                </span>
              </div>
              <div className="mr-[24px] flex flex-grow flex-shrink secondbasis--manage-account--desc">
                <span>{props.description}</span>
              </div>
            </div>
            {props.lastItem}
          </div>
        </div>
      </div>
    </>
  );
}
