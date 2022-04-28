import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetUser, useUser } from '../../contexts/ContextProvider';
import rippleTrigger from '../../functions/rippleTrigger';
import removeErrorSpecialInput from '../../functions/removeErrorSpecialInput';
import { useAuth } from '../../contexts/AuthContext';
import validator from 'email-validator';
import AppLogo from '../AppLogo';

export default function Login() {
	const [formData, setFormData] = useState({
		email: localStorage.getItem('login__email') || '',
		password: '',
	});

	const navigate = useNavigate();
	const [error, setError] = useState('');

	const inputRef = useRef();

	useEffect(() => {
		const specialInput = document.querySelector('.special--input');

		inputRef.current.value = localStorage.getItem('login__email') || '';
		inputRef.current.focus();

		function handleInputsBlur(e) {
			removeErrorSpecialInput(e);
		}

		specialInput.addEventListener('blur', handleInputsBlur);
	}, []);

	function addErrorInput() {
		const nameInput = document.querySelector('.special--input');
		const nameSpan = document.querySelector('.special--input--span');
		const errorLabel = document.querySelector('.error--label');

		nameInput.style.setProperty('--borderColor', 'rgb(220 38 38 / 1)');
		nameInput.style.setProperty('--normalBorderColor', 'rgb(220 38 38 / 1)');
		nameInput.style.setProperty('--hoverColor', 'rgb(153 27 27)');
		nameInput.style.setProperty('--focusBorderColor', 'rgb(220 38 38 / 1)');

		nameSpan.style.setProperty('--fontColor', 'rgb(220 38 38 / 1)');
		nameSpan.style.setProperty('--normalFontColor', 'rgb(220 38 38 / 1)');
		nameSpan.style.setProperty('--hoverColor', 'rgb(153 27 27)');

		errorLabel.classList.add('active');
	}

	function handleChange(e) {
		const name = e.target.name;
		const value = e.target.value;

		setFormData((prevFormData) => {
			return {
				...prevFormData,
				[name]: value,
			};
		});
	}
	const { emailExists } = useAuth();
	function nextPage() {
		if (!formData.email) {
			setError('Enter an email or phone number');
			addErrorInput();
			return;
		}
		if (!validator.validate(formData.email)) {
			setError('Enter a valid email or phone number');
			addErrorInput();
			return;
		}
		emailExists(formData.email).then((size) => {
			if (!size) {
				//if the account with given email does not exist
				setError("Couldn't find your account");
				addErrorInput();
				return;
			} else {
				localStorage.setItem('login__email', formData.email);
				navigate('/signin');
			}
		});
	}

	function createAccountClick() {
		navigate('/register');
	}

	function keyPressed(e) {
		if (e.key === 'Enter') {
			nextPage();
		}
	}

	return (
		<>
			<div className="rounded-lg login--container border-[#dadce0]">
				<div className="px-5 pt-12 pb-20">
					<div id="swup" className="transition-slide">
						<div className="flex w-full justify-center items-center">
							<AppLogo></AppLogo>
						</div>
						<main>
							<div className="text-center mt-4 flex flex-col">
								<h1 className="text-2xl">Sign in</h1>
								<span className="mt-4 text-md text-[#202124]">Use your Form Generator account</span>
							</div>
							<div className="mt-10 flex px-5">
								<div className=" h-[56px] relative mx-auto flex-grow flex-shrink min-w-[0%]">
									<input
										type="text"
										onChange={handleChange}
										className="special--input"
										onKeyDown={keyPressed}
										name="email"
										ref={inputRef}
										required></input>
									<span className="special--input--span max-w-[75%] not--capitalize">Email or phone</span>
								</div>
							</div>

							<div className="text-xs pl-[17px] flex gap-2 mt-1 text-red-600 error--label pointer-events-none">
								<svg fill="currentColor" focusable="false" width="16px" height="16px" viewBox="0 0 24 24">
									<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
								</svg>
								{error}
							</div>

							<div className="w-full mt-2 px-5">
								<button className="text-google-blue font-medium text-[14px] tracking-[.25px] active:bg-blue-100">
									Forgot email?
								</button>
							</div>
							<div className="flex mt-10 pr-5 pl-3 justify-between">
								<button
									onClick={createAccountClick}
									className=" text-google-blue text-sm font-medium hover:text-blue-700 hover:bg-blue-50 px-2 py-2">
									Create account
								</button>
								<button
									onClick={nextPage}
									className="save--button px-6 rounded-[4px] text-[.875rem] font-medium tracking-[.0107142857em] py-2">
									Next
								</button>
							</div>
						</main>
					</div>
				</div>
			</div>
		</>
	);
}
