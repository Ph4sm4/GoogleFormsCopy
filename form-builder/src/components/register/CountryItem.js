import React from 'react';

export default function CountryItem(props) {
	const setActive = props.setActive;
	const isActive = props.active;
	const phoneNumberRef = props.phoneNumberRef;
	const [displayImage, setDisplayImage] = props.imageState;

	const [phoneNumber, setPhoneNumber] = props.phoneState;

	function handleClick() {
		document.getElementById('specialSelectBox').classList.remove('active');
		document.querySelector('.arrow--holder').classList.remove('focused');
		document.querySelector('.arrow--holder').classList.remove('active');
		document.querySelector('.options--container').classList.remove('active');
		setDisplayImage(props.image);
		const areaCode = props.value;
		const activeAreaCode = window.activeCountryInfo.value;
		let content;

		if (
			window.activeCountryInfo.country !== window.usersCountry.country &&
			phoneNumberRef.current.value.indexOf(activeAreaCode) !== -1
		) {
			content = phoneNumberRef.current.value.substr(activeAreaCode.length, phoneNumberRef.current.value.length);
		} else {
			content = phoneNumberRef.current.value;
		}

		if (window.usersCountry.country !== props.country) {
			setPhoneNumber(areaCode + ' ' + content.trim());
			phoneNumberRef.current.value = areaCode + ' ' + content.trim();
		} else {
			setPhoneNumber(content.trim());
			phoneNumberRef.current.value = content.trim();
		}
		setActive(props.country);
	}

	return (
		<>
			<li
				className={`country--option ${
					(isActive && window.usersCountry.country !== props.country) || (isActive && props.top)
						? 'bg-blue-200'
						: 'hoverable'
				}`}
				onClick={handleClick}
				value={props.value}>
				<div className="flex flex-col">
					<div className={`flex country--option--content gap-4 items-center`}>
						<img src={props.image} className="w-[24px] h-[16px] object-fill"></img>
						<span className="text-[16px]">{props.text}</span>
					</div>
				</div>
			</li>
		</>
	);
}
