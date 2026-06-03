import { apiSignIn, apiSignOut, apiSignUp } from '@/services/AuthService'
import {
    setUser,
    signInSuccess,
    signOutSuccess,
    useAppSelector,
    useAppDispatch,
} from '@/store'
import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useNavigate } from 'react-router-dom'
import useQuery from './useQuery'
import type { SignInCredential, SignUpCredential } from '@/@types/auth'

type Status = 'success' | 'failed'

function useAuth() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const query = useQuery()

    const { token, signedIn } = useAppSelector((state) => state.auth.session)
    const user = useAppSelector((state) => state.auth.user)
    const signIn = async (
        values: SignInCredential
    ): Promise<{ status: Status; message: string } | undefined> => {
        try {
            const resp = await apiSignIn(values)
            if (resp.data) {
                const { token, user } = resp.data
                dispatch(signInSuccess(token))
                if (user) {
                    dispatch(
                        setUser({
                            id: user.id,
                            firstname: user.firstname,
                            lastname: user.lastname,
                            companyName: user.companyName,
                            mail: user.mail,
                            authority: [user.role],
                            tel: user.tel,
                            drivePath: user.drivePath,
                            websites: user.websites,
                        })
                    )
                }
                const redirectUrl = query.get(REDIRECT_URL_KEY)
                navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath)
                return { status: 'success', message: 'Bienvenue !' }
            }
        } catch (errors: any) {
            const adonisError = errors?.response?.data?.errors?.[0]?.message
            const message = adonisError || errors?.response?.data?.message || errors.toString()
            
            return {
                status: 'failed',
                message,
            }
        }
    }

    const signUp = async (values: SignUpCredential) => {
        try {
            const resp = await apiSignUp(values)
            if (resp.data) {
                const { token, user } = resp.data
                return { status: 'success', message: 'Compte créé avec succès' }
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const handleSignOut = () => {
        dispatch(signOutSuccess())
        dispatch(
            setUser({
                id: 0,
                firstname: '',
                lastname: '',
                companyName: '',
                mail: '',
                authority: [],
                tel: '',
                drivePath: '',
                websites: [],
            })
        )
        navigate(appConfig.unAuthenticatedEntryPath)
    }

    const signOut = async () => {
        await apiSignOut()
        handleSignOut()
    }

    return {
        authenticated: token && signedIn,
        signIn,
        signUp,
        signOut,
        user,
    }
}

export default useAuth