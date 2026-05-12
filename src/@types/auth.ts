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
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
    firstname: string
    lastname: string
    companyName: string
    mail: string
    password: string
}

export type ForgotPassword = {
    mail: string
}

export type ResetPassword = {
    password: string
}
