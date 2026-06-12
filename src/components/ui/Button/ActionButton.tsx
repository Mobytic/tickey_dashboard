import React from 'react'


interface ActionButtonProps {
    type: 'view' | 'edit' | 'delete'
    onClick: () => void
}

const actionConfig = {
    view: {
        text: 'Voir',
        colorClass: 'text-amber-400 hover:text-amber-600',
    },
    edit: {
        text: 'Modifier',
        colorClass: 'text-indigo-400 hover:text-indigo-600',
    },
    delete: {
        text: 'Supprimer',
        colorClass: 'text-red-500 hover:text-red-600',
    }
}


const ActionButton = (props: ActionButtonProps) => {

    const { type, onClick } = props
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
