export interface LoginResponse {
    data: {
        token: string,
         user: {
            name: string,
            email: string,
            role: string
        }
    }
}
