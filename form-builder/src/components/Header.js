import React, { useEffect, useRef, useState } from 'react';
import ProfileLookup from './ProfileLookup';
import DefaultProfilePicture from '../images/default_profile.png';
import { useAuth } from '../contexts/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useSetUser, useTheme, useToggleTheme, useUser } from '../contexts/ContextProvider';

export default function Header(props) {
	const [popUp, setPopUp] = useState(false);
	const origin = useRef();
	const { currentUser } = useAuth();
	const darkMode = useTheme();
	const toggleDarkMode = useToggleTheme();

	const user = useUser();
	const setUser = useSetUser();

	function handleProfileClick() {
		setPopUp((prev) => !prev);
	}
	const [accounts, setAccounts] = useState(JSON.parse(localStorage.getItem('acc')) || []);

	useEffect(() => {
		if (darkMode) {
			document.querySelector('.darkMode--toggler').classList.add('open');
		} else {
			document.querySelector('.darkMode--toggler').classList.remove('open');
		}
	}, [darkMode]);

	//TODO imma have to rewrite this shit cause rn im exposing whole database which is not good xd
	useEffect(() => {
		console.log(accounts);
		if (currentUser) {
			const colRef = collection(db, 'users');
			getDocs(colRef)
				.then((snapshot) => {
					snapshot.docs.forEach((doc) => {
						if (doc.data().email === currentUser.email) {
							let found = false;
							accounts.forEach((account) => {
								if (account.id === doc.data().id && account.email !== currentUser.email) {
									found = true;
								}
							});
							if (!found) {
								setAccounts((prev) => [...prev, { ...doc.data(), id: doc.id }]);
							}
							localStorage.setItem('acc', JSON.stringify(accounts));
							setUser({ ...doc.data() });
						}
					});
				})
				.catch((err) => {
					console.log(err.message);
				});
		}
	}, [currentUser]);

	return (
		<>
			<header className="site--header w-full h-[70px] dark:border-b dark:border-b-white mb-1">
				<div className="header--content w-screen h-full px-10">
					<span className="mx-auto text-special-gray txt app--title text-xs tracking-[0.9rem] sm:tracking-[1rem] md:tracking-[1.3rem] lg:tracking-[1.5rem] xl:tracking-[1.5rem] 2xl:tracking-[1.5rem] sm:text-base md:text-3xl">
						Form Generator
					</span>
					<div className="right--side">
						<div className="dark--mode">
							<p className="txt text-special-gray text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl">
								Light
							</p>

							<div
								className="darkMode--toggler flex justify-center items-center cursor-pointer"
								onClick={toggleDarkMode}>
								<div className="darkMode--toggler--button dark:bg-white dark:after:bg-white dark:before:bg-white bg-special-gray after:bg-special-gray before:bg-special-gray"></div>
							</div>

							<p className="txt text-special-gray text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl">
								Dark
							</p>
						</div>
						{currentUser &&
							(popUp ? (
								<div className="bg-gray-200 rounded-full">
									<div
										className="profile--picture rounded-full overflow-hidden flex items-center justify-center"
										onClick={handleProfileClick}>
										<img
											src={DefaultProfilePicture}
											className="w-[40px] h-[40px] cursor-pointer p-1"
											ref={origin}></img>
									</div>
								</div>
							) : (
								<div
									className="profile--picture rounded-full overflow-hidden flex items-center justify-center hover:bg-gray-100"
									onClick={handleProfileClick}>
									<img
										src={DefaultProfilePicture}
										className="w-[40px] h-[40px] cursor-pointer p-1"
										ref={origin}></img>
								</div>
							))}
						{popUp && <ProfileLookup origin={origin} state={[popUp, setPopUp]} user={user} accounts={accounts} />}
					</div>
				</div>
			</header>
		</>
	);
}
