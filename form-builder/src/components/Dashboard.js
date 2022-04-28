import React, { useEffect } from "react";
import { db } from "../firebase";
import FormLookup from "./FormLookup";
import TemplateForms from "./TemplateForms";
import { collection, getDocs, addDoc } from "firebase/firestore";

export default function Dashboard() {
  useEffect(() => {
    const colRef = collection(db, "users");
    getDocs(colRef)
      .then((snapshot) => {
        let users = [];
        snapshot.docs.forEach((doc) => {
          users.push({ ...doc.data(), id: doc.id });
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <>
      <div className="w-full h-auto flex flex-col">
        <div className="templates--container flex mx-auto justify-center w-full">
          <section className="mx-auto mt-5">
            <div className="form--creator--header flex gap-2 items-center mx-40">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="rgb(22 22 22/1)"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h1 className="text-special-gray text-2xl my-3">
                New form creation
              </h1>
            </div>
            <div className="mx-auto flex justify-center">
              <div className="templates grid mx-40 gap-x-10">
                <TemplateForms
                  templateImage="https://ssl.gstatic.com/docs/templates/thumbnails/forms-blank-googlecolors.png"
                  templateTitle="Blank"
                ></TemplateForms>
                <TemplateForms
                  templateImage="https://ssl.gstatic.com/docs/templates/thumbnails/1nH6B53VXm-ujDY-fH9hKLk7IwfrzED4uTjWLjhE7xTk_400.png"
                  templateTitle="Contact information"
                ></TemplateForms>
              </div>
            </div>
          </section>
        </div>

        <div className="recent--forms--container flex mx-auto justify-center">
          <section className="mt-5">
            <div className="recent--forms--header mx-10">
              <h1 className="text-special-gray mr-auto text-xl mb-3">
                Recent forms
              </h1>
            </div>
            <div className="recent--forms mx-10 grid gap-y-6 gap-x-5 mb-20">
              <FormLookup title="Title" lastModified="16 lut 2022"></FormLookup>
              <FormLookup title="Title" lastModified="16 lut 2022"></FormLookup>
              <FormLookup title="Title" lastModified="16 lut 2022"></FormLookup>
              <FormLookup title="Title" lastModified="16 lut 2022"></FormLookup>
              <FormLookup title="Title" lastModified="16 lut 2022"></FormLookup>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
