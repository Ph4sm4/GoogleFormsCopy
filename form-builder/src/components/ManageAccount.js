import React from 'react';
import { useUser } from '../contexts/ContextProvider';
import DefaultProfilePicture from '../images/default_profile.png';
import ManageAccountTemplates from './ManageAccountTemplates';
import { useNavigate } from 'react-router-dom';

export default function ManageAccount() {
	const user = useUser();
	const navigate = useNavigate();

	function handleChangePassword() {
		navigate('/update-password');
	}

	function handleDeleteAccount() {
		navigate('/delete-account');
	}

	function handleArrowBack() {
		document.querySelector('.back--arrow').classList.add('active');
		setTimeout(() => {
			navigate('/');
		}, 200);
	}

	function displayBirthdate() {
		const birthdateUser = new Date(user.birthdate.seconds * 1000).toLocaleDateString();
		const [day, month, year] = birthdateUser.split('/');
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
		const display_month = months[parseInt(month - 1)];
		return display_month + ' ' + day + ', ' + year;
	}

	return (
		<>
			<div className="h-auto py-[50px]">
				<div className="flex flex-col gap-10 max-w-[850px] w-auto mx-5 lg:mx-auto">
					<div className="flex items-center relative">
						<div className="rounded-full back--arrow w-[48px] h-[48px] flex justify-center items-center absolute">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 cursor-pointer"
								fill="none"
								viewBox="0 0 24 24"
								stroke="#161616"
								onClick={handleArrowBack}>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M10 19l-7-7m0 0l7-7m-7 7h18"
								/>
							</svg>
						</div>
						<div className="flex flex-col justify-self-center mx-auto">
							<h1 className="text-[1.75rem] text-center">Personal info</h1>
							<p className="personal--info--desc">Info about you and your preferences across our services</p>
						</div>
					</div>
					<div name="default info" className="w-auto rounded-lg h-auto border border-[#dadce0]">
						<div className="flex flex-col gap-4">
							<h1 className="pt-5 px-5 text-[1.375rem] text-special-gray leading-7">Basic info</h1>
							<div className="w-auto">
								<ManageAccountTemplates
									first={true}
									title="PHOTO"
									description="A photo helps personalize your account"
									navigate="/update-photo"
									id={1}
									idSpacer={11}
									lastItem={
										<div className="rounded-full overflow-hidden ml-auto">
											<img src={DefaultProfilePicture} className="h-[48px] w-[48px] p-1"></img>
										</div>
									}
								/>
								<ManageAccountTemplates
									first={false}
									title="NAME"
									description={user.firstName + ' ' + user.lastName}
									navigate="/update-name"
									id={2}
									idSpacer={22}
									lastItem={
										<div className="ml-auto">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-6 w-6"
												fill="none"
												viewBox="0 0 24 24"
												stroke="#161616">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 5l7 7-7 7"
												/>
											</svg>
										</div>
									}
								/>
								<ManageAccountTemplates
									first={false}
									title="BIRTHDAY"
									description={displayBirthdate()}
									navigate="/update-birthday"
									id={3}
									idSpacer={33}
									lastItem={
										<div className="ml-auto">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-6 w-6"
												fill="none"
												viewBox="0 0 24 24"
												stroke="#161616">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 5l7 7-7 7"
												/>
											</svg>
										</div>
									}
								/>
								<ManageAccountTemplates
									first={false}
									title="GENDER"
									description={user.gender}
									navigate="/update-gender"
									id={4}
									idSpacer={44}
									lastItem={
										<div className="ml-auto">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-6 w-6"
												fill="none"
												viewBox="0 0 24 24"
												stroke="#161616">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 5l7 7-7 7"
												/>
											</svg>
										</div>
									}
								/>
							</div>
						</div>
					</div>
					<div name="contact info" className="w-auto rounded-lg h-auto border border-[#dadce0]">
						<div className="flex flex-col gap-4">
							<h1 className="pt-5 px-5 text-[1.375rem] text-special-gray leading-7">Contact info</h1>
							<div className="w-auto">
								<ManageAccountTemplates
									first={true}
									title="EMAIL"
									description={user.email}
									navigate="/update-email"
									id={5}
									idSpacer={55}
									lastItem={
										<div className="ml-auto">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-6 w-6"
												fill="none"
												viewBox="0 0 24 24"
												stroke="#161616">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 5l7 7-7 7"
												/>
											</svg>
										</div>
									}
								/>
								<ManageAccountTemplates
									first={false}
									title="PHONE"
									description={user.phone}
									navigate="/update-phone"
									id={6}
									idSpacer={66}
									lastItem={
										<div className="ml-auto">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-6 w-6"
												fill="none"
												viewBox="0 0 24 24"
												stroke="#161616">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 5l7 7-7 7"
												/>
											</svg>
										</div>
									}
								/>
							</div>
						</div>
					</div>
					<div className="flex gap-7 manage--account--bottom">
						<div name="password" className="rounded-lg h-auto border border-[#dadce0]">
							<div className="flex flex-col">
								<div className="custom--basis">
									<div className="p-4">
										<h1 className="pt-5 px-5 text-[1.375rem] text-special-gray leading-7">Password</h1>
										<p className="pt-1 px-5 text-[#5f6368]">A secure password helps protect your account</p>
									</div>
									<div className="w-auto">
										<div
											className="flex justify-between items-center hover:bg-gray-100 cursor-pointer pr-3"
											onClick={handleChangePassword}>
											<div className="flex flex-col items-center password--manage--flex">
												<div className="password--manage">
													<p className="px-5">{'\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'}</p>
												</div>
												<div className="password--manage">
													<p className="text-[#5f6368] px-5 text-[.875rem] tracking-[.01428571em]">
														Last changed May 24, 2021
													</p>
												</div>
											</div>
											<div className="">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-6 w-6"
													fill="none"
													viewBox="0 0 24 24"
													stroke="#161616">
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M9 5l7 7-7 7"
													/>
												</svg>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div name="delete account" className="rounded-lg h-auto border border-[#dadce0]">
							<div className="flex flex-col">
								<div className="custom--basis">
									<div className="p-4">
										<h1 className="pt-5 px-5 text-[1.375rem] text-special-gray leading-7">Delete account</h1>
										<p className="pt-1 px-5 text-[#5f6368]">
											If you decide to, you can always delete your account
										</p>
									</div>
									<div className="w-auto mr-[24px]">
										<div className="flex justify-between items-center pr-3">
											<div className="px-4 py-3">
												<div className="px-5 flex items-center">
													<button className="bg-red-600 text-white px-5 py-3 rounded-3xl hover:bg-red-500 active:bg-red-800 ">
														Delete account
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

{
	/* 
</div>
<div className="w-auto px-4">

</div> */
}
