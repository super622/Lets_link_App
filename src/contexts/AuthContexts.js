import { useContext, createContext, useState } from "react";

const AuthenticationContext = createContext();
export const useAuthentication = () => useContext(AuthenticationContext);

const AuthenticationProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [video, setVideo] = useState(false);
    const [notification, setNotification] = useState(false);

    return (
        <AuthenticationContext.Provider value={{
            user, setUser,
            video, setVideo,
            notification, setNotification
        }}>
            {children}
        </AuthenticationContext.Provider>
    );
};

export default AuthenticationProvider;