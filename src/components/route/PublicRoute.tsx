import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/store'
import useAuth from '@/utils/hooks/useAuth'

const PublicRoute = () => {
    const { authenticated } = useAuth()
    const role = useAppSelector((state) => state.auth.user.role)

    if (authenticated) {
        return role === 'admin' ? (
            <Navigate to="/home" />
        ) : (
            <Navigate to="/tickets" />
        )
    }

    return <Outlet />
}

export default PublicRoute