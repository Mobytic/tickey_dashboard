interface ColorIndicatorProps {
    color: string
}

export const ColorIndicator = ({ color }: ColorIndicatorProps) => {
    if (!color) {
        return <span className="text-gray-400 text-xs italic">Aucune</span>
    }

    return (
        <div 
            className="w-12 h-6 rounded border border-gray-200 dark:border-gray-700 shadow-sm transition-transform hover:scale-105"
            style={{ backgroundColor: color }}
            title={color}
        />
    )
}

export default ColorIndicator