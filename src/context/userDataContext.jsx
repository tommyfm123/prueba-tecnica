import { createContext, useState, useContext } from 'react';
import { mockApi } from '../services/fakeApi';
import { toast } from 'react-toastify';

const UserDataContext = createContext();

export function UserDataProvider({ children }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadUserData = async (userId) => {
        setLoading(true);
        try {
            const studies = await mockApi.getStudies(userId);
            const addresses = await mockApi.getAddresses(userId);
            setUserData({ studies, addresses });
        } catch (error) {
            console.error('Error al cargar datos de usuario:', error);
            toast.error('Error al cargar datos de usuario.');
        } finally {
            setLoading(false);
        }
    };

    const updateUserData = (updates) => {
        setUserData((prev) => ({ ...prev, ...updates }));
    };

    return (
        <UserDataContext.Provider
            value={{ userData, setUserData, loadUserData, updateUserData, loading }}
        >
            {children}
        </UserDataContext.Provider>
    );
}

export function useUserData() {
    const context = useContext(UserDataContext);
    if (!context) {
        throw new Error('useUserData debe ser usado dentro de un UserDataProvider');
    }
    return context;
}
