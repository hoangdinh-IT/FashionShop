export interface RegisterFormInputs {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface LoginFormInputs {
    email: string;
    password: string;
    remember?: boolean
}

export interface ForgotPasswordFormInputs {
    email: string;
}

export interface ResetPasswordFormInputs {
    email: string;
    otp: string;
    newPassword: string;
    confirmNewPassword: string;
}