export interface LoginResponse {
    data: {
        token: string,
         user: {
            id: string,
            name: string,
            email: string,
            role: string
        }
    }
}
