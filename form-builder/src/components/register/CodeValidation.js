import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLogo from '../AppLogo';
import { deleteUser, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../../firebase';

export default function CodeValidation() {
	const [error, setError] = useState(null);

	const [inputsValid, setInputsValid] = useState(true);
	const [verCode, setVerCode] = useState('');
	const navigate = useNavigate();

	function handleChange(e) {
		setVerCode(e.target.value);
	}
	function back() {
		navigate('/verify-number');
	}

	useEffect(() => {
		setTimeout(() => {
			window.recaptchaVerifier = new RecaptchaVerifier(
				'recaptcha--container',
				{
					size: 'invisible',
					callback: (response) => {
						// reCAPTCHA solved, allow signInWithPhoneNumber.
					},
				},
				auth
			);
			const wholePhone = window.wholePhoneNumberRegistration;

			let appVerifier = window.recaptchaVerifier;
			signInWithPhoneNumber(auth, wholePhone, appVerifier)
				.then((confirmationResult) => {
					window.confirmationResult = confirmationResult;
				})
				.catch((error) => {
					console.log(error);
				});
		}, 1000);
	}, []);

	function verifyClick() {
		let valid = true;
		if (verCode.match(/[^\d]/g)) {
			setError('Code has numbers only. Try again');
			valid = false;
		} else if (verCode.length !== 6) {
			setError('Wrong number of digits');
			valid = false;
		} else {
			let confirmationResult = window.confirmationResult;
			confirmationResult
				.confirm(verCode)
				.then((result) => {
					// User signed in successfully.
					const user = result.user;
					deleteUser(user).then(() => {
						window.phoneNumberVerified = true;
						navigate('/register-continue');
					});

					// ...
				})
				.catch((error) => {
					setError('Wrong code. Try again');
					valid = false;
				});
		}
		setTimeout(() => {
			if (!valid) {
				document.querySelector('.error--label').classList.add('active');
				const nameInputs = document.querySelectorAll('.special--input--small');
				const nameSpans = document.querySelectorAll('.special--input--span--small');

				nameInputs.forEach((nameInput) => {
					nameInput.style.setProperty('--borderColor', 'rgb(220 38 38 / 1)');
					nameInput.style.setProperty('--normalBorderColor', 'rgb(220 38 38 / 1)');
					nameInput.style.setProperty('--focusBorderColor', 'rgb(220 38 38 / 1)');
				});

				nameSpans.forEach((nameSpan) => {
					nameSpan.style.setProperty('--fontColor', 'rgb(220 38 38 / 1)');
					nameSpan.style.setProperty('--normalFontColor', 'rgb(220 38 38 / 1)');
				});
			}
		}, 50);
	}
	function keyPressed(e) {
		if (e.key === 'Enter') {
			verifyClick();
		}
	}
	return (
		<>
			<div className="rounded-lg register--container h-[514px] border-[#dadce0]">
				<div className="px-10 pt-12 pb-9 flex gap-10">
					<div className="main--container max-w-[362px]">
						<div className="flex w-full justify-start mb-5 items-center">
							<AppLogo></AppLogo>
						</div>

						<div className="mt-4">
							<h1 className="text-[#202124] text-[24px]">Verify your phone number</h1>
							<p className="text-sm mt-8 text-[#202124]">
								For your security, we want to make sure it's really you. Google will send a text message with a
								6-digit verification code. <em>Standard rates apply</em>
							</p>
							<div className="flex mt-1 gap-3">
								<img src={window.activeCountryInfo.image} className="w-[24px] h-[16px] object-fill"></img>
								<span className="text-[14px]">
									{window.wholePhoneNumberRegistration.substr(
										window.activeCountryInfo.value.length,
										window.wholePhoneNumberRegistration.length
									)}
								</span>
							</div>

							<div className="h-[36px] relative w-full mt-5">
								<input
									type="text"
									onChange={handleChange}
									className="special--input--small"
									name="phoneNumber"
									onKeyDown={keyPressed}
									required></input>
								<div className="special--input--span--small">Enter verification code</div>
							</div>
							{error && (
								<div className="text-xs flex gap-2 mt-1 text-red-600 error--label pointer-events-none">
									<svg fill="currentColor" focusable="false" width="16px" height="16px" viewBox="0 0 24 24">
										<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
									</svg>
									{error}
								</div>
							)}
							<div className="flex mt-10 justify-between">
								<button
									onClick={back}
									className=" text-google-blue text-sm font-medium hover:text-blue-700 hover:bg-blue-50 px-2 py-2">
									Back
								</button>
								<button
									onClick={verifyClick}
									className="save--button px-6 rounded-[4px] text-[.875rem] font-medium tracking-[.0107142857em] py-2">
									Verify
								</button>
							</div>
						</div>
					</div>
					<div className="flex-grow my-20 register--image">
						<div className="w-full h-full flex flex-col justify-center items-center">
							<img
								src="https://ssl.gstatic.com/accounts/signup/glif/personal.svg"
								alt=""
								width="244"
								height="244"></img>
							<p className=" font-light text-base">Your personal info is private & safe</p>
						</div>
					</div>
				</div>
			</div>
			<div id="recaptcha--container" className="absolute bottom-0"></div>
		</>
	);
}
