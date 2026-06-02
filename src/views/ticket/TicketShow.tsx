import type { Ticket } from '@/@types/ticket'
import { useAppSelector } from '@/store'
import { UserRole } from '@/@types/auth'

interface TicketShowProps {
    ticket: Ticket
}

const TicketShow = ({ ticket }: TicketShowProps) => {
    const user = useAppSelector((state) => state.auth.user)
    const isAdmin = user?.authority?.includes(UserRole.admin)

    return (
        <div className="space-y-6">
            <div>
                <h6 className="mb-4 text-gray-800 dark:text-gray-100 border-b pb-2">Informations du Ticket</h6>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div><span className="font-semibold">Titre :</span> {ticket.title}</div>
                    <div><span className="font-semibold">Statut :</span> {ticket.status?.name || '-'}</div>
                    <div><span className="font-semibold">Catégorie :</span> {ticket.category?.name || '-'}</div>
                    <div><span className="font-semibold">Site Web :</span> {ticket.user?.url || '-'}</div>
                    <div><span className="font-semibold">Date de création :</span> {new Date(ticket.createdAt).toLocaleDateString('fr-FR')}</div>
                    {isAdmin && <div><span className="font-semibold">Tag :</span> {ticket.nametags?.[0]?.name || '-'}</div>}
                </div>
                
                <div className="mt-4">
                    <span className="font-semibold text-sm">Description :</span>
                    <p className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-md text-sm whitespace-pre-wrap">
                        {ticket.clientComment}
                    </p>
                </div>

                <div className="mt-4">
                    <span className="font-semibold text-sm">Lien du bug :</span>
                    <a href={ticket.bugLink} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500 hover:underline text-sm">
                        {ticket.bugLink}
                    </a>
                </div>
            </div>

            {isAdmin && ticket.user && (
                <div>
                    <h6 className="mb-4 text-gray-800 dark:text-gray-100 border-b pb-2">Informations Utilisateur</h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div><span className="font-semibold">Nom :</span> {ticket.user.lastname} {ticket.user.firstname}</div>
                        <div><span className="font-semibold">Email :</span> {ticket.user.mail}</div>
                        <div><span className="font-semibold">Téléphone :</span> {ticket.user.tel || 'Non renseigné'}</div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TicketShow