// Aca simulación de base de datos con una lista de usuarios
const mockUsers = [
    {
        id: "1",
        name: "Admin Usuario",
        email: "admin@test.com",
        password: "admin123",
        role: "admin",
    },
    {
        id: "2",
        name: "Tomas Fernandez",
        email: "tomas@user.com",
        password: "user123",
        role: "user",
    },
    {
        id: "3",
        name: "María García",
        email: "maria@user.com",
        password: "user123",
        role: "user",
    },
];

const mockStudies = [
    { id: "1", userId: "2", title: "Ingeniería en Sistemas", institution: "Universidad Nacional", year: 2020 },
    { id: "2", userId: "2", title: "Curso React", institution: "Udemy", year: 2023 },
    { id: "3", userId: "3", title: "Licenciatura en Administración", institution: "Universidad Central", year: 2019 },
];

const mockAddresses = [
    { id: "1", userId: "2", street: "Avenida Peron", city: "Tucuman", country: "Argentina", type: "Casa" },
    { id: "2", userId: "2", street: "Solano Vera", city: "Tucuman", country: "Argentina", type: "Trabajo" },
    { id: "3", userId: "3", street: "Avenida Mate de Luna", city: "Tucuman", country: "Argentina", type: "Casa" },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Esta es la simulación de autenticación y API con datos falsos

export const mockAuth = {
    async login(email, password) {
        await delay(1000);
        const user = mockUsers.find((u) => u.email === email && u.password === password);
        if (user) {
            const token = `mock-token-${user.id}-${Date.now()}`;
            return {
                success: true,
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            };
        }
        return { success: false, message: "Credenciales inválidas" };
    },
};


export const mockApi = {
    async getUsers() {
        await delay(300);
        return mockUsers.map(({ password, ...rest }) => rest);
    },

    async createUser(userData) {
        await delay(500);
        const newUser = {
            id: (mockUsers.length + 1).toString(),
            ...userData,
        };
        mockUsers.push(newUser);
        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    },

    async updateUser(id, userData) {
        await delay(500);
        const index = mockUsers.findIndex((u) => u.id === id);
        if (index !== -1) {
            if (!userData.password || userData.password.trim() === "") {
                delete userData.password;
            }
            mockUsers[index] = { ...mockUsers[index], ...userData };
            const { password, ...userWithoutPassword } = mockUsers[index];
            return userWithoutPassword;
        }
        throw new Error("Usuario no encontrado");
    },

    async deleteUser(id) {
        await delay(500);
        const index = mockUsers.findIndex((u) => u.id === id);
        if (index !== -1) {
            mockUsers.splice(index, 1);
            return true;
        }
        return false;
    },

    async getStudies(userId) {
        await delay(300);
        return userId ? mockStudies.filter((s) => s.userId === userId) : mockStudies;
    },

    async createStudy(studyData) {
        await delay(300);
        const newStudy = {
            id: (mockStudies.length + 1).toString(),
            ...studyData,
        };
        mockStudies.push(newStudy);
        return newStudy;
    },

    async updateStudy(id, studyData) {
        await delay(300);
        const index = mockStudies.findIndex((s) => s.id === id);
        if (index !== -1) {
            mockStudies[index] = { ...mockStudies[index], ...studyData };
            return mockStudies[index];
        }
        throw new Error("Estudio no encontrado");
    },

    async deleteStudy(id) {
        await delay(300);
        const index = mockStudies.findIndex((s) => s.id === id);
        if (index !== -1) {
            mockStudies.splice(index, 1);
            return true;
        }
        return false;
    },

    async getAddresses(userId) {
        await delay(300);
        return userId ? mockAddresses.filter((a) => a.userId === userId) : mockAddresses;
    },

    async createAddress(addressData) {
        await delay(300);
        const newAddress = {
            id: (mockAddresses.length + 1).toString(),
            ...addressData,
        };
        mockAddresses.push(newAddress);
        return newAddress;
    },

    async updateAddress(id, addressData) {
        await delay(300);
        const index = mockAddresses.findIndex((a) => a.id === id);
        if (index !== -1) {
            mockAddresses[index] = { ...mockAddresses[index], ...addressData };
            return mockAddresses[index];
        }
        throw new Error("Dirección no encontrada");
    },

    async deleteAddress(id) {
        await delay(300);
        const index = mockAddresses.findIndex((a) => a.id === id);
        if (index !== -1) {
            mockAddresses.splice(index, 1);
            return true;
        }
        return false;
    },

    async getUsersWithPasswords() {
        await delay(300);
        return mockUsers;
    },
};
