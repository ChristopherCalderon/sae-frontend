"use client";
import {
  generateFeedback,
  getAssignmentConfig,
  getFeedback,
  getRepoData,
  postFeedback,
} from "@/services/githubService";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
} from "@tanstack/react-table";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Loading from "../loader/Loading";
import { createColumnHelper } from "@tanstack/react-table";
import { getSortedRowModel } from "@tanstack/react-table";
import { getFilteredRowModel } from "@tanstack/react-table";
import { FaSort } from "react-icons/fa";

//Funciones-------------------------------------------------------------------------------------------------
//Define el color del estado
function getFeedbackColor(status) {
  if (status === "Enviado") return "bg-secondary";
  if (status === "Pendiente") return "bg-[#710000]";
  return "bg-primary";
}

//Funcion para recoger la informacion de repositorios
const getData = async (repoName, org, extension) => {
  try {
    const response = await getRepoData(repoName, org, extension);
    return response;
  } catch (error) {
    console.log(error);
  }
};

const getConfig = async (id) => {
  try {
    const response = await getAssignmentConfig(id);
    return response;
  } catch (error) {
    console.log(error);
  }
};

//Funcion que genera feedback de la tarea seleccionada
const generateOne = async (
  repo,
  id,
  setLoading,
  setSuccessMessage,
  getFeedbacks,
  config,
  org,
  teacher
) => {
  setLoading(true);
  try {
    const repoData = await getData(repo.repository.name, org, config.extension);
    await generateFeedback(repo, repoData, config, teacher);
    setSuccessMessage("Generado correctamente");
  } catch (error) {
    console.log("Error al generar retroalimentación", error);
    setSuccessMessage("Error al generar retroalimentación");
  } finally {
    setLoading(false);
    setTimeout(() => setSuccessMessage(null), 2000);
    getFeedbacks();
  }
};

const generateAll = (repos) => {
  repos.array.forEach((repo) => {
    generateOne(repo, id, setLoading, setSuccessMessage, getFeedback);
  });
};

//Componente-------------------------------------------------------------------------------------------
function AssignmentsTable({
  submissions,
  id,
  getFeedbacks,
  config,
  org,
  globalFilter,
  setGlobalFilter,
  teacher,
}) {
  const pathname = usePathname(); //Pathname para guardar la ruta actual
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [sorting, setSorting] = useState([]); //Estado que guarda el sroting de la tabla
  const columnHelper = createColumnHelper(); //Creador de columnas de tanstack
  //Paginacion
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 8,
  });

  //Columnas tanstack---------------------------------------------------------
  const columns = [
    columnHelper.display({
      id: "usuarioYCorreo",
      header: () => "Usuario",
      enableGlobalFilter: false,
      cell: ({ row }) => {
        const login = row.original.students?.[0]?.login;
        const avatar = row.original.students?.[0]?.avatar_url;
        const email = row.original.email;
        return (
          <div className="flex items-center gap-2 pl-2">
            <img src={avatar} alt={login} className="w-8 rounded-full " />
            <div className="flex flex-col items-start ">
              <span className="font-medium text-sm">{login}</span>
              <span className="text-xs text-gray-500">{email}</span>
            </div>
          </div>
        );
      },
    }),

    columnHelper.accessor((row) => row.repository.name, {
      id: "repo",
      header: () => "Repositorio",
      enableGlobalFilter: false,
      cell: (info) => {
        const row = info.row.original;
        return (
          <a
            className="text-secondary text-xs underline hover:font-semibold"
            href={row.repository.html_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {info.getValue()}
          </a>
        );
      },
    }),
    columnHelper.accessor("grade_test", {
      header: () => "Nota de Test",

      enableGlobalFilter: false,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("grade_feedback", {
      header: () => "Nota de Retroalimentacion",

      enableGlobalFilter: false,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("feedback_status", {
      header: () => "Estado",

      enableGlobalFilter: false,
      cell: (info) => (
        <div className="flex gap-1 justify-center items-center">
          <div
            className={`w-3 h-3 rounded-full  ${getFeedbackColor(
              info.getValue()
            )}`}
          ></div>
          <span className="text-center">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Acción",
      cell: (info) => {
        const u = info.row.original;
        if (u.feedback_status === "Pendiente") {
          return (
            <button
              onClick={() =>
                generateOne(
                  u,
                  id,
                  setLoading,
                  setSuccessMessage,
                  getFeedbacks,
                  config,
                  org,
                  teacher
                )
              }
              className=" border-secondary border-2 text-secondary hover:bg-secondary hover:text-white font-bold text-xs px-3 py-1 rounded"
            >
              Generar
            </button>
          );
        } else if (
          u.feedback_status === "Generado" ||
          u.feedback_status === "Enviado"
        ) {
          return (
            <Link
              href={{
                pathname: `${pathname}/${u.id}`,
                query: {
                  data: btoa(
                    JSON.stringify({
                      email: u.email,
                      repo: u.assignment.id,
                      org: org,
                      assignment: u.assignment.title,
                      name: u.students[0].name,
                    })
                  ),
                },
              }}
              className=" border-secondary border-2 text-secondary hover:bg-secondary hover:text-white  font-bold text-xs px-3 py-1 rounded"
            >
              Ver
            </Link>
          );
        } else {
          return null;
        }
      },

      enableGlobalFilter: false,
    }),
  ];

  //Envio de datos a la tabla------------
  const table = useReactTable({
    data: submissions,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  //Componente-----------------------------------------------------------------------
  return (
    <div className=" px-4 overflow-x-hidden lg:flex lg:flex-col lg:justify-center hidden h-full mt-1 ">
      {/* Modal loader */}
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center z-10">
          <div className="bg-white p-10 rounded shadow-md text-center">
            <Loading />
            <p className="text-sm font-semibold">
              Generando retroalimentación...
            </p>
          </div>
        </div>
      )}

      {/* Success message */}
      {successMessage && (
        <div className="absolute inset-0  flex justify-center items-center z-10">
          <div className="bg-white p-10 rounded shadow-md text-center">
            {successMessage}
          </div>
        </div>
      )}
      {/* Tabla */}
      <table className="min-w-full text-sm border border-gray-300 rounded-xs shadow-md">
        <thead className="bg-[#dcdcdc] text-left">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-2 cursor-pointer select-none text-center "
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center text-center justify-center">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    <FaSort />
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t bg-white border-[#dcdcdc]">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-3 py-2 text-center">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {table.getPageCount() > 1 ? (  
        <div className="flex items-center justify-between mt-3 w-full pr-10 overflow-hidden">
       {/* Botón “Anterior” */}
        <div className="flex gap-1">
          <button
            className=" items-center justify-center gap-2 font-semibold bg-white border-2 border-secondary text-secondary hover:text-white px-2 hover:bg-secondary  rounded shadow-lg"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </button>
          {/* Botón “Siguiente” */}
          <button
            className=" items-center justify-center gap-2 font-semibold bg-white border-2 border-secondary text-secondary hover:text-white px-2 hover:bg-secondary py-1 rounded shadow-lg"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </button>
        </div>

        {/* Texto “Página X de Y” */}
        <span>
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount()}
        </span>
      </div>) : ""}
    
    </div>
  );
}

export default AssignmentsTable;
