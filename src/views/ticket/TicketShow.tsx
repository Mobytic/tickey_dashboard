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
                <h4 className="mb-4 text-gray-800 dark:text-gray-100 border-b pb-2">Informations du Ticket</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {isAdmin && <div><span className="font-semibold">Tag :</span> {ticket.nametags?.[0]?.name || '-'}</div>}
                    <div><span className="font-semibold">Statut :</span> {ticket.status?.name || '-'}</div>
                    <div><span className="font-semibold">Site Web :</span> {ticket.website?.url || '-'}</div>
                    <div><span className="font-semibold">Date de création :</span> {new Date(ticket.createdAt).toLocaleString('fr-FR')}</div>
                    {isAdmin &&<div><span className="font-semibold">Date de mise à jour :</span> {new Date(ticket.updatedAt).toLocaleString('fr-FR')}</div>}
                    <div><span className="font-semibold">Catégorie :</span> {ticket.category?.name || '-'}</div>
                    <div><span className="font-semibold">Titre :</span> {ticket.title}</div>
                    <div><span className="font-semibold text-sm">Lien du bug :</span>
                        <a href={ticket.bugLink} target="_blank" rel="noopener noreferrer" className="ml-2 text-purple-500 hover:underline text-sm">
                            {ticket.bugLink}
                        </a>
                    </div>
                    
                </div>
                
                <div className="mt-4">
                    <span className="font-semibold text-sm">Description :</span>
                    <p className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-md text-sm whitespace-pre-wrap">
                        {ticket.clientComment}
                    </p>
                </div>
                {isAdmin &&
                <div className="mt-4">
                    <span className="font-semibold text-sm">Commentaire de l'équipe:</span>
                    <p className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-md text-sm whitespace-pre-wrap">
                        {ticket.teamComment}
                    </p>
                </div>}
                {isAdmin &&
                <div className="mt-4">
                    <span className="font-semibold text-sm">Commentaire de clôture :</span>
                    <p className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-md text-sm whitespace-pre-wrap">
                        {ticket.mailComment}
                    </p>
                </div>}
            </div>

            {isAdmin && ticket.user && (
                <div>
                    <h4 className="mb-4 text-gray-800 dark:text-gray-100 border-b pb-2">Informations Utilisateur</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div><span className="font-semibold">Nom :</span> {ticket.user.lastname} {ticket.user.firstname}</div>
                        <div><span className="font-semibold">Email :</span> {ticket.user.mail}</div>
                        <div><span className="font-semibold">Téléphone :</span> {ticket.user.tel || 'Non renseigné'}</div>
                        <div>
                            <span className="font-semibold">Lien vers le drive :</span>
                            <a href={ticket.user.drivePath} className="text-purple-500 hover:underline" target="_blank" rel="noopener noreferrer"> Accéder</a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TicketShow