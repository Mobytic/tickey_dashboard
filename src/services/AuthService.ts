import ApiService from './ApiService'
import type {
    SignInCredential,
    SignUpCredential,
    ForgotPassword,
    ResetPassword,
    SignInResponse,
    SignUpResponse,
    UpdateProfileRequest,
    ProfileResponse,
    SignOutResponse,
    UserListResponse,
} from '@/@types/auth'
import type { WebsiteListResponse } from '@/@types/website'
import type { MessageResponse } from '@/@types/common'

export async function apiSignIn(data: SignInCredential) {
    return ApiService.fetchData<SignInResponse>({
        url: 'auth/login',
        method: 'post',
        data,
    })
}

export async function apiSignUp(data: SignUpCredential) {
    return ApiService.fetchData<SignUpResponse>({
        url: 'auth/register',
        method: 'post',
        data,
    })
}

export async function apiSignOut() {
    return ApiService.fetchData<SignOutResponse>({
        url: 'auth/logout',
        method: 'post',
    })
}

export async function apiForgotPassword(data: ForgotPassword) {
    return ApiService.fetchData({
        url: 'auth/forgot-password',
        method: 'post',
        data,
    })
}

export async function apiResetPassword(data: ResetPassword) {
    return ApiService.fetchData({
        url: 'auth/reset-password',
        method: 'post',
        data,
    })
}

export async function apiAuthUpdate(id: number, data: UpdateProfileRequest) {
    return ApiService.fetchData<ProfileResponse>({
        url: `auth/update/${id}`,
        method: 'patch',
        data,
    })
}

export async function apiUserIndex() {
    return ApiService.fetchData<UserListResponse>({
        url: 'auth/users',
        method: 'get',
    })
}

export async function apiWebsiteIndex() {
    return ApiService.fetchData<WebsiteListResponse>({
        url: 'auth/websites',
        method: 'get',
    })
}
