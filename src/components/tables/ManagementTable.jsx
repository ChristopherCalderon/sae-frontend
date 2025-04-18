'use client';

import React, { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

import { usePathname } from "next/navigation";
import Link from 'next/link';

const initialUsers = Array.from({ length: 13 }).map((_, i) => ({
  subject: 'Fundamentos del programacion',
  professor: '',
}));

const professors = [
  'Nestor Aldana',
  'Enmanuel Araujo',
  'Marlene Aguilar',
  'Elisa Aldana',
  'Miguel Rivas',
  'Guillermo Cortez',
];

function AssignmentsTable() {
  const [users, setUsers] = useState(initialUsers);
  
  const pathname = usePathname();

  const handleProfessorChange = (index, newProfessor) => {
    const updatedUsers = [...users];
    updatedUsers[index].professor = newProfessor;
    setUsers(updatedUsers);
  };

  return (
    <div className="p-4 font-mono h-full">
      <div className="max-h-full overflow-y-auto overflow-x-auto border border-gray-300 rounded-md shadow-md">
        <table className="w-full text-sm table-auto border-collapse">
          <thead className="bg-secondary text-left sticky top-0 z-10">
            <tr>
              <th className="px-2 py-2 border text-[16px] border-gray-300 bg-secondary">Asignatura</th>
              <th className="px-2 py-2 border text-[16px] border-gray-300 bg-secondary w-sm">Catedrático</th>
              <th className="px-2 py-2 border text-[16px] border-gray-300 bg-secondary">Modelos</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i} className="border-t border-gray-300 bg-white">
                <td className="px-2 py-2 border border-gray-300">{u.subject}</td>
                <td className="px-2 py-2 border border-gray-300">
                  <div className="relative w-full">
                    <select
                      value={u.professor}
                      onChange={(e) => handleProfessorChange(i, e.target.value)}
                      className="w-full px-3 py-2 bg-background rounded appearance-none focus:outline-none"
                    >
                      <option value="">Seleccionar catedrático</option>
                      {professors.map((prof, idx) => (
                        <option key={idx} value={prof}>
                          {prof}
                        </option>
                      ))}
                    </select>
                    <IoIosArrowDown className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none text-lg" />
                  </div>
                </td>
                <td className="px-2 py-2 border border-gray-300">
                  <Link href={`${pathname}/Asignatura`} className="bg-blue-200 hover:bg-blue-400 hover:text-white text-primary font-bold text-sm px-3 py-1 rounded">
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