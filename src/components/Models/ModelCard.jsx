import { VscKey } from "react-icons/vsc";
import { HiPlus } from "react-icons/hi";

export default function ModeloCard({ nombre, icono, keys }) {
    return (
        <div className="flex items-center gap-12 mb-6">
            <div className="flex flex-col items-center justify-center min-w-[5rem]">
                {icono}
                <span className="text-lg text-primary mt-1 font-mono font-semibold text-center">{nombre}</span>
            </div>
            <div className="flex gap-4 flex-wrap">
                {keys.map((item, index) => (
                    <div
                        key={index}
                        className="group bg-gray-100 rounded-xl px-6 py-5 hover:bg-blue-900 shadow text-base font-mono flex items-center gap-4 transition-all duration-200 min-w-[220px]"
                    >
                        <VscKey className="text-primary group-hover:text-white w-10 h-10" />
                        <div className="flex flex-col text-primary group-hover:text-white">
                            <span className="font-bold">{item.key}</span>
                            <span>{item.modelo}</span>
                        </div>
                    </div>
                ))}

                <div
                    className="bg-backgound rounded-md px-4 hover:bg-blue-100 transition py-2 shadow text-sm font-mono flex items-center justify-center transition-colors duration-200"
                >
                    <button>
                        <HiPlus className=" text-primary w-8 h-8" />
                    </button>
                </div>
            </div>
        </div>
    );
}
