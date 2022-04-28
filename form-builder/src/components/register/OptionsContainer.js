import { useState, useEffect } from 'react';
import CountryItem from './CountryItem';
import countries from './countries';

export default function OptionsContainer(props) {
	const [activeCountry, setActiveCountry] = props.activeCountryState;

	const [displayImage, setDisplayImage] = props.imageState;
	const usersCountry = props.usersCountry;
	const [phoneNumber, setPhoneNumber] = props.phoneState;

	let rendered;

	let activeCountryInfo;

	if (activeCountry) {
		rendered = countries.map((country) => {
			activeCountryInfo = country;
			if (country.country === activeCountry) {
				window.activeCountryInfo = activeCountryInfo;
			}
			if (country.country === usersCountry && !displayImage) {
				window.usersCountry = activeCountryInfo; //global object that refers to info about the user's country
			}
			return (
				<CountryItem
					key={country.text}
					image={country.image}
					text={country.text}
					value={country.value}
					country={country.country}
					active={country.country === activeCountry}
					phoneNumberRef={props.phoneNumberRef}
					setActive={setActiveCountry}
					imageState={props.imageState}
					phoneState={[phoneNumber, setPhoneNumber]}
				/>
			);
		});
		if (!displayImage) {
			setDisplayImage(window.usersCountry.image);
		}
	}

	return (
		<>
			{activeCountry && window.usersCountry && (
				<div className="options--container countries flex flex-col py-2">
					<ul className="">
						<CountryItem
							image={window.usersCountry.image}
							text={window.usersCountry.text}
							value={window.usersCountry.value}
							country={window.usersCountry.country}
							active={window.usersCountry.country === activeCountry}
							top={true}
							phoneNumberRef={props.phoneNumberRef}
							setActive={setActiveCountry}
							phoneState={[phoneNumber, setPhoneNumber]}
							imageState={props.imageState}
						/>
						<li className="border-b border-b-[rgba(0,0,0, 0.12)] my-2"></li>
						{rendered}
					</ul>
				</div>
			)}
		</>
	);
}
