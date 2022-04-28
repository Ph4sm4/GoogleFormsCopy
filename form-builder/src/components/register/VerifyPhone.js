import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLogo from '../AppLogo';
import CountrySelect from './CountrySelect';
import countries from './countries';

export default function VerifyPhone() {
	const [phoneNumber, setPhoneNumber] = useState('');

	const [error, setError] = useState(null);
	const [inputsValid, setInputsValid] = useState(false);
	const [activeCountry, setActiveCountry] = useState(null);

	const [usersCountry, setUsersCountry] = useState(null);

	const phoneNumberRef = useRef();

	const [displayImage, setDisplayImage] = useState(window.initialDisplayImage);

	const navigate = useNavigate();

	useEffect(async () => {
		phoneNumberRef.current.focus();

		await fetch('http://ip-api.com/json/')
			.then((response) => response.json())
			.then((data) => {
				const userscountry = data.country;
				setUsersCountry(userscountry);

				if (!displayImage) {
					setActiveCountry(userscountry); //first load of the page
				} else {
					setActiveCountry(window.usersCountry.country); //when we click back on the code validation page
					//we wanna set the country flag and the content of the input as it were previously
					//and so we wanna set active country name to the country that was previously active
				}
			})
			.catch((error) => console.log(error));
	}, []);

	async function validateInputs() {
		let valid = true;

		if (!phoneNumber) {
			setError('Please enter a phone number');
			valid = false;
		}

		for (let i = 1; i < phoneNumber.length; i++) {
			if (isNaN(phoneNumber[i]) && phoneNumber[i] !== '-') {
				setError('This phone number format is not recognized. Please check the country and number');
				valid = false;
				break;
			}
		}
		if (valid) {
			const APIKEY = '26ACE3963AC54768B256FF8D175FBEFD';

			if (window.activeCountryInfo.country !== window.usersCountry.country) {
				window.wholePhoneNumberRegistration = phoneNumber;
			} else {
				window.wholePhoneNumberRegistration = window.activeCountryInfo.value + phoneNumber;
			}

			window.countryCode = window.activeCountryInfo.value;
			if (window.usersCountry.country !== window.activeCountryInfo.country) {
				window.phoneNumber = phoneNumber.substr(window.countryCode.length, phoneNumber.length);
			} else {
				window.phoneNumber = phoneNumber;
			}
			window.initialDisplayImage = window.activeCountryInfo.image;

			await fetch(`https://api.veriphone.io/v2/verify?phone=${window.phoneNumber}&key=${APIKEY}`)
				.then((response) => response.json())
				.then((data) => {
					if (!data.phone_valid) {
						setError('Please enter a valid phone number');

						valid = false;
					} else {
						if (window.prevPhoneNumberRegistration !== window.wholePhoneNumberRegistration) {
							window.phoneNumberVerified = false;
						}
						window.usersCountry = window.activeCountryInfo;

						window.prevPhoneNumberRegistration = window.wholePhoneNumberRegistration;
						window.phoneNumber = window.phoneNumber.replace(/[-]+/g, ' ').replace(/\s+/g, '');

						window.wholePhoneNumberRegistration = data.international_number;

						navigate('/code-verification');
					}
				});
		}

		setTimeout(() => {
			if (!valid) {
				document.querySelector('.error--label').classList.add('active');
				const nameInput = document.querySelector('.special--input--small');
				const nameSpan = document.querySelector('.special--input--span--small');

				nameInput.style.setProperty('--borderColor', 'rgb(220 38 38 / 1)');
				nameInput.style.setProperty('--normalBorderColor', 'rgb(220 38 38 / 1)');
				nameInput.style.setProperty('--focusBorderColor', 'rgb(220 38 38 / 1)');

				nameSpan.style.setProperty('--fontColor', 'rgb(220 38 38 / 1)');
				nameSpan.style.setProperty('--normalFontColor', 'rgb(220 38 38 / 1)');
			}
		}, 50);
	}

	function back() {
		navigate('/register');
	}

	async function nextClick() {
		validateInputs();
	}

	function handleChange(e) {
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
						setPhoneNumber(val.substr(code.length, val.length - 1).trim());

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

	function keyPressed(e) {
		if (e.key === 'Enter') {
			nextClick();
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
							<div className="flex mt-4 w-full">
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
										onChange={handleChange}
										onKeyDown={keyPressed}
										ref={phoneNumberRef}
										name="phoneNumber"></input>
									<div className="special--input--span--small not--capitalize">Phone number</div>
								</div>
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
									onClick={nextClick}
									id="submit--button"
									className="save--button px-6 rounded-[4px] text-[.875rem] font-medium tracking-[.0107142857em] py-2">
									Next
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
		</>
	);
}
