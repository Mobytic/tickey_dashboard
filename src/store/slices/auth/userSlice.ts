import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'
import { UserRole } from '@/@types/auth'

export type UserState = {
    id: number
    firstname?: string
    lastname?: string
    companyName?: string
    mail?: string
    role?: UserRole
    authority?: UserRole[]
    tel?: string
    drivePath?: string
    websites?: {
            id: number
            url: string
        }[]
}

const initialState: UserState = {
    id: 0,
    firstname: '',
    lastname: '',
    companyName: '',
    mail: '',
    role: undefined,
    authority: [],
    tel: '',
    drivePath: '',
    websites: [],
}

const userSlice = createSlice({
    name: `${SLICE_BASE_NAME}/user`,
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            state.id = action.payload.id
            state.firstname = action.payload?.firstname
            state.lastname = action.payload?.lastname
            state.companyName = action.payload?.companyName
            state.mail = action.payload?.mail
            state.tel = action.payload?.tel
            state.drivePath = action.payload?.drivePath
            state.websites = action.payload?.websites
            state.role = action.payload?.role
            if (action.payload?.role) {
                state.authority = [action.payload.role]
            } 
            else if (action.payload?.authority) {
                state.authority = action.payload.authority
            } 
            else {
                state.authority = []
            }
        },
    },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
