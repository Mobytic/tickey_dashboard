import { Draggable as PangeaDraggable } from '@hello-pangea/dnd'

interface DraggableWrapperProps {
    id: string;
    index: number;
    children: React.ReactNode;
}

const DraggableWrapper = ({ id, index, children }: DraggableWrapperProps) => {
    return (
        <PangeaDraggable draggableId={id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={snapshot.isDragging ? 'opacity-70' : ''}
                >
                    {children}
                </div>
            )}
        </PangeaDraggable>
    )
}

export default DraggableWrapper