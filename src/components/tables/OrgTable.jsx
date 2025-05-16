"use client";

import { updateUserStatus } from "@/services/githubService";
import React, { useState } from "react";

function OrgTable({ organizations, handleStatusChange }) {
  return (
    <div className="p-4 font-mono h-full">
      <div className="max-h-full overflow-y-auto overflow-x-auto border border-gray-300 rounded-md shadow-md">
        <table className="w-full text-sm table-auto border-collapse ">
          <thead className="bg-secondary text-center sticky top-0 z-10 ">
            <tr>
              <th className="px-2 py-2 border text-[16px] border-gray-300 bg-secondary w-sm">
                Catedrático
              </th>
              <th className="px-2 py-2 border text-[16px] border-gray-300 bg-secondary w-sm">
                Estado
              </th>
            </tr>
          </thead>
          <tbody>
            {organizations.map((u, i) => (
              <tr
                key={i}
                className="border-t border-gray-300 bg-white text-center"
              >
                <td className="px-2 py-2 border border-gray-300">{u.orgName}</td>
                <td className="px-2 py-2 border border-gray-300">
                  {u.role !== "ORG_Admin" && (
                    <button
                      onClick={() => handleStatusChange(u.orgId, u.isActive)}
                      className="bg-secondary hover:bg-primary hover:text-white text-primary font-bold text-xs px-3 py-1 rounded"
                    >
                      {u.isActive ? "Activo" : "Inhabilitado"}
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

export default OrgTable;
