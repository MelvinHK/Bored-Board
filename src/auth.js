import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './firestoreConfig';

const UserContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser();
            }
        });
    }, []);

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(UserContext);
};

export const signOut = () => {
    auth.signOut()
        .then(value => { })
        .catch(reason => { console.error(reason); });
};