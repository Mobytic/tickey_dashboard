import React from 'react'


interface ActionButtonProps {
    type: 'view' | 'edit' | 'delete'
    onClick: () => void
}

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
