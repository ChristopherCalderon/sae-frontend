"use client";

import { updateUserStatus } from "@/services/githubService";
import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
} from "@tanstack/react-table";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Loading from "../loader/Loading";
import { createColumnHelper } from "@tanstack/react-table";
import { getSortedRowModel } from "@tanstack/react-table";
import { getFilteredRowModel } from "@tanstack/react-table";
import { FaSort, FaUserCog } from "react-icons/fa";
import { RiGeminiLine } from "react-icons/ri";
import { GiSpermWhale } from "react-icons/gi";
import { PiOpenAiLogoLight } from "react-icons/pi";

function OrgUsersTable({
  users,
  orgId,
  handleStatusChange,
  handleAdminChange,
}) {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [sorting, setSorting] = useState([]); //Estado que guarda el sroting de la tabla
  const columnHelper = createColumnHelper(); //Creador de columnas de tanstack
  const pathname = usePathname();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 9,
  });

  //Icono de proveedor------------------------------------------------------------
  const getProviderIcon = (name, index) => {
    switch (name.toLowerCase()) {
      case "openai":
        return (
          <PiOpenAiLogoLight
            key={index}
            className="text-secondary h-[24px] w-[24px] md:h-[32px] md:w-[32px]"
          />
        );
      case "deepseek":
        return (
          <GiSpermWhale
            key={index}
            className="text-secondary h-[24px] w-[24px] md:h-[32px] md:w-[32px]"
          />
        );
      case "gemini":
        return (
          <RiGeminiLine
            key={index}
            className="text-secondary h-[24px] w-[24px] md:h-[32px] md:w-[32px]"
          />
        );
      default:
        return <div className="w-5 h-5" />;
    }
  };
  //Columnas tanstack---------------------------------------------------------
  const columns = [
    columnHelper.display({
      id: "usuarioYCorreo",
      header: () => "Usuario",
      enableGlobalFilter: false,
      cell: ({ row }) => {
        const login = row.original.name;
        const avatar = row.original.urlAvatar;
        const email = row.original.email;
        return (
          <div className="flex items-center gap-2">
            <img src={avatar} alt={login} className="w-8 rounded-full " />
            <div className="flex flex-col items-start ">
              <span className="font-medium text-sm">{login}</span>
              <span className="text-xs text-gray-500">{email}</span>
            </div>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "modelos",
      header: () => "Modelos",
      enableGlobalFilter: false,
      cell: ({ row }) => {
        const providers = row.original.providers;
        console.log(providers);
        return (
          <div className="flex items-center  justify-center gap-1">
            {providers.length > 0 ? (
              <div className="w-full flex items-center justify-center gap-1">
                {providers.map((provider, index) =>
                  getProviderIcon(provider, index)
                )}
              </div>
            ) : (
              <p className="text-sm font-medium">No hay modelos asignados</p>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor((row) => row.organizations?.[0]?.role, {
      id: "role", // Debes especificar un ID si usas una función como accessor
      header: () => "Rol",
      cell: (info) => info.getValue(),
    }),

    columnHelper.display({
      id: "Estado",
      header: () => "Estado",
      enableGlobalFilter: false,
      cell: ({ row }) => {
        const status = row.original.organizations[0].isActive;
        return (
          <div className="flex items-center gap-2 justify-center">
            <div
              className={`w-4 h-4 rounded-full ${
                status ? "bg-secondary" : "bg-red-500"
              }`}
            >
              {" "}
            </div>
            <p>{status ? "Habilitado" : "Inhabilitado"}</p>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "accion",
      header: () => "Accion",
      cell: (info) => {
        const user = info.row.original;
        const [showActions, setShowActions] = useState(false);
        const dropdownRef = React.useRef(null); // 👈 Referencia al dropdown

        React.useEffect(() => {
          function handleClickOutside(event) {
            if (
              dropdownRef.current &&
              !dropdownRef.current.contains(event.target)
            ) {
              setShowActions(false);
            }
          }

          document.addEventListener("mousedown", handleClickOutside);
          return () => {
            document.removeEventListener("mousedown", handleClickOutside);
          };
        }, []);

        return (
          <div
            className="relative flex items-center justify-center"
            ref={dropdownRef}
          >
            <FaUserCog
              onClick={() => setShowActions((prev) => !prev)}
              className="text-primary hover:text-secondary  font-bold text-[3.3rem] px-3  "
            />

            {showActions && (
              <div className="absolute right-30 mr-2 bottom-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg p-2 z-10">
                {user.organizations[0].isActive &&
                  user.organizations[0].role === "Teacher" && (
                    <button
                      onClick={() => {
                        setShowActions(false);
                        handleAdminChange(orgId, user._id);
                      }}
                      className="block w-full text-left text-sm text-primary px-4 py-2 hover:bg-gray-100"
                    >
                      Asignar Admin
                    </button>
                  )}
                {user.organizations[0].role != "ORG_Admin" && (
                  <button
                    onClick={() => {
                      setShowActions(false);
                      handleStatusChange(
                        orgId,
                        user._id,
                        !user.organizations[0].isActive
                      );
                    }}
                    className="block w-full text-left text-sm text-primary px-4 py-2 hover:bg-gray-100"
                  >
                    Cambiar estado
                  </button>
                )}

                <Link
                  href={{
                    pathname: `${pathname}/${user._id}`,
                    query: {
                      data: btoa(
                        JSON.stringify({
                          email: user.email,
                          name: user.name,
                        })
                      ),
                    },
                  }}
                  className="block w-full text-left text-sm text-primary px-4 py-2 hover:bg-gray-100"
                >
                  Administrar modelos
                </Link>
              </div>
            )}
          </div>
        );
      },
    }),
  ];

  //Envio de datos a la tabla------------
  const table = useReactTable({
    data: users,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-4 font-primary h-full w-11/12 lg:block hidden ">
      <div className="max-h-full overflow-y-auto overflow-x-auto border border-gray-300 rounded-xs shadow-md">
        <table className="min-w-full border border-gray-300 rounded-xs shadow-md">
          <thead className="bg-[#dcdcdc] text-left ">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-sm  cursor-pointer select-none text-center "
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
              <tr
                key={row.id}
                className="border-t bg-white border-[#dcdcdc] font-medium"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3  text-center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.getPageCount() > 1 ? (
        <div className="flex items-center justify-between mt-2 absolute bottom-4 w-4/5 pr-5 overflow-hidden">
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
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default OrgUsersTable;
