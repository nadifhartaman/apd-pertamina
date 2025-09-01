import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const downloadPDF = async () => {
  if (!selectedCameraData) {
    alert("Pilih kamera terlebih dahulu");
    return;
  }

  const element = document.querySelector("#camera-report"); // wrapper dashboard kamera
  if (!element) return;

  // convert ke canvas
  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4"); // potrait, ukuran A4
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

  // Nama file
  pdf.save(`laporan-${selectedCameraData.name}-${new Date().toISOString().split("T")[0]}.pdf`);
};
