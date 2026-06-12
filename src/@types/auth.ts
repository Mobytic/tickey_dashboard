export enum UserRole {
    admin = 'admin',
    client = 'client',
}

export type User = {
    id: number
    firstname: string
    lastname: string
    mail: string
    role: UserRole
    companyName: string
    createdAt: string
    updatedAt: string
    tel?: string
    drivePath?: string
    websites?: {
        id: number
        url: string
    }[]
}

export type SignInCredential = {
    mail: string
    password: string
}

export type SignInResponse = {
    token: string
    user: {
        id: number
        firstname: string
        lastname: string
        companyName: string
        role: UserRole
        mail: string
        tel?: string
        drivePath?: string
        websites?: {
            id: number
            url: string
        }[]
    }
    message: string
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
    firstname: string
    lastname: string
    companyName?: string
    mail: string
    tel?: string
    drivePath?: string
    password: string
    passwordConfirmation: string
    urls?: {
        url?: string
    }[]
}

export type ForgotPassword = {
    mail: string
}

export type SignOutResponse = {
    message: string
}

export type ResetPassword = {
    password: string
    token: string
}

export type UpdateProfileRequest = {
    firstname?: string
    lastname?: string
    mail?: string
    password?: string
    companyName?: string
    tel?: string
    drivePath?: string
    urls?: {
        url?: string
    }[]
    message?: string
}

export type ProfileResponse = User

export type UserListResponse = User[]
