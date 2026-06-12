import { useState, useEffect, useRef } from 'react'
import Dialog from '@/components/ui/Dialog'
import { Notification, toast } from '@/components/ui'
import { apiTicketUpdate } from '@/services/TicketService'
import { apiNametagIndex } from '@/services/NametagService'
import type { Ticket, TicketRequest } from '@/@types/ticket'
import type { Nametag } from '@/@types/nametag'
import TicketForm from '@/views/ticket/TicketForm'
import TicketShow from '@/views/ticket/TicketShow'
import { HiOutlineEye, HiOutlinePencil } from 'react-icons/hi'
import NametagBadge from '../Nametag/NametagBadge'

interface TicketCardProps {
    ticket: Ticket
    onRefresh: () => void
}

const TicketCard = ({ ticket, onRefresh }: TicketCardProps) => {

    const [isViewOpen, setIsViewOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isTagMenuOpen, setIsTagMenuOpen] = useState(false)
    const [availableTags, setAvailableTags] = useState<Nametag[]>([])
    const dropdownRef = useRef<HTMLDivElement>(null)


    const formattedDate = new Date(ticket.createdAt).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })

    const truncateComment = (text: string | null, limit: number = 100) => {
        if (!text) return null
        if (text.length <= limit) return text
        return text.substring(0, limit) + '...'
    }

    const handleOpenTagMenu = async (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsTagMenuOpen(!isTagMenuOpen)
        
        if (availableTags.length === 0) {
            try {
                const response = await apiNametagIndex()
                setAvailableTags(response.data)
            } catch (error) {
                console.error("Erreur chargement nametags", error)
            }
        }
    }

    const handleToggleNametag = async (tagId: number, e: React.MouseEvent) => {
        e.stopPropagation()
        try {
            const currentIds = ticket.nametags?.map(t => t.id) || []
            let updatedIds: number[]

            if (currentIds.includes(tagId)) {
                updatedIds = currentIds.filter(id => id !== tagId)
            } else {
                updatedIds = [...currentIds, tagId]
            }

            const payload: TicketRequest = {
                title: ticket.title,
                bugLink: ticket.bugLink,
                clientComment: ticket.clientComment,
                teamComment: ticket.teamComment || '',
                mailComment: ticket.mailComment || '',
                categoryId: ticket.categoryId,
                websiteId: ticket.websiteId,
                statusId: ticket.ticketStatusId,
                nametagIds: updatedIds
            }

            await apiTicketUpdate(ticket.id, payload)
            onRefresh()
        } catch (error) {
            toast.push(<Notification type="danger">Erreur de mise à jour du tag</Notification>, { placement: 'top-end' })
        }
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsTagMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="bg-white dark:bg-gray-900 p-3 mb-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-500 transition-all cursor-grab active:cursor-grabbing group relative">
            <div className="flex justify-between items-center mb-2.5 text-[11px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded">
                    {ticket.category?.name || 'Général'}
                </span>
                <span className="text-gray-400 dark:text-gray-500">{formattedDate}</span>
            </div>

            <p className="text-base font-semibold text-gray-900 dark:text-gray-300 mb-2 leading-snug line-clamp-2">
                {ticket.title}
            </p>

            {ticket.teamComment && (
                <p className="text-xs text-gray-500 dark:text-gray-300 bg-gray-50 px-2 py-1.5 rounded border border-gray-200 dark:border-gray-800 mb-3 italic dark:bg-gray-700">
                    <span className="font-semibold not-italic block text-[10px] text-gray-500 mb-0.5 uppercase dark:text-gray-300">Note équipe :</span>
                    {truncateComment(ticket.teamComment)}
                </p>
            )}

            <div className="flex flex-wrap items-center gap-1.5 mb-3">
                {ticket.nametags?.map((tag) => (
                    <NametagBadge 
                        key={tag.id} 
                        tag={tag} 
                        onRemove={handleToggleNametag} 
                    />
                ))}

                {/* BOUTON GESTION DES TAGS (+ Dropdown) */}
                <div className="relative" ref={dropdownRef}>
                    <button 
                        onClick={handleOpenTagMenu}
                        className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-xs font-bold transition-colors"
                        title="Gérer les nametags"
                    >
                        +
                    </button>

                    {isTagMenuOpen && (
                        <div className="absolute left-0 mt-1 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-xl z-50 py-1 max-h-48 overflow-y-auto">
                            <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-600">
                                Sélectionner les tags
                            </div>
                            {availableTags.map((tag) => {
                                const isChecked = ticket.nametags?.some(t => t.id === tag.id)
                                return (
                                    <button
                                        key={tag.id}
                                        onClick={(e) => handleToggleNametag(tag.id, e)}
                                        className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center justify-between transition-colors text-gray-700 dark:text-gray-200"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-sm shadow-sm" style={{ backgroundColor: tag.color }} />
                                            <span>{tag.name}</span>
                                        </div>
                                        {isChecked && <span className="text-blue-500 font-bold">✓</span>}
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
            {/* Zone footer du ticket */}
            <div className="flex justify-between items-center pt-1.5 border-t border-gray-100 dark:border-gray-700 text-[11px] text-gray-400">
                <div className="flex items-center gap-1">
                    <span className="truncate max-w-[200px] text-gray-500 lowercase normal-case dark:text-gray-400">
                    {ticket.website?.url.replace('https://', '').replace('http://', '')}
                    </span>
                </div>

                <div className="flex gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={(e) => { e.stopPropagation(); setIsViewOpen(true); }}
                        className="text-gray-500 hover:text-orange-400 dark:text-gray-300 dark:hover:text-orange-400 p-1 rounded-md hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors"
                        title="Voir le ticket"
                    >
                        <HiOutlineEye className="text-xl" />
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setIsEditOpen(true); }}
                        className="text-gray-500 hover:text-purple-500 dark:text-gray-300 dark:hover:text-purple-500 p-1 rounded-md hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors"
                        title="Modifier le ticket"
                    >
                        <HiOutlinePencil className="text-xl" />
                    </button>
                </div>
            </div>

            <Dialog isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} onRequestClose={() => setIsViewOpen(false)}width={700}>
                <div className="p-5 max-h-[80vh] overflow-y-auto">
                    <h3 className="mb-4 text-lg font-bold border-b pb-2 text-gray-900 dark:text-gray-100">
                        Détails du Ticket #{ticket.id}
                    </h3>
                    <TicketShow ticket={ticket} />
                </div>
            </Dialog>

            <Dialog isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} onRequestClose={() => setIsEditOpen(false)}width={800}>
                <div className="p-5 max-h-[80vh] overflow-y-auto">
                    <h3 className="mb-4 text-lg font-bold border-b pb-2 text-gray-900 dark:text-gray-100">
                        Modifier le ticket
                    </h3>
                    <TicketForm initialData={ticket} onSuccess={() => {
                            setIsEditOpen(false)
                            onRefresh()
                        }} />
                </div>
            </Dialog>

        </div>
    )
}

export default TicketCard