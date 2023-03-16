import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './firestoreConfig';

const UserContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                setLoading(false);
            } else {
                setUser();
                setLoading(false);
            }
        });
        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <UserContext.Provider value={{ user: user, userLoading: loading }}>
            {children}
        </UserContext.Provider >
    );
};

export const useAuth = () => {
    return useContext(UserContext);
};

export const signOut = async () => {
    await auth.signOut()
};