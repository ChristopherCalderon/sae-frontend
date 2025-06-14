import { useState } from "react";
import ExcelJS from "exceljs";
import { IoMdDownload } from "react-icons/io";

const ExcelButton = ({ data, setModal }) => {
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tareas Estudiantes");

    // Definir columnas
    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Entregado", key: "submitted", width: 10 },
      { header: "Aprobado", key: "passing", width: 10 },
      { header: "Commits", key: "commit_count", width: 10 },
      { header: "Nota de Test", key: "grade", width: 15 },
      { header: "Nota de Retroalimentacion", key: "grade_feedback", width: 20 },
      { header: "Nota final", key: "grade_final", width: 15 },
      { header: "Estudiante", key: "studentName", width: 25 },
      { header: "GitHub", key: "github", width: 20 },
      { header: "Tarea", key: "assignmentTitle", width: 30 },
      { header: "Repositorio", key: "repoName", width: 30 },
      { header: "URL Repositorio", key: "repoUrl", width: 40 },
    ];

    // Añadir datos
    data.forEach((item) => {
      let gradePoints = "";
      if (item.grade) {
        gradePoints = item.grade.includes("/")
          ? item.grade.split("/")[0].trim()
          : item.grade.trim();
      }

      let final_grade = (item.grade_test + item.grade_feedback) / 2;
      worksheet.addRow({
        id: item.id,
        submitted: item.submitted ? "Sí" : "No",
        passing: item.passing ? "Sí" : "No",
        commit_count: item.commit_count,
        grade: item.grade_test || "",
        grade_feedback: item.grade_feedback || "",
        grade_final: final_grade || "",
        studentName: item.students[0]?.name || "",
        github: item.students[0]?.login || "",
        assignmentTitle: item.assignment.title,
        repoName: item.repository.name,
        repoUrl: item.repository.html_url,
      });
    });

    // Estilo para la cabecera
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9D9D9" },
      };
    });

    // Generar archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tareas_estudiantes.xlsx";
    a.click();
    URL.revokeObjectURL(url);

    setModal('Excel exportado');
  };

  return (
    <button
      onClick={exportToExcel}
      className="flex w-4/5 lg:w-full items-center justify-center gap-2 font-semibold bg-white border-2 border-secondary text-secondary hover:text-white px-5 hover:bg-secondary py-1 rounded shadow-lg"
    >
      <IoMdDownload className="text-xl" />
      Exportar a Excel
    </button>
  );
};

export default ExcelButton;
