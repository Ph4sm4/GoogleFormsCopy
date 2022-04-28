import React, { useRef, useEffect, useState } from 'react';
import Poland from '../../images/pl-flag.gif';
import OptionsContainer from './OptionsContainer';

export default function CountrySelect(props) {
	const specialSelectBox = useRef();
	const [displayImage, setDisplayImage] = props.imageState;
	const [phoneNumber, setPhoneNumber] = props.phoneState;

	function handleSelectClick() {
		document.querySelector('.arrow--holder').classList.add('focused');
		document.querySelector('.arrow--holder').classList.toggle('active');
		document.querySelector('.options--container').classList.toggle('active');
	}

	useEffect(() => {
		function handleOutside(e) {
			if (specialSelectBox.current && !specialSelectBox.current.contains(e.target)) {
				specialSelectBox.current.classList.remove('active');
				document.querySelector('.arrow--holder').classList.remove('focused');
				document.querySelector('.arrow--holder').classList.remove('active');
				document.querySelector('.options--container').classList.remove('active');
			}
		}
		document.addEventListener('click', handleOutside);
	}, []);
	return (
		<>
			<div className="select--div verify--phone">
				<div className="relative arrow--holder smaller">
					<div className="h-[36px]" ref={specialSelectBox} id="specialSelectBox">
						<button
							type="button"
							className="special--select smaller flex items-center"
							onClick={handleSelectClick}>
							<img src={displayImage} className="h-[15px] w-[21px] ml-1 object-fill"></img>
						</button>
						<OptionsContainer
							imageState={[displayImage, setDisplayImage]}
							phoneNumberRef={props.phoneNumberRef}
							activeCountryState={props.activeCountryState}
							phoneState={[phoneNumber, setPhoneNumber]}
							usersCountry={props.usersCountry}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
