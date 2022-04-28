import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DefaultProfilePicture from '../images/default_profile.png';

export default function ProfileLookup(props) {
	const el = useRef();
	const origin = props.origin;
	const [popUp, setPopUp] = props.state;

	const user = props.user;
	const accounts = props.accounts;

	useEffect(() => {
		el.current.classList.add('active');
		function handleOutside(e) {
			if (el.current && !el.current.contains(e.target)) {
				el.current.classList.remove('active');
				document.querySelector('.profile--picture').classList.remove('active');
				setPopUp(false);
			}
		}

		document.addEventListener('click', handleOutside);

		return () => document.removeEventListener('click', handleOutside);
	}, []);

	const { currentUser, logout } = useAuth();

	const display_accounts = accounts.map((account) => {
		if (account.email === currentUser.email) return;
		return (
			<div className="flex gap-5 items-center" name="account--history--holder" key={account}>
				<img src={DefaultProfilePicture} className="w-[32px] h-[32px]"></img>
				<div className="flex flex-col" name='"account--info'>
					<p className="text-sm truncate ...">
						{account.firstName} {account.lastName}
					</p>
					<p className="text-xs truncate ...">{account.email}</p>
				</div>
			</div>
		);
	});

	async function handleLogout() {
		localStorage.clear();
		await logout();
	}

	const navigate = useNavigate();

	function handleManageAccount() {
		el.current.classList.remove('active');
		navigate('/manage-account');
	}

	return (
		<>
			<div className="profile--lookup h-[350px] flex flex-col bg-white" ref={el}>
				<div className="flex flex-col justify-center items-center mt-6">
					<div className="profile--picture h-[72px] w-[72px] rounded-full border dark:border-white border-special-gray overflow-hidden flex items-center justify-center">
						<img src={DefaultProfilePicture}></img>
					</div>
					<div className="mt-3 mb-1 flex flex-col justify-center items-center">
						<p className="text-[#202124] text-[16px] -tracking-[.1px] truncate ...">
							{user.firstName} {user.lastName}
						</p>
						<p className="text-[#5f6368] text-[14px] -tracking-[.1px] truncate ...">{user.email}</p>
					</div>
					<button
						className="manage--account--button mt-3 mb-5 text-[14px] border border-[#dadce0] py-[6px] px-[32px] rounded-[100px] hover:bg-gray-100 text-ellipsis max-w-[254px]"
						onClick={handleManageAccount}>
						Manage account
					</button>
				</div>
				<hr></hr>

				<div className="hover:bg-gray-100 cursor-pointer px-5 py-3" name="second part holder">
					<div className="ml-10">
						<div className="flex flex-col justify-center items-center">{display_accounts}</div>
						<div className="flex items-center gap-4">
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
									d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
								/>
							</svg>
							<p className="font-normal tracking-tighter">Add another account</p>
						</div>
					</div>
				</div>
				<hr></hr>
				<div className="w-full h-full flex justify-center items-center" name="last part">
					<button className="border border-[#dadce0] px-10 py-3 hover:bg-gray-100" onClick={handleLogout}>
						Log out from all accounts
					</button>
				</div>
			</div>
		</>
	);
}
