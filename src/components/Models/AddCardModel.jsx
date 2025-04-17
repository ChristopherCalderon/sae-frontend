export default function AgregarModeloCard() {
    return (
        <div className="bg-white w-md p-12 rounded-lg shadow-lg mx-auto">
            <h2 className="text-center font-mono text-2xl font-bold text-primary mb-8">
                Agregar modelo
            </h2>

            <form className="space-y-4">
                <div>
                    <label className="block font-bold text-md font-mono text-primary mb-1">Modelo:</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 rounded-md bg-gray-100 shadow-md focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block font-bold text-md font-mono text-primary mb-1">Nombre de la llave:</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 rounded-md bg-gray-100 shadow-md focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block font-bold text-md font-mono text-primary mb-1">Llave:</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 rounded-md bg-gray-100 shadow-md focus:outline-none"
                    />
                </div>
                <div className="flex justify-center mt-6">
                    <button
                        type="submit"
                        className="p-20 font-mono font-bold bg-primary text-white py-2 rounded-md hover:bg-secondary hover:text-black transition"
                    >
                        Aceptar
                    </button>
                </div>
            </form>
        </div>
    );
}