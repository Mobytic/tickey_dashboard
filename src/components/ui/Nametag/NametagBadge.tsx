import type { Nametag } from '@/@types/nametag'


interface NametagBadgeProps {
    tag: Nametag;
    onRemove: (tagId: number, e: React.MouseEvent) => void;
}


const NametagBadge = ({ tag, onRemove }: NametagBadgeProps) => {
    return (
        <span 
            className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide border transition-transform hover:scale-105 group/tag"
            style={{ 
                backgroundColor: `${tag.color}15`,
                borderColor: `${tag.color}40`,
                color: tag.color 
            }}
        >
            <span className="w-1.5 h-1.5 mr-1 rounded-full" style={{ backgroundColor: tag.color }} />
            {tag.name}
            
            <button
                type="button"
                onClick={(e) => onRemove(tag.id, e)}
                className="ml-1.5 opacity-50 hover:opacity-100 hover:text-red-500 transition-opacity focus:outline-none"
                title="Retirer ce tag"
            >
                ✕
            </button>
        </span>
    )
}

export default NametagBadge