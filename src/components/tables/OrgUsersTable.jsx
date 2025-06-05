"use client";

import { updateUserStatus } from "@/services/githubService";
import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Loading from "../loader/Loading";
import { createColumnHelper } from "@tanstack/react-table";
import { getSortedRowModel } from "@tanstack/react-table";
import { getFilteredRowModel } from "@tanstack/react-table";
import { FaSort, FaUserCog } from "react-icons/fa";

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
          <div className="flex items-center  justify-center">
            <div className="flex justify-start w-1/2 gap-5">
              <img src={avatar} alt={login} className="w-10 rounded-full" />
              <div className="flex flex-col">
                <span className="font-medium text-left ">{login}</span>
                <span className="text-sm text-gray-500">{email}</span>
              </div>
            </div>
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
              className="text-primary hover:text-secondary  font-bold text-6xl px-3 py-1 "
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
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="p-4 font-primary h-full w-11/12 lg:block hidden">
      <div className="max-h-full overflow-y-auto overflow-x-auto border border-gray-300 rounded-xs shadow-md">
        <table className="min-w-full border border-gray-300 rounded-xs shadow-md">
          <thead className="bg-[#dcdcdc] text-left ">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-4  cursor-pointer select-none text-center "
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
                  <td key={cell.id} className="px-3 py-2 text-center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrgUsersTable;
