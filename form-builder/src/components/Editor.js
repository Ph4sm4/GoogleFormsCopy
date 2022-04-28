import React from "react";
import { UserContext } from "../contexts/ContextProvider";

export default function Editor(props) {
  const element = props.elementToRender;

  return (
    <>
      <main className="editor--content h-auto flex justify-center items-center">
        {element}
      </main>
    </>
  );
}
