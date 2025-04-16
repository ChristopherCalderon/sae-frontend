import React from "react";
import { FaGithub } from "react-icons/fa";
import ReactMarkdown from 'react-markdown';

const markdownText = `
# 🔵 Ejercicio X: Números primos en un rango

### 📂 Nombre del archivo: \`numeros_primos_rango.cpp\`

📌 **Entrada:** Estándar  
📌 **Salida:** Estándar  
📌 **Estilo:** [Guía de Estilo de Google para C++](https://google.github.io/styleguide/cppguide.html)

## 📝 Descripción

Escribe un programa que reciba dos números enteros (inicio y fin) y muestre todos los números primos en ese rango.

## 📌 Entrada

- Dos números enteros: inicio y fin del rango, en líneas separadas.

## 📌 Salida

- Cada número primo del rango, uno por línea. Si no hay números primos, no se muestra nada.

## 🏗️ Reglas de implementación

### ✅ **Formato y estilo**

1. **Indentación y espaciado:** Usa **2 espacios** para la indentación (evita tabs).
2. **Llaves:** Siempre usa llaves \`{}\` en bloques de control, incluso si tienen una sola línea.
3. **Líneas de código:** Máximo **80 caracteres** por línea.

### 🏷️ **Nombres de variables y funciones**

- Usa **snake_case** para variables y funciones.
- Usa **nombres descriptivos** y evita abreviaciones.

### 📝 **Comentarios**

1. Explica cómo funciona la verificación de número primo.
2. Usa comentarios para aclarar bucles anidados.

## 🔍 Ejemplo

### Entrada:

\`\`\`txt
10
20
\`\`\`

### Salida:

\`\`\`txt
11
13
17
19
\`\`\`

## 🚀 Notas adicionales

- Se recomienda crear una función bool \`es_primo(int n)\` para la verificación.
`;

function entrega() {
  return (
    <div className="bg-background flex flex-col gap-5 w-full h-full p-8 overflow-clip">
      <div className="w-full text-primary flex items-center justify-between ">
        <div>
          <h1 className="text-2xl font-bold">@UserGithub</h1>
          <p className="font-semibold">Nombre de tarea</p>
        </div>
      </div>
      <div className="w-full h-[90%] flex flex-col gap-4 bg-white shadow-xl overflow-clip px-5 py-5 rounded-md text-primary text-sm">
        {/* Contenedor de informacion */}
        <div className="flex w-full justify-between">
          {/* Informacion de retroalimentacion */}
          <div className="flex flex-col">
            <h1 className="font-bold">
              PROGRAMACION-DE-ESTRUCTURAS-DINAMICAS-Sección-01-CICLO-02/2025
            </h1>
            <p>Workflow</p>
            <p>Estado</p>
            <p>Conclusion</p>
            <span className="flex gap-5">
              <p>
                Calificacion: <a className="text-accent font-semibold">10/10</a>
              </p>
              <a className="flex gap-1 items-center underline hover:font-semibold">
                <FaGithub className="text-lg" /> Ver ejecucion en github
              </a>
            </span>
            <p className="font-semibold">Feedback powered by OpenAI</p>
          </div>
          {/* Botones de retroalimentacion */}
          <div className="flex flex-col gap-1 justify-center">
            <button className="flex items-center justify-center gap-2 font-semibold bg-primary text-white hover:text-white px-5 hover:bg-primary-hover py-2 rounded shadow-lg">
              Editar retroalimentacion
            </button>
            <button className="flex items-center justify-center gap-2 font-semibold bg-primary text-white hover:text-white px-5 hover:bg-primary-hover py-2 rounded shadow-lg">
              Agregar pull request
            </button>
            <button className="flex items-center justify-center gap-2 font-semibold bg-primary text-white hover:text-white px-5 hover:bg-primary-hover py-2 rounded shadow-lg">
              Volver a generar
            </button>
          </div>
        </div>

        {/* Contenedor de feedback */}
        <div
          className="w-full h-3/4 p-5 rounded-md shadow-md overflow-y-scroll bg-background   [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-background
        [&::-webkit-scrollbar-thumb]:bg-primary"
        >
          <ReactMarkdown>{markdownText}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export default entrega;
