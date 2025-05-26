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

function UsersTable({ users, orgId, handleStatusChange, handleAdminChange }) {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [sorting, setSorting] = useState([]); //Estado que guarda el sroting de la tabla
  const columnHelper = createColumnHelper(); //Creador de columnas de tanstack

  //Columnas tanstack---------------------------------------------------------
  const columns = [
    columnHelper.display({
      id: "usuarioYCorreo",
      header: () => "Usuario",
      enableGlobalFilter: false,
      cell: ({ row }) => {
        const login = row.original.name;
        const avatar = "https://avatars.githubusercontent.com/u/149279708?v=4";
        const email = row.original.email;
        return (
          <div className="flex items-center gap-2 justify-center">
            <img src={avatar} alt={login} className="w-10 rounded-full" />
            <div className="flex flex-col">
              <span className="font-medium text-left ">{login}</span>
              <span className="text-sm text-gray-500">{email}</span>
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor("role", {
      header: () => "Rol",
      cell: (info) => info.getValue(),
    }),

    columnHelper.display({
      id: "Estado",
      header: () => "Estado",
      enableGlobalFilter: false,
      cell: ({ row }) => {
        const status = row.original.isActive;
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

    if (user.role === "ORG_Admin" ) return null;

    return (
      <div className="relative flex items-center justify-center" ref={dropdownRef}>
        
          <FaUserCog 
          onClick={() => setShowActions((prev) => !prev)}
          className="text-primary hover:text-secondary  font-bold text-6xl px-3 py-1 "
        />

        {showActions && (
          <div className="absolute right-30 mr-2 bottom-0 w-40 bg-white border border-gray-200 rounded-md shadow-lg p-2 z-10">
            {user.isActive && user.role === 'Teacher' &&
            <button
              onClick={() => {
                setShowActions(false);
                handleAdminChange(orgId, user._id);
              }}
              className="block w-full text-left text-sm text-primary px-4 py-2 hover:bg-gray-100"
            >
              Asignar Admin
            </button>}
            <button
              onClick={() => {
                setShowActions(false);
                handleStatusChange(orgId, user._id, !user.isActive);
              }}
              className="block w-full text-left text-sm text-primary px-4 py-2 hover:bg-gray-100"
            >
              Cambiar estado
            </button>
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
    <div className="p-4 font-primary h-full w-full lg:block hidden">
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

export default UsersTable;
