export type RoleUser = "Admin" | "Customer";

export interface UserInfo {
    id: string;
    email: string;
    role: RoleUser;
    accessToken: string;
    refreshToken: string;
}
