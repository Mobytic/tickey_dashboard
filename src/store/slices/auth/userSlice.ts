import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'

export type UserState = {
    firstname?: string
    lastname?: string
    companyName?: string
    mail?: string
    authority?: string[]
}

const initialState: UserState = {
    firstname: '',
    lastname: '',
    companyName: '',
    mail: '',
    authority: [],
}

const userSlice = createSlice({
    name: `${SLICE_BASE_NAME}/user`,
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            state.firstname = action.payload?.firstname
            state.lastname = action.payload?.lastname
            state.companyName = action.payload?.companyName
            state.mail = action.payload?.mail
            state.authority = action.payload?.authority
        },
    },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
