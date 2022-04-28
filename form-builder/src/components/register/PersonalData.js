import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLogo from '../AppLogo';
import DefaultProfile from '../DefaultProfile';
import CountrySelect from './CountrySelect';
import countries from './countries';
import validator from 'email-validator';

export default function PersonalData() {
	const [formData, setFormData] = useState({
		phoneNumber: window.phoneNumber.trim(),
		recoveryEmail: '',
		month: null,
		day: null,
		year: null,
		gender: '',
	});

	const [phoneNumberError, setPhoneNumberError] = useState(null);
	const [emailError, setEmailError] = useState(null);
	const [customGenderError, setCustomGenderError] = useState(null);
	const [birthdayError, setBirthdayError] = useState(null);
	const [genderError, setGenderError] = useState(null);

	const [inputsValid, setInputsValid] = useState(false);
	const [activeCountry, setActiveCountry] = useState(window.activeCountryInfo.country);

	const [monthSelectTextContent, setMonthSelectTextContent] = useState('');
	const [genderSelectTextContent, setGenderSelectTextContent] = useState('');

	const emailErrorRef = useRef();

	const [usersCountry, setUsersCountry] = useState(null);
	const [phoneNumber, setPhoneNumber] = useState(window.phoneNumber);

	const [isCustomGender, setIsCustomGender] = useState(false);

	const phoneNumberRef = useRef();

	const [displayImage, setDisplayImage] = useState(window.initialDisplayImage);

	const navigate = useNavigate();

	let phoneNumberValid = true;
	let recoveryEmailValid = true;
	let monthsValid = true;
	let yearsValid = true;
	let daysValid = true;
	let genderValid = true;
	let customGenderValid = true;

	const monthsRef = useRef();
	const daysRef = useRef();
	const yearsRef = useRef();
	const monthsSelectBox = useRef();
	const genderSelectBox = useRef();
	const birthdayErrorRef = useRef();
	const genderRef = useRef();
	const phoneNumberErrorRef = useRef();
	const recoveryEmailInputRef = useRef();
	const customGenderErrorRef = useRef();
	const genderErrorRef = useRef();

	useEffect(() => {
		phoneNumberRef.current.value = window.phoneNumber.trim();
		function handleOutsideMonth(e) {
			if (monthsSelectBox.current && !monthsSelectBox.current.contains(e.target)) {
				monthsSelectBox.current.classList.remove('active');
				document.querySelector('.arrow--month').classList.remove('focused');
				document.querySelector('.arrow--month').classList.remove('active');
				document.querySelector('.options--month').classList.remove('active');
			}
		}
		function handleOutsideGender(e) {
			if (genderSelectBox.current && !genderSelectBox.current.contains(e.target)) {
				genderSelectBox.current.classList.remove('active');
				document.querySelector('.arrow--gender').classList.remove('focused');
				document.querySelector('.arrow--gender').classList.remove('active');
				document.querySelector('.options--gender').classList.remove('active');
			}
		}
		document.addEventListener('click', handleOutsideGender);
		document.addEventListener('click', handleOutsideMonth);
	}, []);

	var months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	function handleChangeFlag(e) {
		const name = e.target.name;
		const value = e.target.value;

		let found = false;
		let set = false;
		if (value.indexOf('+') === 0) {
			for (let j = 4; j >= 2; j--) {
				for (let i = 0; i < countries.length; i++) {
					const code = value.substr(value.indexOf('+'), j);
					if (code === countries[i].value) {
						found = true;
						setActiveCountry(countries[i].country);
						window.activeCountryInfo = countries[i];
						setDisplayImage(countries[i].image);
					}
					if (code === window.usersCountry.value) {
						const val = phoneNumberRef.current.value;
						setPhoneNumber(val.substr(code.length, val.length).trim());

						set = true;
					}
					if (found) break;
				}
				if (found) break;
			}
			if (!set) setPhoneNumber(value);
		} else {
			setPhoneNumber(value);
		}
	}

	useEffect(() => {
		phoneNumberRef.current.value = phoneNumber;
	}, [phoneNumber]);

	function handleChange(e) {
		let value = e.target.value;

		if (!isNaN(value)) {
			value = parseInt(value);
		}

		setFormData((prev) => {
			return {
				...prev,
				[e.target.name]: value,
			};
		});
	}

	function handleGenderOptionClick(e) {
		if (e.target.value === 'custom') {
			formData.gender = '';
			setIsCustomGender(true);
		} else {
			handleChange(e);
			setIsCustomGender(false);
		}
		setGenderSelectTextContent(e.target.textContent);
		document.querySelector('.options--gender').classList.remove('active');
		document.querySelector('.arrow--gender').classList.remove('focused');
		document.querySelector('.arrow--gender').classList.remove('active');
	}

	function handleOptionClick(e) {
		handleChange(e);
		setMonthSelectTextContent(e.target.textContent);
		document.querySelector('.options--month').classList.remove('active');
		document.querySelector('.arrow--month').classList.remove('focused');
		document.querySelector('.arrow--month').classList.remove('active');
	}

	function handleGenderSelectClick() {
		document.querySelector('.arrow--gender').classList.add('focused');
		document.querySelector('.arrow--gender').classList.toggle('active');
		document.querySelector('.options--gender').classList.toggle('active');
	}

	function handleBirthdaySelectClick() {
		document.querySelector('.arrow--month').classList.add('focused');
		document.querySelector('.arrow--month').classList.toggle('active');
		document.querySelector('.options--month').classList.toggle('active');
	}

	useEffect(() => {
		setFormData((prev) => {
			return {
				...prev,
				phoneNumber: phoneNumber,
			};
		});
	}, [phoneNumber]);

	function back() {
		navigate('/register');
	}

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

	function validateDate() {
		const newYear = parseInt(formData.year);
		let newMonth = parseInt(formData.month);
		const newDay = parseInt(formData.day);
		const currentDate = new Date();
		daysValid = true;
		monthsValid = true;
		yearsValid = true;

		if (!formData.day || !formData.month || !formData.year) {
			setBirthdayError('Please fill in a complete birthday.');
			if (!formData.day) daysValid = false;
			if (!formData.month) monthsValid = false;
			if (!formData.year) yearsValid = false;
			return;
		}

		if (newYear < 0 || newMonth < 0 || newDay < 0) {
			setBirthdayError('Enter a valid birthday.');
			if (newYear < 0) yearsValid = false;
			if (newMonth < 0) monthsValid = false;
			if (newDay < 0) daysValid = false;
			return;
		}

		if (newYear.toString().length > 4 || newYear.toString().length < 4) {
			setBirthdayError('Please enter a four digit year.');
			yearsValid = false;
			return;
		}

		if (
			newYear < 1892 ||
			(newDay > currentDate.getUTCDate() &&
				newMonth >= currentDate.getUTCMonth() &&
				newYear >= currentDate.getUTCFullYear()) ||
			(newMonth > currentDate.getUTCMonth() && newYear >= currentDate.getUTCFullYear()) ||
			newYear > currentDate.getUTCFullYear() ||
			newDay > 31
		) {
			if (
				newDay > currentDate.getUTCDate() &&
				newMonth >= currentDate.getUTCMonth() &&
				newYear >= currentDate.getUTCFullYear()
			) {
				monthsValid = false;
				daysValid = false;
				yearsValid = false;
			} else if (newDay > 31) {
				daysValid = false;
			} else if (newMonth > currentDate.getUTCMonth() && newYear >= currentDate.getUTCFullYear()) {
				monthsValid = false;
				yearsValid = false;
			} else if (newYear > currentDate.getUTCFullYear() || newYear < 1892) {
				yearsValid = false;
			}

			setBirthdayError('Enter a valid birthday.');
			return;
		}

		let isLeap;

		if ((newYear % 4 === 0 && newYear % 100 !== 0) || newYear % 400 === 0) isLeap = true;
		else isLeap = false;

		if (isLeap) {
			//february
			if (newMonth === 1 && newDay > 29) {
				daysValid = false;
				monthsValid = false;
				setBirthdayError('Enter a valid birthday.');
				return;
			}
		} else {
			if (newMonth === 1 && newDay > 28) {
				daysValid = false;
				monthsValid = false;
				setBirthdayError('Enter a valid birthday.');
				return;
			}
			if (newMonth > 6) newMonth -= 7;

			if (newMonth % 2 === 0 && newDay > 31) {
				daysValid = false;
				monthsValid = false;
				setBirthdayError('Enter a valid birthday.');
				return;
			} else if (newMonth % 2 !== 0 && newDay > 30) {
				daysValid = false;
				monthsValid = false;
				setBirthdayError('Enter a valid birthday.');
				return;
			}
		}
	}

	async function nextClick() {
		phoneNumberValid = false;
		recoveryEmailValid = false;
		yearsValid = false;
		monthsValid = false;
		daysValid = false;
		genderValid = false;
		customGenderValid = false;
		//phone number is optional so we wanna validate it only if there is content in it
		if (formData.phoneNumber) {
			let valid = true;

			for (let i = 1; i < phoneNumber.length; i++) {
				if (isNaN(phoneNumber[i]) && phoneNumber[i] !== '-') {
					setPhoneNumberError('This phone number format is not recognized. Please check the country and number');
					valid = false;
					break;
				}
			}
			if (valid) {
				const APIKEY = '87C26B39CAC646B7A10E3D54A94007E7';

				await fetch(
					`https://api.veriphone.io/v2/verify?phone=${
						window.activeCountryInfo.value + formData.phoneNumber
					}&key=${APIKEY}`
				)
					.then((response) => response.json())
					.then((data) => {
						if (!data.phone_valid) {
							setPhoneNumberError('Please enter a valid phone number');

							valid = false;
						} else {
							window.usersPhoneNumber = formData.phoneNumber.replace(/[-]+/g, ' ');
							phoneNumberValid = true;
						}
					});
			}
		} else {
			phoneNumberValid = true;
		}
		//recovery email is optional so wanna validate it only if there is some content in the input
		if (formData.recoveryEmail) {
			if (formData.recoveryEmail.indexOf('@') === -1) {
				setEmailError("Don't forget to include the '@'");
			} else if (formData.recoveryEmail.indexOf('@') === formData.recoveryEmail.length - 1) {
				setEmailError("Enter a domain name after the '@'");
			} else if (!checkCharactersEmail()) {
			} else if (!validator.validate(formData.recoveryEmail)) {
				setEmailError('This email address is not valid');
			} else {
				recoveryEmailValid = true;
				setEmailError(null);
			}
		} else {
			recoveryEmailValid = true;
		}

		//date validation
		validateDate();

		//check if a gender has been filled in

		if (!formData.gender && !isCustomGender) {
			setGenderError('Please select a gender');
		} else {
			genderValid = true;
		}

		if (isCustomGender && !formData.gender) {
			setCustomGenderError('Please fill in your gender');
		} else {
			customGenderValid = true;
		}

		//activating the labels so that they actually show up
		setTimeout(() => {
			if (!phoneNumberValid) {
				phoneNumberErrorRef.current.classList.add('active');
			} else {
				setPhoneNumberError(null);
			}

			if (!recoveryEmailValid) {
				emailErrorRef.current.classList.add('active');
			} else {
				setEmailError(null);
			}

			if (!monthsValid || !daysValid || !yearsValid) {
				birthdayErrorRef.current.classList.add('active');
			} else {
				setBirthdayError(null);
			}
			if (!genderValid) {
				genderErrorRef.current.classList.add('active');
			} else {
				setGenderError(null);
			}
			if (!customGenderValid) {
				customGenderErrorRef.current.classList.add('active');
			} else {
				setCustomGenderError(null);
			}
		}, 50);

		setTimeout(() => {
			const specialInputs = document.querySelectorAll('.special--input--small');
			const inputSpans = document.querySelectorAll('.special--input--span--small');
			const specialSelects = document.querySelectorAll('.special--select');

			const arrowHolders = document.querySelectorAll('.select--arrow');

			let firstInputFocused = false;

			specialSelects.forEach((specialSelect) => {
				const name = specialSelect.getAttribute('name');

				if ((name === 'month' && !monthsValid) || (name === 'gender' && !genderValid)) {
					specialSelect.style.setProperty('--borderColor', 'rgb(220 38 38 / 1)');
					specialSelect.style.setProperty('--normalBorderColor', 'rgb(220 38 38 / 1)');
					specialSelect.style.setProperty('--hoverColor', 'rgb(153 27 27)');
					specialSelect.style.setProperty('--focusBorderColor', 'rgb(220 38 38 / 1)');
				} else {
					specialSelect.style.setProperty('--borderColor', '#1a73e8');
					specialSelect.style.setProperty('--normalBorderColor', '#888c8f');
					specialSelect.style.setProperty('--hoverColor', '#161616');
					specialSelect.style.setProperty('--focusBorderColor', '#1a73e8');
				}
			});

			arrowHolders.forEach((arrowHolder) => {
				const name = arrowHolder.getAttribute('name');

				if ((name === 'month' && !monthsValid) || (name === 'gender' && !genderValid)) {
					arrowHolder.style.setProperty('--hoverColor', 'rgb(153 27 27)');
					arrowHolder.style.setProperty('--focusBorderColor', 'rgb(220 38 38 / 1)');
					arrowHolder.style.setProperty('--normalBorderColor', 'rgb(220 38 38 / 1)');
				} else {
					arrowHolder.style.setProperty('--hoverColor', '#161616');
					arrowHolder.style.setProperty('--focusBorderColor', '#1a73e8');
					arrowHolder.style.setProperty('--normalBorderColor', '#888c8f');
				}
			});

			specialInputs.forEach((specialInput) => {
				const name = specialInput.getAttribute('name');
				if (
					(name === 'phoneNumber' && !phoneNumberValid) ||
					(name === 'recoveryEmail' && !recoveryEmailValid) ||
					(name === 'month' && !monthsValid) ||
					(name === 'year' && !yearsValid) ||
					(name === 'day' && !daysValid) ||
					(name === 'gender' && !genderValid) ||
					(name === 'gender' && !customGenderValid)
				) {
					if (!firstInputFocused) {
						firstInputFocused = true;
						if (specialInput !== document.activeElement) {
							specialInput.focus();
						}
					}
					specialInput.style.setProperty('--borderColor', 'rgb(220 38 38 / 1)');
					specialInput.style.setProperty('--normalBorderColor', 'rgb(220 38 38 / 1)');
					specialInput.style.setProperty('--focusBorderColor', 'rgb(220 38 38 / 1)');
				} else {
					specialInput.style.setProperty('--borderColor', 'rgb(160, 162, 165)');
					specialInput.style.setProperty('--normalBorderColor', '#888c8f');
					specialInput.style.setProperty('--focusBorderColor', '#1a73e8');
				}
			});

			inputSpans.forEach((inputSpan) => {
				const name = inputSpan.getAttribute('name');
				if (
					(name === 'phoneNumber' && !phoneNumberValid) ||
					(name === 'recoveryEmail' && !recoveryEmailValid) ||
					(name === 'month' && !monthsValid) ||
					(name === 'year' && !yearsValid) ||
					(name === 'day' && !daysValid) ||
					(name === 'gender' && !genderValid) ||
					(name === 'customGender' && !customGenderValid)
				) {
					inputSpan.style.setProperty('--fontColor', 'rgb(220 38 38 / 1)');
					inputSpan.style.setProperty('--normalFontColor', 'rgb(220 38 38 / 1)');
				} else {
					inputSpan.style.setProperty('--fontColor', '#1a73e8');
					inputSpan.style.setProperty('--normalFontColor', '#5f6368');
				}
			});
		}, 50);
	}

	function keyPressed(e) {
		if (e.key === 'Enter') {
			nextClick();
		}
	}

	return (
		<>
			<div className="rounded-lg personal--data--container max-w-[748px] h-[700px]">
				<div className="px-10 pt-12 pb-9 flex gap-10">
					<div className="main--container">
						<div className="flex w-full justify-start mb-5 items-center">
							<AppLogo></AppLogo>
						</div>

						<div className="mt-4">
							<h1 className="text-[#202124] text-[24px]">{window.firstNameRegistration}, welcome to FG</h1>
							<div className="flex items-center mt-2 gap-2">
								<div className="h-5 w-5">
									<DefaultProfile width="20px" height="20px" />
								</div>
								<span className="text-[#3c4043] text-[12px] font-medium tracking-[.25px] leading-[1.3333333]">
									{window.emailRegistration}
								</span>
							</div>
							<div className="flex mt-14 w-full">
								<div className="h-[36px] flex-grow relative">
									<CountrySelect
										phoneNumberRef={phoneNumberRef}
										imageState={[displayImage, setDisplayImage]}
										activeCountryState={[activeCountry, setActiveCountry]}
										phoneState={[phoneNumber, setPhoneNumber]}
										usersCountry={usersCountry}
									/>
								</div>
								<div className="h-[36px] w-full flex-grow relative">
									<input
										className="special--input--small min-h-[36px]"
										required
										onChange={handleChangeFlag}
										ref={phoneNumberRef}
										onKeyDown={keyPressed}
										name="phoneNumber"></input>
									<div className="special--input--span--small not--capitalize" name="phoneNumber">
										Phone number (optional)
									</div>
								</div>
							</div>
							{phoneNumberError && (
								<div
									className="text-xs flex gap-2 mt-1 text-red-600 error--label pointer-events-none"
									ref={phoneNumberErrorRef}>
									<svg fill="currentColor" focusable="false" width="16px" height="16px" viewBox="0 0 24 24">
										<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
									</svg>
									{phoneNumberError}
								</div>
							)}
							<p className="text-[#5f6368] text-[12px] pt-1 tracking-[0.0125em]">
								We will use this number only for account security. Your number won't be visible to others. You
								can choose later whether to use it for other purposes.
							</p>
							<div className="w-full">
								<div className="flex flex-grow pt-7">
									<div className="w-full h-[36px] relative">
										<input
											type="text"
											onChange={handleChange}
											className="special--input--small"
											name="recoveryEmail"
											ref={recoveryEmailInputRef}
											onKeyDown={keyPressed}
											required></input>
										<div className="special--input--span--small not--capitalize" name="recoveryEmail">
											Recovery email address (optional)
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
										We'll use it to keep your account secure
									</p>
								)}
							</div>
							<div className="inputs--holder--birthday smaller mt-5 justify-between">
								<div className="select--div space--evenly">
									<div className="relative arrow--month select--arrow smaller" name="month">
										<div className="h-[36px]" ref={monthsSelectBox}>
											<button
												type="button"
												className="special--select select--month"
												name="month"
												ref={monthsRef}
												onClick={handleBirthdaySelectClick}>
												{monthSelectTextContent && (
													<p className="truncate max-w-[90%]">{monthSelectTextContent}</p>
												)}
											</button>
											<span className="special--input--span--small birthdaySpan" name="month">
												Month
											</span>
											<div className="options--container options--month flex flex-col py-2">
												<button
													className="option text-left smaller"
													name="month"
													value="0"
													onClick={handleOptionClick}>
													January
												</button>
												<button
													className="option smaller"
													name="month"
													onClick={handleOptionClick}
													value="1">
													February
												</button>
												<button
													className="option smaller"
													name="month"
													onClick={handleOptionClick}
													value="2">
													March
												</button>
												<button
													className="option smaller"
													name="month"
													onClick={handleOptionClick}
													value="3">
													April
												</button>
												<button
													className="option smaller"
													name="month"
													onClick={handleOptionClick}
													value="4">
													May
												</button>
												<button
													className="option smaller"
													name="month"
													onClick={handleOptionClick}
													value="5">
													June
												</button>
												<button
													className="option smaller"
													name="month"
													onClick={handleOptionClick}
													value="6">
													July
												</button>
												<button
													className="option smaller"
													name="month"
													onClick={handleOptionClick}
													value="7">
													August
												</button>
												<button
													className="option smaller"
													name="month"
													onClick={handleOptionClick}
													value="8">
													September
												</button>
												<button
													className="option smaller"
													name="month"
													onClick={handleOptionClick}
													value="9">
													October
												</button>
												<button
													className="option smaller"
													name="month"
													onClick={handleOptionClick}
													value="10">
													November
												</button>
												<button
													className="option smaller"
													name="month"
													onClick={handleOptionClick}
													value="11">
													December
												</button>
											</div>
										</div>
									</div>
								</div>

								<div className="day--div h-[36px] relative space--evenly">
									<input
										type="text"
										onChange={handleChange}
										ref={daysRef}
										className="special--input--small day--input"
										name="day"
										placeholder="DD"
										onKeyDown={keyPressed}
										required></input>
									<span className="special--input--span--small birthdaySpan" name="day">
										Day
									</span>
								</div>
								<div className="month--div h-[36px] relative space--evenly">
									<input
										type="text"
										onChange={handleChange}
										ref={yearsRef}
										className="special--input--small year--input"
										name="year"
										placeholder="YYYY"
										onKeyDown={keyPressed}
										required></input>
									<span className="special--input--span--small birthdaySpan" name="year">
										Year
									</span>
								</div>
							</div>
							{birthdayError ? (
								<div
									ref={birthdayErrorRef}
									className="text-xs flex gap-2 mt-1 text-red-600 error--label pointer-events-none">
									<svg fill="currentColor" focusable="false" width="16px" height="16px" viewBox="0 0 24 24">
										<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
									</svg>
									{birthdayError}
								</div>
							) : (
								<label className="text-[12px] text-[#5f6368] min-h-[20px] pointer-events-none">
									Your birthday
								</label>
							)}
							<div className="gender--div mt-4">
								<div className="relative arrow--gender smaller select--arrow" name="gender">
									<div className="h-[36px]" ref={genderSelectBox}>
										<button
											type="button"
											className="special--select select--gender"
											name="gender"
											ref={genderRef}
											onClick={handleGenderSelectClick}>
											{genderSelectTextContent && (
												<p className="truncate max-w-[60%]">{genderSelectTextContent}</p>
											)}
										</button>
										<span className="special--input--span--small" name="gender">
											Gender
										</span>
										<div className="options--container options--gender flex flex-col py-2">
											<button
												className="option text-left smaller"
												name="gender"
												value="Male"
												onClick={handleGenderOptionClick}>
												Male
											</button>
											<button
												className="option smaller"
												name="gender"
												onClick={handleGenderOptionClick}
												value="Female">
												Female
											</button>
											<button
												className="option smaller"
												name="gender"
												onClick={handleGenderOptionClick}
												value="Rather not to say">
												Rather not to say
											</button>
											<button
												className="option smaller"
												name="gender"
												onClick={handleGenderOptionClick}
												value="custom">
												Custom
											</button>
										</div>
									</div>
								</div>
							</div>
							{genderError && (
								<div
									className="text-xs flex gap-2 mt-1 text-red-600 error--label pointer-events-none"
									ref={genderErrorRef}>
									<svg fill="currentColor" focusable="false" width="16px" height="16px" viewBox="0 0 24 24">
										<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
									</svg>
									{genderError}
								</div>
							)}
							{isCustomGender && (
								<div className="w-full">
									<div className="flex flex-grow pt-5">
										<div className="w-full h-[36px] relative">
											<input
												type="text"
												onChange={handleChange}
												className="special--input--small"
												name="gender"
												onKeyDown={keyPressed}
												required></input>
											<div className="special--input--span--small not--capitalize" name="customGender">
												What's your gender?
											</div>
										</div>
									</div>
								</div>
							)}
							{customGenderError && (
								<div
									className="text-xs flex gap-2 mt-1 text-red-600 error--label pointer-events-none"
									ref={customGenderErrorRef}>
									<svg fill="currentColor" focusable="false" width="16px" height="16px" viewBox="0 0 24 24">
										<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
									</svg>
									{customGenderError}
								</div>
							)}

							<div className="flex mt-10 justify-between">
								<button
									onClick={back}
									className=" text-google-blue text-sm font-medium hover:text-blue-700 hover:bg-blue-50 px-2 py-2">
									Back
								</button>
								<button
									onClick={nextClick}
									id="submit--button"
									className="save--button px-6 rounded-[4px] text-[.875rem] font-medium tracking-[.0107142857em] py-2">
									Next
								</button>
							</div>
						</div>
					</div>
					<div className="flex-grow my-20 register--image w-[300px]">
						<div className="w-full h-full flex flex-col justify-start items-center">
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
		</>
	);
}
