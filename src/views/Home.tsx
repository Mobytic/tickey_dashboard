import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import DraggableWrapper from '@/components/ui/dnd/draggable'
import DroppableWrapper from '@/components/ui/dnd/droppable'

// --- NOS FAUSSES DONNÉES (Pour tester) ---
const fakeData = {
    "colonne-a-faire": [
        { id: "ticket-1", title: "Réparer le bouton rouge" },
        { id: "ticket-2", title: "Mettre à jour le footer" }
    ],
    "colonne-termine": [
        { id: "ticket-3", title: "Créer la base de données" }
    ]
}

const Home = () => {
    
    // Cette fonction se déclenche au moment exact où tu relâches le clic de la souris
    const handleDragEnd = (result: DropResult) => {
        // Pour l'instant, on ne sauvegarde rien. On veut juste regarder ce que la librairie a calculé !
        console.log("LE RÉSULTAT DU GLISSER-DÉPOSER :", result)
    }

    return (
        <div className="p-6">
            <h3 className="mb-6">Dashboard tickets</h3>

            {/* LE TERRAIN DE JEU : Il entoure tout et écoute les mouvements */}
            <DragDropContext onDragEnd={handleDragEnd}>
                
                <div className="grid grid-cols-2 gap-8">
                    
                    {/* --- COLONNE 1 : À FAIRE --- */}
                    <div>
                        <h4 className="mb-4">À faire</h4>
                        <DroppableWrapper id="colonne-a-faire">
                            {fakeData["colonne-a-faire"].map((ticket, index) => (
                                <DraggableWrapper key={ticket.id} id={ticket.id} index={index}>
                                    <div className="bg-white dark:bg-gray-700 p-4 mb-2 shadow rounded border border-gray-200">
                                        {ticket.title}
                                    </div>
                                </DraggableWrapper>
                            ))}
                        </DroppableWrapper>
                    </div>

                    {/* --- COLONNE 2 : TERMINÉ --- */}
                    <div>
                        <h4 className="mb-4">Terminé</h4>
                        <DroppableWrapper id="colonne-termine">
                            {fakeData["colonne-termine"].map((ticket, index) => (
                                <DraggableWrapper key={ticket.id} id={ticket.id} index={index}>
                                    <div className="bg-white dark:bg-gray-700 p-4 mb-2 shadow rounded border border-gray-200">
                                        {ticket.title}
                                    </div>
                                </DraggableWrapper>
                            ))}
                        </DroppableWrapper>
                    </div>

                </div>
            </DragDropContext>
        </div>
    )
}

export default Home