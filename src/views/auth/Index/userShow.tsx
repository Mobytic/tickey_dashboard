import { useAppSelector } from '@/store'
import { User } from '@/@types/auth'

interface UserShowProps {
    user: User
}

const UserShow = ({ user }: UserShowProps) => {


    return (
        <div className="space-y-6">
            <div>
                <h5 className="mb-4 text-gray-800 dark:text-gray-100 border-b pb-2">Informations de l'utilisateur</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div><span className="font-semibold">Nom :</span> {user.firstname} {user.lastname}</div>
                    <div><span className="font-semibold">Entreprise :</span> {user.companyName}</div>
                    <div><span className="font-semibold">Email :</span> {user.mail}</div>
                    <div><span className="font-semibold">Téléphone :</span> {user.tel || 'Non renseigné'}</div>
                    <div><span className="font-semibold">Date de création :</span> {new Date(user.createdAt).toLocaleString('fr-FR')}</div>
                    <div><span className="font-semibold">Date de mise à jour :</span> {new Date(user.updatedAt).toLocaleString('fr-FR')}</div>
                    <div>
                        <span className="font-semibold">Lien vers le drive : </span> 
                        {user.drivePath ? (
                            <a href={user.drivePath} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700 hover:underline">
                                Accéder au Drive
                            </a>
                        ) : (
                            'Non renseigné'
                        )}
                    </div>
                </div>
            </div>
            {user.websites && user.websites.length > 0 && (
                <div>
                    <h5 className="mb-4 text-gray-800 dark:text-gray-100 border-b pb-2 mt-6">
                        Sites Web
                    </h5>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                        {user.websites.map((site) => (
                            <li key={site.id}>
                                <a href={site.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                                    {site.url}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default UserShow