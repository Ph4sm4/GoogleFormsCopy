import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLogo from '../AppLogo';
import ShowPassword from '../ShowPassword';
import validator from 'email-validator';
import { useAuth } from '../../contexts/AuthContext';
import { useSetSigningUp, useSigningUp } from '../../contexts/ContextProvider';

export default function SignUp() {
	const [nameError, setNameError] = useState(null);
	const [emailError, setEmailError] = useState(null);
	const [passwordError, setPasswordError] = useState(null);
	const [passwordShown, setPasswordShown] = useState(false);
	const nameErrorRef = useRef();
	const emailErrorRef = useRef();
	const passwordRef = useRef();
	const confirmRef = useRef();
	const firstNameInputRef = useRef();
	const passwordInputRef = useRef();
	const lastNameInputRef = useRef();
	const emailInputRef = useRef();

	let firstNameValid = true;
	let lastNameValid = true;
	let emailValid = true;
	let passwordValid = true;
	let confirmValid = true;

	const { emailExists } = useAuth();

	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		firstName: window.firstNameRegistration || '',
		lastName: window.lastNameRegistration || '',
		email: window.emailRegistration || '',
		password: '',
		confirm: '',
	});

	function handleChange(e) {
		const name = e.target.name;
		const value = e.target.value;
		setFormData((prev) => {
			return {
				...prev,
				[name]: value,
			};
		});
	}
	const setSigningUp = useSetSigningUp();
	const signingUp = useSigningUp();

	useEffect(() => {
		firstNameInputRef.current.focus();
		firstNameInputRef.current.value = formData.firstName;
		lastNameInputRef.current.value = formData.lastName;
		emailInputRef.current.value = formData.email;
		setSigningUp(true);
	}, []);

	function checkCharactersEmail() {
		const email = formData.email;
		const dotsInRow = /\.{2,}/g;
		const notAllowed = /[^a-z0-9\.\@]/g;
		const startsWithWrong = /^[^a-z0-9]/;
		const endsWithWrong = /[^a-z0-9]$/;

		if (email.match(startsWithWrong)) {
			setEmailError('Sorry, the first character of your email must be an ascii letter (a-z) or number (0-9)');
			return false;
		}
		if (email.match(endsWithWrong)) {
			setEmailError('Sorry, the last character of your email must be an ascii letter (a-z) or number (0-9)');
			return false;
		}
		if (email.match(notAllowed)) {
			setEmailError('Sorry, only letters (a-z), numbers (0-9), and periods (.) are allowed');
			return false;
		}
		if (email.match(dotsInRow)) {
			setEmailError('Sorry, your email cannot contain consecutive periods (.)');
			return false;
		}
		return true;
	}

	async function nextPage() {
		firstNameValid = false;
		lastNameValid = false;
		emailValid = false;
		passwordValid = false;
		confirmValid = false;

		let emailExistsValue = 0;
		//name inputs errors
		if (!formData.firstName && !formData.lastName) {
			setNameError('Enter first and last names');
		} else if (!formData.firstName) {
			setNameError('Enter first name');
			lastNameValid = true;
		} else if (!formData.lastName) {
			setNameError('Enter last name');
			firstNameValid = true;
		} else {
			firstNameValid = true;
			lastNameValid = true;
		}

		//email input errors

		if (!formData.email) {
			setEmailError('Choose an email address');
		} else if (formData.email.indexOf('@') === -1) {
			setEmailError("Don't forget to include the '@'");
		} else if (formData.email.indexOf('@') === formData.email.length - 1) {
			setEmailError("Enter a domain name after the '@'");
		} else if (!checkCharactersEmail()) {
		} else if (!validator.validate(formData.email)) {
			setEmailError('This email address is not valid');
		} else {
			emailExistsValue = await emailExists(formData.email);

			if (emailExistsValue === 1) {
				emailValid = false;
				setEmailError('That email has already been taken. Try another');
			} else {
				setEmailError(null);
				emailValid = true;
			}
		}

		//password errors
		if (!formData.password) {
			setPasswordError('Enter a password');
			confirmValid = true;
		} else if (formData.password.length < 8) {
			setPasswordError('Use 8 characters or more for your password');
			formData.confirm = '';
			formData.password = '';
			confirmRef.current.value = '';
			passwordInputRef.current.value = '';
			confirmValid = true;
		} else if (formData.password.length > 100) {
			setPasswordError('Use 100 characters or fewer for your password');

			formData.confirm = '';
			formData.password = '';
			confirmRef.current.value = '';
			passwordInputRef.current.value = '';
			confirmValid = true;
		} else if (formData.password.startsWith(' ') || formData.password.endsWith(' ')) {
			setPasswordError("Your password can't start or end with a blank space");
			confirmValid = true;
		} else if (!checkNonAscii()) {
			confirmValid = true;
			setPasswordError('Only use letters, numbers, and common punctuation characters');
		} else {
			passwordValid = true;
			if (!formData.confirm) {
				setPasswordError('Confirm your password');
			} else if (formData.password !== formData.confirm) {
				setPasswordError("Those passwords didn't match. Try again");
				confirmRef.current.value = '';
				formData.confirm = '';
				confirmRef.current.focus();
			} else if (!validatePassword(formData.password)) {
				confirmValid = true;
				passwordValid = false;
				formData.confirm = '';
				formData.password = '';
				confirmRef.current.value = '';
				passwordInputRef.current.value = '';
				setPasswordError('Please choose a stronger password. Try a mix of letters, numbers, and symbols');
			} else {
				setPasswordError(null);
				confirmValid = true;
			}
		}

		setTimeout(() => {
			if (!firstNameValid || !lastNameValid) {
				nameErrorRef.current.classList.add('active');
			} else {
				setNameError(null);
			}

			if (!emailValid) {
				emailErrorRef.current.classList.add('active');
			} else {
				setEmailError(null);
			}

			if (!passwordValid || !confirmValid) {
				passwordRef.current.classList.add('active');
			} else {
				setPasswordError(null);
			}
		}, 50);

		setTimeout(() => {
			const nameInputs = document.querySelectorAll('.special--input--small');
			const nameSpans = document.querySelectorAll('.special--input--span--small');

			let firstInputFocused = false;

			nameInputs.forEach((nameInput) => {
				const name = nameInput.name;
				if (
					(name === 'firstName' && !firstNameValid) ||
					(name === 'lastName' && !lastNameValid) ||
					(name === 'email' && !emailValid) ||
					(name === 'password' && !passwordValid) ||
					(name === 'confirm' && !confirmValid)
				) {
					if (!firstInputFocused) {
						firstInputFocused = true;
						if (nameInput !== document.activeElement) {
							nameInput.focus();
						}
					}
					nameInput.style.setProperty('--borderColor', 'rgb(220 38 38 / 1)');
					nameInput.style.setProperty('--normalBorderColor', 'rgb(220 38 38 / 1)');
					nameInput.style.setProperty('--focusBorderColor', 'rgb(220 38 38 / 1)');
				} else {
					nameInput.style.setProperty('--borderColor', 'rgb(160, 162, 165)');
					nameInput.style.setProperty('--normalBorderColor', '#888c8f');
					nameInput.style.setProperty('--focusBorderColor', '#1a73e8');
				}
			});

			nameSpans.forEach((nameSpan) => {
				const name = nameSpan.getAttribute('name');
				if (
					(name === 'firstName' && !firstNameValid) ||
					(name === 'lastName' && !lastNameValid) ||
					(name === 'email' && !emailValid) ||
					(name === 'password' && !passwordValid) ||
					(name === 'confirm' && !confirmValid)
				) {
					nameSpan.style.setProperty('--fontColor', 'rgb(220 38 38 / 1)');
					nameSpan.style.setProperty('--normalFontColor', 'rgb(220 38 38 / 1)');
				} else {
					nameSpan.style.setProperty('--fontColor', '#1a73e8');
					nameSpan.style.setProperty('--normalFontColor', '#5f6368');
				}
			});
		}, 50);

		setTimeout(() => {
			if (firstNameValid && lastNameValid && emailValid && passwordValid && confirmValid) {
				window.firstNameRegistration = formData.firstName;
				window.lastNameRegistration = formData.lastName;
				window.emailRegistration = formData.email;
				window.passwordRegistration = formData.password;
				if (window.phoneNumberVerified) {
					navigate('/register-continue');
				} else {
					navigate('/verify-number');
				}
			}
		}, 50);
	}

	function checkNonAscii() {
		const pass = formData.password;
		let good = true;
		for (let i = 0; i < pass.length; i++) {
			if ((pass.charCodeAt(i) > 126) | (pass.charCodeAt(i) < 32)) {
				good = false;
			}
		}
		return good;
	}

	function validatePassword(pass) {
		const specialSigns = '!"#&%&\'()*+,./:;<=>?@[\\]^_`{|}~-';
		const digits = '0123456789';
		const lettersSmall = 'abcdefghijklmnoprstuwxyz';
		const lettersBig = 'ABCDEFGHIJKLMNOPRSTUWXYZ';

		let specialSignsFound = false;
		let digitsFound = false;
		let lettersSmallFound = false;
		let lettersBigFound = false;

		for (let i = 0; i < specialSigns.length; i++) {
			if (pass.indexOf(specialSigns[i]) !== -1) {
				specialSignsFound = true;
			}
		}
		for (let i = 0; i < digits.length; i++) {
			if (pass.indexOf(digits[i]) !== -1) {
				digitsFound = true;
			}
		}
		for (let i = 0; i < lettersSmall.length; i++) {
			if (pass.indexOf(lettersSmall[i]) !== -1) {
				lettersSmallFound = true;
			}
		}
		for (let i = 0; i < lettersBig.length; i++) {
			if (pass.indexOf(lettersBig[i]) !== -1) {
				lettersBigFound = true;
			}
		}
		if ((specialSignsFound || digitsFound) && (lettersSmallFound || lettersBigFound)) return true;
		else return false;
	}

	function signInInsteadClick() {
		window.firstNameRegistration = null;
		window.lastNameRegistration = null;
		window.emailRegistration = null;
		window.passwordRegistration = null;
		navigate('/identifier');
	}

	function keyPressed(e) {
		if (e.key === 'Enter') {
			nextPage();
		}
	}

	return (
		<>
			<div className="rounded-lg register--container border-[#dadce0]">
				<div className="px-10 pt-12 pb-9 flex gap-10">
					<div className="main--container">
						<div className="flex w-full justify-start mb-5 items-center">
							<AppLogo></AppLogo>
						</div>

						<div className="mt-4">
							<h1 className="text-[#202124] text-[24px]">Create your FG Account</h1>

							<div className="flex gap-2 pt-8 names--container">
								<div className="p-[1px] rounded-[5px]">
									<div className="w-[176px] h-[36px] relative input--container">
										<input
											type="text"
											onChange={handleChange}
											className="special--input--small"
											name="firstName"
											ref={firstNameInputRef}
											onKeyDown={keyPressed}
											required></input>
										<div className="special--input--span--small" name="firstName">
											First name
										</div>
									</div>
								</div>
								<div className="w-[176px] h-[36px] relative input--container">
									<input
										type="text"
										onChange={handleChange}
										className="special--input--small"
										name="lastName"
										onKeyDown={keyPressed}
										ref={lastNameInputRef}
										required></input>
									<div className="special--input--span--small" name="lastName">
										Last name
									</div>
								</div>
							</div>
							{nameError && (
								<div
									ref={nameErrorRef}
									className="text-xs flex gap-2 mt-1 text-red-600 error--label pointer-events-none">
									<svg fill="currentColor" focusable="false" width="16px" height="16px" viewBox="0 0 24 24">
										<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
									</svg>
									{nameError}
								</div>
							)}
						</div>

						<div className="w-full">
							<div className="flex flex-grow pt-7">
								<div className="w-full h-[36px] relative">
									<input
										type="text"
										onChange={handleChange}
										className="special--input--small"
										name="email"
										required
										onKeyDown={keyPressed}
										ref={emailInputRef}></input>
									<div className="special--input--span--small" name="email">
										Your email address
									</div>
								</div>
							</div>

							{emailError ? (
								<div
									ref={emailErrorRef}
									className="text-xs flex gap-2 mt-1 text-red-600 error--label pointer-events-none">
									<svg fill="currentColor" focusable="false" width="16px" height="16px" viewBox="0 0 24 24">
										<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
									</svg>
									{emailError}
								</div>
							) : (
								<p className="pl-2 text-xs pt-1 font-light text-[#5f6368] cursor-default pointer-events-none">
									You'll need to confirm that this email belongs to you.
								</p>
							)}
						</div>

						<div>
							<div className="mt-10 flex gap-1 password--holder">
								<div className="p-[1px] rounded-[5px] flex-grow">
									<div className="w-[173px] h-[36px] relative input--container">
										<input
											type={passwordShown ? 'text' : 'password'}
											onChange={handleChange}
											className="special--input--small password--part"
											name="password"
											ref={passwordInputRef}
											onKeyDown={keyPressed}
											required></input>
										<div className="special--input--span--small password--span--part" name="password">
											Password
										</div>
									</div>
								</div>
								<div className="p-[1px] rounded-[5px] flex-grow">
									<div className="w-[173px] h-[36px] relative input--container">
										<input
											type={passwordShown ? 'text' : 'password'}
											onChange={handleChange}
											className="special--input--small password--part"
											name="confirm"
											ref={confirmRef}
											onKeyDown={keyPressed}
											required></input>
										<div className="special--input--span--small password--span--part" name="confirm">
											Confirm
										</div>
									</div>
								</div>
							</div>
							{passwordError ? (
								<div
									ref={passwordRef}
									className="text-xs mb-3 flex gap-2 mt-1 text-red-600 error--label pointer-events-none">
									<svg fill="currentColor" focusable="false" width="16px" height="16px" viewBox="0 0 24 24">
										<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
									</svg>
									{passwordError}
								</div>
							) : (
								<p className="text-xs pt-1 pl-2 tracking-wide font-light text-[#5f6368]">
									Use 8 or more characters with a mix of letters, numbers & symbols
								</p>
							)}
						</div>
						<div className="pt-1">
							<ShowPassword
								error={passwordError}
								passwordShown={passwordShown}
								setPasswordShown={setPasswordShown}
							/>
						</div>

						<div className="flex mt-10 justify-between">
							<button
								onClick={signInInsteadClick}
								className=" text-google-blue text-sm font-medium hover:text-blue-700 hover:bg-blue-50 px-2 py-2">
								Sign in instead
							</button>
							<button
								onClick={nextPage}
								className="save--button px-6 rounded-[4px] text-[.875rem] font-medium tracking-[.0107142857em] py-2">
								Next
							</button>
						</div>
					</div>
					<div className="flex-grow register--image">
						<div className="w-full h-full flex justify-center items-center">
							<img
								src="https://ssl.gstatic.com/accounts/signup/glif/account.svg"
								alt=""
								width="244"
								height="244"
								className=" mb-20"></img>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
