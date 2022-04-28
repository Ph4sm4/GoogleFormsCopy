import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import rippleTrigger from '../../functions/rippleTrigger';
import { useAuth } from './../../contexts/AuthContext';

import ShowPassword from '../ShowPassword';
import AppLogo from '../AppLogo';

export default function SignIn() {
	const [formData, setFormData] = useState({
		email: localStorage.getItem('login__email'),
		password: '',
	});

	const [passwordShown, setPasswordShown] = useState(false);

	const passwordInputRef = useRef();

	const navigate = useNavigate();

	const [error, setError] = useState('');
	const { login } = useAuth();

	useEffect(() => {
		passwordInputRef.current.focus();
	}, []);

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

	function addErrorClasses() {
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

	function nextPage() {
		if (!formData.password) {
			setError('Enter a password');

			setTimeout(() => {
				addErrorClasses();
			}, 10);

			return;
		}
		let errorOccured = false;
		console.table(formData);
		login(formData.email, formData.password).catch(function (error) {
			var errorCode = error.code;
			//var errorMessage = error.message;
			if (errorCode === 'auth/wrong-password') {
				setError('Wrong password. Try again or click Forgot password to reset it.');
				addErrorClasses();
				errorOccured = true;
				return;
			}
		});
		setTimeout(() => {
			if (!errorOccured) navigate('/');
		}, 1000);
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
								<h1 className="text-2xl">Hi {}</h1>
								<div className="flex justify-center">
									<button className="rounded-xl text-sm border border-[#dadce0] w-[50%]">
										Your email here
									</button>
								</div>
							</div>
							<div className="mt-10 flex px-5">
								<div className=" h-[56px] relative mx-auto flex-grow flex-shrink min-w-[0%]">
									<input
										type={passwordShown ? 'text' : 'password'}
										onChange={handleChange}
										className="special--input"
										onKeyDown={keyPressed}
										ref={passwordInputRef}
										name="password"
										required></input>
									<span className="special--input--span max-w-[75%] not--capitalize">Enter your password</span>
								</div>
							</div>

							{error && (
								<div className="text-xs pl-[17px] mb-3 flex gap-2 mt-1 text-red-600 error--label pointer-events-none">
									<svg fill="currentColor" focusable="false" width="16px" height="16px" viewBox="0 0 24 24">
										<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
									</svg>
									{error}
								</div>
							)}
							<div className="mx-5">
								<ShowPassword error={error} passwordShown={passwordShown} setPasswordShown={setPasswordShown} />
							</div>

							<div className="flex mt-10 pr-5 pl-3 justify-between">
								<button className=" text-google-blue text-sm font-medium hover:text-blue-700 hover:bg-blue-50 px-2 py-2">
									Forgot password?
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
