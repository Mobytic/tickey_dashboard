const NotFound = () => {

    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[70vh]">
            <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-100 mb-4">404</h1>
            <h3 className="mb-2">Page non trouvée !</h3>
            <p className="text-gray-500 mb-6 text-center max-w-md">
                Cette page n'existe pas ou est provisoirement en maintenance.
            </p>
        </div>
    )
}

export default NotFound
