import React from 'react'
import ModeloCard from '@/components/Models/ModelCard';
import { PiOpenAiLogoLight } from "react-icons/pi";
import { GiSpermWhale } from "react-icons/gi";
import { RiGeminiLine } from "react-icons/ri";

function ModelsPage() {
  return (
    <div className='bg-background flex flex-col gap-5 w-full h-full p-8 '>
      <div className='w-full text-primary '>
        <h1 className='text-2xl font-mono font-bold'>Modelos IA</h1>
        <p className='font-mono'>Selecciona o agrega modelos de Inteligencia Artificial</p>
      </div>
      <div className='w-full h-11/12 bg-white shadow-xl '>
        <div className="space-y-12">
          <div className="flex flex-col gap-12 p-6">
            <ModeloCard
              nombre="Open IA"
              icono={<PiOpenAiLogoLight className='w-16 h-16 text-primary' />}
              keys={[
                { key: "Nombre de Key 1", modelo: "Modelo 1" },
                { key: "Nombre de Key 1.1", modelo: "Modelo 1.1"}
              ]}
            />
            <ModeloCard
              nombre="Deepseek"
              icono={<GiSpermWhale className='w-16 h-16 text-primary' />}
              keys={[
                { key: "Nombre de Key 2", modelo: "Modelo 2" }
              ]}
            />
            <ModeloCard
              nombre="Gemini"
              icono={<RiGeminiLine className='w-16 h-16 text-primary' />}
              keys={[
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModelsPage