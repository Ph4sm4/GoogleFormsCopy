import React, { useEffect, useRef, useState } from 'react';
import { useSetUser, useUser } from '../../contexts/ContextProvider';
import { doc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import rippleTrigger from '../../functions/rippleTrigger';
import removeErrorSpecialInput from '../../functions/removeErrorSpecialInput';

export default function UpdateBirthday() {
	const monthsRef = useRef();
	const daysRef = useRef();
	const yearsRef = useRef();
	const specialSelectBox = useRef();

	const user = useUser();
	const setUser = useSetUser();

	const birthdateUser = new Date(user.birthdate.seconds * 1000).toLocaleDateString();
	let [day, month, year] = birthdateUser.split('/');
	month--; //since january here is gonna be 1 but in new Date() january is 0

	const [formData, setFormData] = useState({
		month: parseInt(month),
		year: year,
		day: day,
	});

	const [error, setError] = useState('');

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
	const [selectTextContent, setSelectTextContent] = useState(months[parseInt(formData.month)]);

	useEffect(() => {
		daysRef.current.value = formData.day;
		yearsRef.current.value = formData.year;

		let cancelButton = document.querySelector('.cancel--button');
		let saveButton = document.querySelector('.save--button');

		const specialInputs = document.querySelectorAll('.special--input');

		function handleInputsBlur(e) {
			removeErrorSpecialInput(e);
		}

		specialInputs.forEach((specialInput) => {
			specialInput.addEventListener('blur', handleInputsBlur);
		}); //when we blur an input we wanna delete error classes from that input

		cancelButton.addEventListener('click', (e) => rippleTrigger(e, 1000, cancelButton));

		saveButton.addEventListener('click', (e) => rippleTrigger(e, 1000, saveButton));
		saveButton.disabled = true;

		function handleOutside(e) {
			if (specialSelectBox.current && !specialSelectBox.current.contains(e.target)) {
				specialSelectBox.current.classList.remove('active');
				document.querySelector('.arrow--holder').classList.remove('focused');
				document.querySelector('.arrow--holder').classList.remove('active');
				document.querySelector('.options--container').classList.remove('active');
			}
		}
		document.addEventListener('click', handleOutside);

		const overlay = document.getElementById('overlay');
		function handleOverlay() {
			document.querySelector('.modal').classList.remove('active');
			overlay.classList.remove('active');
		}
		overlay.addEventListener('click', handleOverlay);

		return () => {
			cancelButton.removeEventListener('click', (e) => rippleTrigger(e, 1000, cancelButton));
			saveButton.removeEventListener('click', (e) => rippleTrigger(e, 1000, saveButton));
			document.removeEventListener('click', handleOutside);
			overlay.removeEventListener('click', handleOverlay);
		};
	}, []);
	//TODO CHANGE THE ANIMATION WHEN SELECT CLICKED

	useEffect(() => {
		if (!validateDate() || isNaN(formData.day) || isNaN(formData.year)) {
			addErrorClasses();
			return;
		}
	}, [formData]);

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

		setError('');
	}

	function removeErrorLabel() {
		const errorLabel = document.querySelector('.error--label');
		errorLabel.classList.remove('active');
	}

	function handleOptionClick(e) {
		handleChange(e);
		setSelectTextContent(e.target.textContent);
		document.querySelector('.options--container').classList.remove('active');
		document.querySelector('.arrow--holder').classList.remove('focused');
		document.querySelector('.arrow--holder').classList.remove('active');
	}

	function handleSelectClick() {
		document.querySelector('.arrow--holder').classList.add('focused');
		document.querySelector('.arrow--holder').classList.toggle('active');
		document.querySelector('.options--container').classList.toggle('active');
	}

	function handleCancel() {
		setTimeout(() => {
			window.history.go(-1);
		}, 300);
	}

	function addErrorClasses() {
		const nameInputs = document.querySelectorAll('.special--input');
		const nameSpans = document.querySelectorAll('.special--input--span');
		const errorLabel = document.querySelector('.error--label');
		const specialSelect = document.querySelector('.special--select');
		const arrowHolder = document.querySelector('.arrow--holder');

		arrowHolder.style.setProperty('--hoverColor', 'rgb(153 27 27)');
		arrowHolder.style.setProperty('--focusBorderColor', 'rgb(220 38 38 / 1)');
		arrowHolder.style.setProperty('--normalBorderColor', 'rgb(220 38 38 / 1)');

		specialSelect.style.setProperty('--borderColor', 'rgb(220 38 38 / 1)');
		specialSelect.style.setProperty('--normalBorderColor', 'rgb(220 38 38 / 1)');
		specialSelect.style.setProperty('--hoverColor', 'rgb(153 27 27)');
		specialSelect.style.setProperty('--focusBorderColor', 'rgb(220 38 38 / 1)');

		nameInputs.forEach((nameInput) => {
			nameInput.style.setProperty('--borderColor', 'rgb(220 38 38 / 1)');
			nameInput.style.setProperty('--normalBorderColor', 'rgb(220 38 38 / 1)');
			nameInput.style.setProperty('--hoverColor', 'rgb(153 27 27)');
			nameInput.style.setProperty('--focusBorderColor', 'rgb(220 38 38 / 1)');
		});

		nameSpans.forEach((nameSpan) => {
			nameSpan.style.setProperty('--fontColor', 'rgb(220 38 38 / 1)');
			nameSpan.style.setProperty('--normalFontColor', 'rgb(220 38 38 / 1)');
			nameSpan.style.setProperty('--hoverColor', 'rgb(153 27 27)');
		});

		errorLabel.classList.add('active');
	}

	function validateDate() {
		const saveButton = document.querySelector('.save--button');
		saveButton.disabled = true;

		const newYear = parseInt(formData.year);
		let newMonth = parseInt(formData.month);
		const newDay = parseInt(formData.day);
		const currentDate = new Date();

		if (!formData.day || formData.month === -1 || !formData.year) {
			setError('Please fill in a complete birthday.');
			return false;
		}

		if (newYear < 0 || newMonth < 0 || newDay < 0) {
			setError('Enter a valid birthday.');
			return false;
		}

		if (newYear.toString().length > 4 || newYear.toString().length < 4) {
			setError('Please enter a four digit year.');

			return false;
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
			setError('Enter a valid birthday.');
			return false;
		}

		let isLeap;

		if ((newYear % 4 === 0 && newYear % 100 !== 0) || newYear % 400 === 0) isLeap = true;
		else isLeap = false;

		if (isLeap) {
			//february
			if (newMonth === 1 && newDay > 29) {
				setError('Enter a valid birthday.');
				return false;
			}
		} else {
			if (newMonth === 1 && newDay > 28) {
				setError('Enter a valid birthday.');
				return false;
			}
			if (newMonth > 6) newMonth -= 7;

			if (newMonth % 2 === 0 && newDay > 31) {
				setError('Enter a valid birthday.');
				return false;
			} else if (newMonth % 2 !== 0 && newDay > 30) {
				setError('Enter a valid birthday.');
				return false;
			}
		}
		const nameInputs = document.querySelectorAll('.special--input');
		const nameSpans = document.querySelectorAll('.special--input--span');
		const errorLabel = document.querySelector('.error--label');
		const specialSelect = document.querySelector('.special--select');
		const arrowHolder = document.querySelector('.arrow--holder');

		specialSelect.style.setProperty('--borderColor', '#1a73e8');
		specialSelect.style.setProperty('--normalBorderColor', '#888c8f');
		specialSelect.style.setProperty('--hoverColor', '#161616');
		specialSelect.style.setProperty('--focusBorderColor', '#1a73e8');

		arrowHolder.style.setProperty('--hoverColor', '#161616');
		arrowHolder.style.setProperty('--focusBorderColor', '#1a73e8');
		arrowHolder.style.setProperty('--normalBorderColor', '#888c8f');

		nameInputs.forEach((nameInput) => {
			nameInput.style.setProperty('--borderColor', '#1a73e8');
			nameInput.style.setProperty('--normalBorderColor', '#888c8f');
			nameInput.style.setProperty('--hoverColor', '#161616');
			nameInput.style.setProperty('--focusBorderColor', '#1a73e8');
		});

		nameSpans.forEach((nameSpan) => {
			nameSpan.style.setProperty('--fontColor', '#1a73e8');
			nameSpan.style.setProperty('--normalFontColor', '#5f6368');
			nameSpan.style.setProperty('--hoverColor', '#161616');
		}); //if new date passed all the checks we delete all error classes

		if (
			parseInt(formData.day) !== parseInt(day) ||
			parseInt(formData.month) !== parseInt(month) ||
			parseInt(formData.year) !== parseInt(year)
		) {
			saveButton.disabled = false; //we also want to enable the save button
		}

		return true;
	}

	const navigate = useNavigate();

	function handleSave() {
		if (!formData.day || formData.month === -1 || !formData.year) {
			setError('Please fill in a complete birthday.');
			addErrorClasses();
			return;
		}

		if (!validateDate() || isNaN(formData.day) || isNaN(formData.year)) {
			addErrorClasses();
			return;
		}

		document.querySelector('.modal').classList.add('active');
		document.getElementById('overlay').classList.add('active');
	}

	function handleCancelModal() {
		document.querySelector('.modal').classList.remove('active');
		document.getElementById('overlay').classList.remove('active');
	}

	function handleConfirmModal() {
		const docRef = doc(db, 'users', user.id);
		const date = new Date(formData.year, formData.month, formData.day, 0, 0, 0, 0);
		const newBirthdate = Timestamp.fromDate(date);

		updateDoc(docRef, {
			birthdate: newBirthdate,
		}).then(async () => {
			const newUser = await getDoc(docRef);
			setUser({
				...newUser.data(),
			});
			navigate('/manage-account');
		});
	}

	function getAge() {
		let today = new Date();
		let age = today.getUTCFullYear() - formData.year;

		let m = today.getUTCMonth() - formData.month;

		if (m < 0 || (m === 0 && today.getUTCDate() < formData.day)) {
			age--;
		}

		return age;
	}

	return (
		<>
			<div className="modal bg-white flex flex-col ">
				<div className="modal--header pb-3 pt-6 px-[24px]">
					<div className="title font-[500] text-[1rem] tracking-[.00625em] text-[#3c4043]">Confirm birthday</div>
				</div>
				<div className="modal--body px-[24px] tracking-[.0142857143em] text-[.875rem] leading-[1.25rem] text-[#5f6368]">
					You're {getAge()} years old. Is that correct?
				</div>
				<div className="modal--footer flex justify-end pt-[30px] pr-2">
					<button
						onClick={handleCancelModal}
						className="text-[#1a73e8] rounded px-[10px] py-[7px] font-medium text-sm hover:bg-blue-50 overflow-hidden">
						Cancel
					</button>
					<button
						onClick={handleConfirmModal}
						className="text-[#1a73e8] rounded px-[10px] py-[7px] font-medium text-sm hover:bg-blue-50 overflow-hidden">
						Confirm
					</button>
				</div>
			</div>

			<div id="overlay"></div>

			<div className="flex flex-col gap-8 text-[#5f6368] text-base mt-8 max-w-xl">
				<h1 className="birthday--desc">
					Changes to your birth date will be reflected across your account. If this account is for a business or
					organization, use the birthday of the person who manages the account.
				</h1>
				<div className="flex pl-[24px] flex-col w-auto sm:border border-[#dadce0] rounded-lg py-3 gap-6">
					<h1 className="text-[.6875rem] font-medium tracking-[.07272727em] uppercase">update birthday</h1>
					<div className="flex flex-col gap-10 mb-6 margin--birthday sm:mr-36">
						<div className="flex flex-col">
							<div className="inputs--holder--birthday">
								<div className="select--div">
									<div className="relative arrow--holder">
										<div className="h-[56px]" ref={specialSelectBox}>
											<button
												type="button"
												className="special--select"
												ref={monthsRef}
												onClick={handleSelectClick}>
												<p className="truncate max-w-[60%]">{selectTextContent}</p>
											</button>
											<span className="special--input--span">Month</span>
											<div className="options--container flex flex-col py-2">
												<button
													className="option"
													name="month"
													value="-1"
													onClick={handleOptionClick}></button>
												<button className="option" name="month" value="0" onClick={handleOptionClick}>
													January
												</button>
												<button className="option" name="month" onClick={handleOptionClick} value="1">
													February
												</button>
												<button className="option" name="month" onClick={handleOptionClick} value="2">
													March
												</button>
												<button className="option" name="month" onClick={handleOptionClick} value="3">
													April
												</button>
												<button className="option" name="month" onClick={handleOptionClick} value="4">
													May
												</button>
												<button className="option" name="month" onClick={handleOptionClick} value="5">
													June
												</button>
												<button className="option" name="month" onClick={handleOptionClick} value="6">
													July
												</button>
												<button className="option" name="month" onClick={handleOptionClick} value="7">
													August
												</button>
												<button className="option" name="month" onClick={handleOptionClick} value="8">
													September
												</button>
												<button className="option" name="month" onClick={handleOptionClick} value="9">
													October
												</button>
												<button className="option" name="month" onClick={handleOptionClick} value="10">
													November
												</button>
												<button className="option" name="month" onClick={handleOptionClick} value="11">
													December
												</button>
											</div>
										</div>
									</div>
								</div>

								<div className="day--div h-[56px] relative">
									<input
										type="text"
										onChange={handleChange}
										ref={daysRef}
										className="special--input day--input"
										name="day"
										placeholder="DD"
										required></input>
									<span className="special--input--span">Day</span>
								</div>
								<div className="month--div h-[56px] relative">
									<input
										type="text"
										onChange={handleChange}
										ref={yearsRef}
										className="special--input year--input"
										name="year"
										placeholder="YYYY"
										required></input>
									<span className="special--input--span">Year</span>
								</div>
							</div>
							<label className="text-sm text-red-600 error--label min-h-[20px] pointer-events-none">
								{error}
							</label>
						</div>
						<div className="flex justify-end gap-2">
							<button
								onClick={handleCancel}
								className="text-[#1a73e8] rounded px-[20px] py-[7px] font-medium text-sm hover:bg-blue-50 cancel--button relative overflow-hidden">
								Cancel
							</button>
							<button
								onClick={handleSave}
								className="rounded px-[20px] py-[7px] font-medium text-sm save--button relative overflow-hidden">
								Save
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
