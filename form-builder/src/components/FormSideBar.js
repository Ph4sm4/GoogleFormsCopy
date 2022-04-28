import React from "react";
import { UserContext } from "../contexts/DarkModeContext";

export default function FormSideBar() {
	const {darkMode, setDarkMode} = React.useContext(UserContext);
	React.useEffect(() => {
		if (!darkMode) {
			document
				.querySelectorAll(".form--side--bar--content")
				.forEach((el) => {
					el.classList.add("darkModeTransition");
				});
                document.querySelectorAll('.vertical--button').forEach(el => {
                    el.classList.add('slide-left-right-animation-lightvertical');
                    el.classList.remove("slide-left-right-animation-darkvertical");
                    el.classList.remove('darkModeTransition');
                })
		} else {
			document
				.querySelectorAll(".form--side--bar--content")
				.forEach((el) => {
					el.classList.remove("darkModeTransition");
				});
                document.querySelectorAll('.vertical--button').forEach(el => {
                    el.classList.remove("slide-left-right-animation-lightvertical");
                    el.classList.add("slide-left-right-animation-darkvertical");
                    el.classList.add('darkModeTransition');
                })
		}
	}, [darkMode]);

    React.useEffect(() => {
		let btn = document.querySelector(".vertical--button");
			btn.addEventListener("click", function (e) {
				console.log("created listener");
				let x = e.clientX - e.target.offsetLeft;
				let y = e.clientY - e.target.offsetTop;
	
				console.log("span created with darkmode: " + darkMode);
				let ripples = document.createElement("span");
				ripples.classList.add("ripple");
				ripples.style.background = "#C0C0C0";
				ripples.style.left = x + "px";
				ripples.style.top = y + "px";
				this.appendChild(ripples);
				setTimeout(() => {
					this.removeChild(ripples);
					ripples.remove();
				}, 1000);
			});
	}, []);


	function handleClick(){

	}


	return (
		<>
			<div className="form--side--bar--flex--row w-[90%] flex gap-1 overflow-hidden sm:gap-5 flex-row">
				<div className="form--side--bar--content w-[65%] flex gap-4 flex-col p-2 border-t">
					<input
						placeholder="Title"
						className="txt--opposite bg-transparent text-white dark:text-special-gray"
					></input>
					<input
						placeholder="Description"
						className="txt--opposite bg-transparent text-white dark:text-special-gray"
					></input>
				</div>
                <div className="edit--holder flex">
					<button className="vertical--button px-3 absolute txt--opposite text-xs md:text-base lg:text-lg xl:text-xl 2xl:text-2xl" onClick={handleClick}>EDIT</button>
				</div>
			</div>
		</>
	);
}
