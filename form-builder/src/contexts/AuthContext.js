import React, { useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { useSigningUp } from './ContextProvider';

const AuthContext = React.createContext();

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({ children }) {
	const [currentUser, setCurrentUser] = useState();
	const [loading, setLoading] = useState(false);

	function signup(email, password) {
		return auth.createUserWithEmailAndPassword(email, password);
	}

	function login(email, password) {
		return auth.signInWithEmailAndPassword(email, password);
	}

	function logout() {
		return auth.signOut();
	}

	function resetPassword(email) {
		return auth.sendPasswordResetEmail(email);
	}

	function updateEmail(email) {
		return currentUser.updateEmail(email);
	}

	function updatePassword(password) {
		return currentUser.updatePassword(password);
	}

	async function emailExists(email) {
		return auth.fetchSignInMethodsForEmail(email).then((list) => {
			return list.length;
		});
	}
	const signingUp = useSigningUp();

	useEffect(() => {
		const unsub = auth.onAuthStateChanged((user) => {
			if (!signingUp) {
				setCurrentUser(user);
				setLoading(false);
			}
		});

		return () => unsub;
	}, []);

	const value = {
		currentUser,
		signup,
		login,
		logout,
		resetPassword,
		updateEmail,
		updatePassword,
		emailExists,
	};

	return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
