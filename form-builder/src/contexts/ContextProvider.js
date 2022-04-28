import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();
const ToggleThemeContext = createContext();
const UserContext = createContext();
const SetUserContext = createContext();
const SigningUpContext = createContext();
const SetSigningUpContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function useSigningUp() {
  return useContext(SigningUpContext);
}

export function useSetSigningUp() {
  return useContext(SetSigningUpContext);
}

export function useSetUser() {
  return useContext(SetUserContext);
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function useToggleTheme() {
  return useContext(ToggleThemeContext);
}

export function ContextProvider({ children }) {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') || false);

  const [user, setUser] = useState(null);
  const [signingUp, setSigningUp] = useState(false);

  function toggleTheme() {
    if (darkMode) {
      document.querySelector('.darkMode--toggler').classList.add('open');
    } else {
      document.querySelector('.darkMode--toggler').classList.remove('open');
    }
    localStorage.setItem('theme', JSON.stringify(darkMode));
    setDarkMode((prev) => !prev);
  }

  return (
    <ThemeContext.Provider value={darkMode}>
      <ToggleThemeContext.Provider value={toggleTheme}>
        <UserContext.Provider value={user}>
          <SetUserContext.Provider value={setUser}>
            <SigningUpContext.Provider value={signingUp}>
              <SetSigningUpContext.Provider value={setSigningUp}>
                {children}
              </SetSigningUpContext.Provider>
            </SigningUpContext.Provider>
          </SetUserContext.Provider>
        </UserContext.Provider>
      </ToggleThemeContext.Provider>
    </ThemeContext.Provider>
  );
}
