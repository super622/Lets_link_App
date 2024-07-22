import { useContext, createContext, useState } from "react";

const AuthenticationContext = createContext();
export const useAuthentication = () => useContext(AuthenticationContext);

const AuthenticationProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [video, setVideo] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <AuthenticationContext.Provider value={{
            user, setUser,
            video, setVideo,
            isLoggedIn, setIsLoggedIn
        }}>
            {children}
        </AuthenticationContext.Provider>
    );
};

export default AuthenticationProvider;