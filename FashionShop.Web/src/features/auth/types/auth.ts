import type { User } from "../../shop/users/types/user";

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
    refreshTokenExpiryTime: Date;
}
