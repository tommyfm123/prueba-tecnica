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
        name: "Juan Pérez",
        email: "juan@test.com",
        password: "user123",
        role: "user",
    },
    {
        id: "3",
        name: "María García",
        email: "maria@test.com",
        password: "user123",
        role: "user",
    },
]

// Simulamos una lista de estudios
const mockStudies = [
    { id: "1", userId: "2", title: "Ingeniería en Sistemas", institution: "Universidad Nacional", year: 2020 },
    { id: "2", userId: "2", title: "Curso React", institution: "Platzi", year: 2023 },
    { id: "3", userId: "3", title: "Licenciatura en Administración", institution: "Universidad Central", year: 2019 },
]

// Simulamos una lista de direcciones

const mockAddresses = [
    { id: "1", userId: "2", street: "Calle 123 #45-67", city: "Bogotá", country: "Colombia", type: "Casa" },
    { id: "2", userId: "2", street: "Carrera 15 #30-25", city: "Bogotá", country: "Colombia", type: "Trabajo" },
    { id: "3", userId: "3", street: "Avenida 68 #25-30", city: "Medellín", country: "Colombia", type: "Casa" },
]

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms)) // esta funcion simula un "retraso" en las respuestas de la API para que parezca una llamada real


// Simulacion de autenticación

export const mockAuth = {
    async login(email, password) {
        await delay(1000)

        // Buscamos un usuario que coincida con el email y password de la "base de datos" simulada
        const user = mockUsers.find((u) => u.email === email && u.password === password)

        if (user) {
            const token = `mock-token-${user.id}-${Date.now()}` // En caso de existir el usuario, generamos un token
            return {
                success: true,
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            }
        }

        return { success: false, message: "Credenciales inválidas" }
    },
}

export const mockApi = {

    // Funcion para cargar los usuarios desde un archivo JSON simulado
    async getUsers() {
        const response = await fetch("/mock-users.json")
        if (!response.ok) throw new Error("Error cargando usuarios")
        console.log("Usuarios cargados desde mock-users.json") // esto confirma desde la consola que los datos se están cargando correctamente desde mock-users.json. Se puede eliminar en producción.
        const data = await response.json()
        return data
    },

    // Funcion para crear usuarios

    async createUser(userData) {
        await delay(500)
        const newUser = {
            id: (mockUsers.length + 1).toString(),
            ...userData,
        }
        mockUsers.push(newUser)
        const { password, ...userWithoutPassword } = newUser
        return userWithoutPassword
    },

    // Funcion que devuelve los estudios de un usuario o todos si es que no se pasa un ID
    async getStudies(userId) {
        await delay(300)
        return userId ? mockStudies.filter((s) => s.userId === userId) : mockStudies
    },

    // Funcion para agregar un nuevo estudio

    async createStudy(studyData) {
        await delay(300)
        const newStudy = {
            id: (mockStudies.length + 1).toString(),
            ...studyData,
        }
        mockStudies.push(newStudy)
        return newStudy
    },

    // Funcion para actualizar un estudio ya existente

    async updateStudy(id, studyData) {
        await delay(300)
        const index = mockStudies.findIndex((s) => s.id === id)
        if (index !== -1) {
            mockStudies[index] = { ...mockStudies[index], ...studyData }
            return mockStudies[index]
        }
        throw new Error("Estudio no encontrado")
    },

    // Funcion para eliminar un estudio existente

    async deleteStudy(id) {
        await delay(300)
        const index = mockStudies.findIndex((s) => s.id === id)
        if (index !== -1) {
            mockStudies.splice(index, 1)
            return true
        }
        return false
    },

    // Funcion que devuelve las direcciones de un usuario o todas si es que no se pasa un ID

    async getAddresses(userId) {
        await delay(300)
        return userId ? mockAddresses.filter((a) => a.userId === userId) : mockAddresses
    },

    // Funcion para agregar una nueva dirección 

    async createAddress(addressData) {
        await delay(300)
        const newAddress = {
            id: (mockAddresses.length + 1).toString(),
            ...addressData,
        }
        mockAddresses.push(newAddress)
        return newAddress
    },

    // Funcion para actualizar una dirección ya existente

    async updateAddress(id, addressData) {
        await delay(300)
        const index = mockAddresses.findIndex((a) => a.id === id)
        if (index !== -1) {
            mockAddresses[index] = { ...mockAddresses[index], ...addressData }
            return mockAddresses[index]
        }
        throw new Error("Dirección no encontrada")
    },

    // Funcion para eliminar una dirección existente

    async deleteAddress(id) {
        await delay(300)
        const index = mockAddresses.findIndex((a) => a.id === id)
        if (index !== -1) {
            mockAddresses.splice(index, 1)
            return true
        }
        return false
    },
}
