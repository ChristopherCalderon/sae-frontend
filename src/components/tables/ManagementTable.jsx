'use client';

import React, { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

import { usePathname } from "next/navigation";
import Link from 'next/link';

const initialUsers = Array.from({ length: 13 }).map((_, i) => ({
  subject: 'Fundamentos del programacion',
  professor: '',
}));


function AssignmentsTable({classes, teachers}) {
  const pathname = usePathname();


  return (
    <div className="p-4 font-mono h-full">
      <div className="max-h-full overflow-y-auto overflow-x-auto border border-gray-300 rounded-md shadow-md">
        <table className="w-full text-sm table-auto border-collapse">
          <thead className="bg-secondary text-left sticky top-0 z-10">
            <tr>
              <th className="px-2 py-2 border text-[16px] border-gray-300 bg-secondary w-sm">Catedrático</th>
              <th className="px-2 py-2 border text-[16px] border-gray-300 bg-secondary w-sm">Correo electronico</th>
              <th className="px-2 py-2 border text-[16px] border-gray-300 bg-secondary">Modelos</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((u, i) => (
              <tr key={i} className="border-t border-gray-300 bg-white">
                <td className="px-2 py-2 border border-gray-300">{u.name}</td>
                <td className="px-2 py-2 border border-gray-300">{u.email}</td>
                <td className="px-2 py-2 border border-gray-300">
                  <Link href={{
                      pathname: `${pathname}/${u._id}`,
                      query: {
                        data: btoa(
                          JSON.stringify({
                            email: u.email,
                          })
                        ),
                      },
                    }} className="bg-blue-200 hover:bg-blue-400 hover:text-white text-primary font-bold text-sm px-3 py-1 rounded">
                    Administrar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AssignmentsTable;