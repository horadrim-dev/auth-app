export interface User {
    user_id: number;
    username: string;
    password?: string;
    first_name: string;
    last_name: string;
    token?: string;
    refreshToken?: string;
}
