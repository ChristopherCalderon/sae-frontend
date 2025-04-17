import React from "react";

const users = Array.from({ length: 13 }).map((_, i) => ({
  subject: "Fundamentos del programacion",
  section: "01",
  professor: "Nestror Aldana",
  students: "125",
}));

function AssignmentsTable() {
  return (
    <div className="p-4 overflow-x-auto font-mono">
      <table className="min-w-full text-sm border border-gray-300 rounded-md shadow-md table-auto">
  <thead className="bg-secondary text-left">
    <tr>
      <th className="px-4 py-2 border border-gray-300">Asignatura</th>
      <th className="px-4 py-2 border border-gray-300">Sección</th>
      <th className="px-4 py-2 border border-gray-300">Catedrático</th>
      <th className="px-4 py-2 border border-gray-300">Estudiantes</th>
      <th className="px-4 py-2 border border-gray-300">Modelos</th>
    </tr>
  </thead>
  <tbody>
    {users.map((u, i) => (
      <tr key={i} className="border-t border-gray-300">
        <td className="px-4 py-2 border border-gray-300">{u.subject}</td>
        <td className="px-4 py-2 border border-gray-300">{u.section}</td>
        <td className="px-4 py-2 border border-gray-300">{u.professor}</td>
        <td className="px-4 py-2 border border-gray-300">{u.students}</td>
        <td className="px-4 py-2 border border-gray-300">
          <button className="bg-secondary hover:bg-primary hover:text-white text-primary font-bold text-xs px-3 py-1 rounded">
            Administrar
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
}

export default AssignmentsTable;
