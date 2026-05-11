export type SignInCredential = {
    mail: string
    password: string
}

export type SignInResponse = {
    token: string
    user: {
        userName: string
        authority: string[]
        avatar: string
        mail: string
    }
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
    userName: string
    mail: string
    password: string
}

export type ForgotPassword = {
    mail: string
}

export type ResetPassword = {
    password: string
}
