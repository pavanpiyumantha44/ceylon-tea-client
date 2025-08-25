import React, { useRef } from "react";
import html2pdf from "html2pdf.js";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const Report = ({ title, logo, date, summary, chartData, tableData, footerNote, previewMode = true }) => {
  const reportRef = useRef();

  const handleDownload = () => {
    if (!reportRef.current) return;

    const element = reportRef.current;

    const opt = {
      margin: 0.5,
      filename: `${(title || "Report").replace(/\s+/g, "_")}_${date || "Unknown"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div>
      {/* Report Preview (optional) */}
      {previewMode && (
        <div ref={reportRef} className="bg-white shadow-lg rounded-2xl p-8 my-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4 mb-6">
            <div className="flex items-center space-x-4">
              {logo && <img src={logo} alt="Logo" className="h-14 w-14 object-contain" />}
              <h1 className="text-2xl font-bold text-green-700">{title}</h1>
            </div>
            <span className="text-gray-500">{date}</span>
          </div>

          {/* Summary */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Summary</h2>
            <p className="text-gray-600">{summary}</p>
          </div>

          {/* Chart */}
          {chartData && (
            <div className="mb-8 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2f855a" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Table */}
          {tableData && (
            <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-green-700 text-white">
                  {Object.keys(tableData[0]).map((col, i) => (
                    <th key={i} className="px-4 py-2 text-left">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, i) => (
                  <tr key={i} className="odd:bg-gray-100 even:bg-white">
                    {Object.values(row).map((val, j) => (
                      <td key={j} className="px-4 py-2 border">{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Footer */}
          {footerNote && (
            <div className="mt-8 pt-4 border-t text-sm text-gray-500 text-center">
              {footerNote}
            </div>
          )}
        </div>
      )}

      {/* Download Button */}
      <div className="flex justify-end">
        <button
          onClick={handleDownload}
          className="bg-green-700 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-800 transition"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default Report;
