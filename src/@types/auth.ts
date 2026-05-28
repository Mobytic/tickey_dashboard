export type User = {
    id: number
    firstname: string
    lastname: string
    mail: string
    companyName: string
    createdAt: string
    updatedAt: string
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
        firstname: string
        lastname: string
        companyName: string
        role: string
        mail: string
    }
    message: string
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
    firstname: string
    lastname: string
    companyName: string
    mail: string
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
}

export type UpdateProfileRequest = {
    firstname?: string
    lastname?: string
    mail?: string
    password?: string
    companyName?: string
    urls?: {
        url?: string
    }[]
    message?: string
}

export type ProfileResponse = User

export type UserListResponse = User[]
