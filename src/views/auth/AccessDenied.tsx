import Button from '@/components/ui/Button'
import { useNavigate } from 'react-router-dom'

const AccessDenied = () => {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[70vh]">
            <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-100 mb-4">403</h1>
            <h3 className="mb-2">Accès Refusé</h3>
            <p className="text-gray-500 mb-6 text-center max-w-md">
                Vous n'avez pas les autorisations nécessaires pour consulter cette page. 
            </p>
            <Button variant="solid" onClick={() => navigate('/tickets')}>
                Retour vers mes tickets.
            </Button>
        </div>
    )
}

export default AccessDenied