"use client";

import { updateUserStatus } from "@/services/githubService";
import React, { useState } from "react";

function UsersTable({ users, orgId, handleStatusChange, handleAdminChange }) {
  return (
    <div className="p-4 font-mono h-full">
      <div className="max-h-full overflow-y-auto overflow-x-auto border border-gray-300 rounded-md shadow-md">
        <table className="w-full text-sm table-auto border-collapse">
          <thead className="bg-secondary text-left sticky top-0 z-10">
            <tr>
              <th className="px-2 py-2 border text-[16px] border-gray-300 bg-secondary w-sm">
                Catedrático
              </th>
              <th className="px-2 py-2 border text-[16px] border-gray-300 bg-secondary w-sm">
                Rol
              </th>
              <th className="px-2 py-2 border text-[16px] border-gray-300 bg-secondary w-sm">
                Estado
              </th>
              <th className="px-2 py-2 border text-[16px] border-gray-300 bg-secondary w-sm">
                Administrador
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i} className="border-t border-gray-300 bg-white">
                <td className="px-2 py-2 border border-gray-300">{u.name}</td>
                <td className="px-2 py-2 border border-gray-300">{u.role}</td>
                <td className="px-2 py-2 border border-gray-300">
                  <button
                    onClick={() =>
                      handleStatusChange(orgId, u._id, !u.isActive)
                    }
                    className="bg-secondary hover:bg-primary hover:text-white text-primary font-bold text-xs px-3 py-1 rounded"
                  >
                    {u.isActive ? "Activo" : "Inhabilitado"}
                  </button>
                </td>

                <td className="px-2 py-2 border border-gray-300">
                  {u.role === "Teacher" && u.isActive && (
                    <button
                      onClick={() =>
                        handleAdminChange(orgId, u._id)
                      }
                      className="bg-secondary hover:bg-primary hover:text-white text-primary font-bold text-xs px-3 py-1 rounded"
                    >
                      Asignar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersTable;
