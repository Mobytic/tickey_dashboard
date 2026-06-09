import { Droppable as PangeaDroppable } from '@hello-pangea/dnd'

interface DroppableWrapperProps {
    id: string;
    children: React.ReactNode;
}

const DroppableWrapper = ({ id, children }: DroppableWrapperProps) => {
    return (
        <PangeaDroppable droppableId={id}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[600px] p-2 rounded-md ${
                        snapshot.isDraggingOver ? 'bg-gray-200 dark:bg-gray-600' : 'bg-gray-100 dark:bg-gray-800'
                    }`}
                >
                    {children}
                    {provided.placeholder}
                </div>
            )}
        </PangeaDroppable>
    )
}

export default DroppableWrapper