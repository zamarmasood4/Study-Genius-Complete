// utils/summaryToPdf.js
import jsPDF from "jspdf";

export const summaryToPdf = (summaryText) => {
  const pdf = new jsPDF();
  const lines = pdf.splitTextToSize(summaryText, 180);

  pdf.text(lines, 10, 10);

  const blob = pdf.output("blob");
  return new File([blob], "video-summary.pdf", {
    type: "application/pdf",
  });
};
