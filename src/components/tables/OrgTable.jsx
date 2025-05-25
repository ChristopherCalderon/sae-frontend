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

function OrgTable({ organizations, handleStatusChange }) {
  const [sorting, setSorting] = useState([]); //Estado que guarda el sroting de la tabla
  const columnHelper = createColumnHelper(); //Creador de columnas de tanstack

  const columns = [
    columnHelper.accessor("orgName", {
      header: () => "Organizacion",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("isActive", {
      header: () => "Estado",
      cell: (info) => (info.getValue() ? "Habilitada" : "Inhabilitada"),
    }),
    columnHelper.display({
      id: "accion",
      header: () => "Acción",
      cell: ({ row }) => {
        const org = row.original;
        if (org.role === "ORG_Admin") return null;

        return (
          <button
            onClick={() => handleStatusChange(org.orgId, org.isActive)}
            className="bg-white border-2 border-secondary hover:bg-secondary hover:text-white text-secondary font-bold text-xs px-3 py-1 rounded"
          >
            {org.isActive ? "Inhabilitar" : "Habilitar"}
          </button>
        );
      },
    }),
  ];

  //Envio de datos a la tabla------------
  const table = useReactTable({
    data: organizations,
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
    <div className="p-4 font-primary h-full">
      <div className="max-h-full overflow-y-auto overflow-x-auto border border-gray-300 rounded-md shadow-md">
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

export default OrgTable;
