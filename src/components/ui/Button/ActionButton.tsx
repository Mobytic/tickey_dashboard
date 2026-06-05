import React from 'react'

// 1. DÉCLARATION DES PROPS (Le contrat)
// On dit à TypeScript : "Pour utiliser cette usine, tu DOIS me fournir un type et un onClick"
interface ActionButtonProps {
    type: 'view' | 'edit' | 'delete'
    onClick: () => void // onClick est une fonction qui ne renvoie rien
}

// 2. LE DICTIONNAIRE (La solution au piège Tailwind)
// On écrit les classes Tailwind en toutes lettres pour qu'il les trouve.
const actionConfig = {
    view: {
        text: 'Voir',
        colorClass: 'text-orange-400 hover:text-orange-300',
    },
    edit: {
        text: 'Modifier',
        colorClass: 'text-purple-500 hover:text-purple-700',
    },
    delete: {
        text: 'Supprimer',
        colorClass: 'text-red-500 hover:text-red-700',
    }
}

// 3. LE COMPOSANT (L'usine)
const ActionButton = (props: ActionButtonProps) => {
    // On extrait les commandes (props) reçues du parent
    const { type, onClick } = props

    // On va chercher les bonnes couleurs et le bon texte dans le dictionnaire
    const config = actionConfig[type]

    return (
        <button
            className={`${config.colorClass} font-semibold text-sm transition-colors`}
            onClick={onClick}
            type="button"
        >
            {config.text}
        </button>
    )
}

export default ActionButton
