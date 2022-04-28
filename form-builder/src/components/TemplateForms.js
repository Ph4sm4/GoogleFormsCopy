import React from "react";

export default function TemplateForms(props) {
  return (
    <>
      <div className="h-[167px] w-[164px] mb-[24px] text-special-gray cursor-pointer">
        <div className="templateImageContainer mb-1 hover:border hover:border-purple-600 overflow-hidden rounded-md">
          <img src={props.templateImage}></img>
        </div>
        <span>{props.templateTitle}</span>
      </div>
    </>
  );
}
