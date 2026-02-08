import React, { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

const GlobalContext = createContext();

export function GlobalProvider({ children }) {
    const [userData, setUserData] = useState(null);

    const showNotification = (message, type = 'success') => {
        if (type === 'error') {
            toast.error(message);
        } else {
            toast.success(message);
        }
    };

    return (
        <GlobalContext.Provider
            value={{
                userData,
                setUserData,
                showNotification
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
}

export function useGlobal() {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error('useGlobal must be used within a GlobalProvider');
    }
    return context;
}
