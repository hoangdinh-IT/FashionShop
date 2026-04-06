import type { Gender } from "./user";

export interface UserFormInputs {
    fullName: string;
    phoneNumber: string;
    gender: Gender;
    dateOfBirth: Date;
}

export interface ChangePasswordFormInputs {
    email: string;
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}