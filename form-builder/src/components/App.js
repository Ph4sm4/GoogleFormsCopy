import React from 'react';
import Header from './Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '../index.css';
import Login from './login/Identifier';
import SignUp from './register/SignUp';
import Dashboard from './Dashboard';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import PrivateRoute from './redirections/PrivateRoute';
import LoggedInRoute from './redirections/LoggedInRoute';
import ManageAccount from './ManageAccount';
import UpdatePhoto from './AccountUpdates/UpdatePhoto';
import UpdateName from './AccountUpdates/UpdateName';
import UpdateBirthday from './AccountUpdates/UpdateBirthday';
import UpdateGender from './AccountUpdates/UpdateGender';
import UpdateEmail from './AccountUpdates/UpdateEmail';
import UpdatePhone from './AccountUpdates/UpdatePhone';
import UpdatePassword from './AccountUpdates/UpdatePassword';
import ComponentRenderer from './AccountUpdates/ComponentRenderer';
import SignIn from './login/SignIn';
import LoginPrivateRoute from './redirections/LoginPrivateRoute';
import VerifyPhone from './register/VerifyPhone';
import CodeValidation from './register/CodeValidation';
import PersonalData from './register/PersonalData';
import RegistrationRoute from './redirections/RegistrationRoute';

export default function App() {
	return (
		<>
			<AuthProvider>
				<Router>
					<Routes>
						<Route exact path="/" element={<PrivateRoute />}>
							<Route
								exact
								path="/"
								element={
									<>
										<Header />
										<Dashboard />
									</>
								}
							/>
						</Route>

						<Route
							path="/identifier"
							element={
								<>
									<Login />
								</>
							}
						/>

						<Route exact path="/signin" element={<LoginPrivateRoute />}>
							<Route
								exact
								path="/signin"
								element={
									<>
										<SignIn />
									</>
								}
							/>
						</Route>

						<Route exact path="/register" element={<LoggedInRoute />}>
							<Route
								exact
								path="/register"
								element={
									<>
										<SignUp />
									</>
								}
							/>
						</Route>
						<Route exact path="/verify-number" element={<RegistrationRoute />}>
							<Route
								exact
								path="/verify-number"
								element={
									<>
										<VerifyPhone />
									</>
								}
							/>
						</Route>
						<Route exact path="/code-verification" element={<RegistrationRoute />}>
							<Route
								exact
								path="/code-verification"
								element={
									<>
										<CodeValidation />
									</>
								}
							/>
						</Route>
						<Route exact path="/register-continue" element={<RegistrationRoute />}>
							<Route
								exact
								path="/register-continue"
								element={
									<>
										<PersonalData />
									</>
								}
							/>
						</Route>

						<Route path="/manage-account" element={<PrivateRoute />}>
							<Route
								path="/manage-account"
								element={
									<>
										<Header />
										<ManageAccount />
									</>
								}
							/>
						</Route>
						<Route path="/update-name" element={<PrivateRoute />}>
							<Route
								path="/update-name"
								element={
									<>
										<Header />
										<ComponentRenderer title="Name">
											<UpdateName />
										</ComponentRenderer>
									</>
								}
							/>
						</Route>
						<Route path="/update-birthday" element={<PrivateRoute />}>
							<Route
								path="/update-birthday"
								element={
									<>
										<Header />
										<ComponentRenderer title="Birthday">
											<UpdateBirthday />
										</ComponentRenderer>
									</>
								}
							/>
						</Route>
						<Route path="/update-gender" element={<PrivateRoute />}>
							<Route
								path="/update-gender"
								element={
									<>
										<Header />
										<ComponentRenderer title="Gender">
											<UpdateGender />
										</ComponentRenderer>
									</>
								}
							/>
						</Route>
						<Route path="/update-email" element={<PrivateRoute />}>
							<Route
								path="/update-email"
								element={
									<>
										<Header />
										<ComponentRenderer title="Email">
											<UpdateEmail />
										</ComponentRenderer>
									</>
								}
							/>
						</Route>
						<Route path="/update-phone" element={<PrivateRoute />}>
							<Route
								path="/update-phone"
								element={
									<>
										<Header />
										<ComponentRenderer title="Phone number">
											<UpdatePhone />
										</ComponentRenderer>
									</>
								}
							/>
						</Route>
						<Route path="/update-password" element={<PrivateRoute />}>
							<Route
								path="/update-password"
								element={
									<>
										<Header />
										<ComponentRenderer title="Password">
											<UpdatePassword />
										</ComponentRenderer>
									</>
								}
							/>
						</Route>
					</Routes>
				</Router>
			</AuthProvider>
		</>
	);
}
