import {
  Page,
  Text,
  View,
  Document,
  PDFViewer,
  PDFDownloadLink,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { Table, TD, TH, TR } from "@ag-media/react-pdf-table";
import { useSearchParams } from "react-router-dom";
import { Typography } from "@mui/material";
import axios from "axios";
import moment from "moment";
import { baseUrl, frontendUrl, formatAmount } from "../../../environment";
import { useState, useEffect, Fragment } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";

export default function PurchaseSummaryItemPrint() {
  const [loading, setLoading] = useState(true);
  const [printData, setPrintData] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);

  const [reportHeader, setReportHeader] = useState({});
  const [rows, setRows] = useState([]);
  const [date, setDate] = useState(new dayjs(Date()).format("YYYY-MM-DD"));

  const [searchParams] = useSearchParams();

  const [isDataFound, setIsDataFound] = useState(false);

  const [message, setMessage] = useState("");
  const [type, setType] = useState("succeess");

  const resetMessage = () => {
    setMessage("");
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const params = new URLSearchParams(window.location.search);

      const dataParam = params.get("data");

      if (dataParam) {
        const data = JSON.parse(decodeURIComponent(dataParam));

        let paramsRpt = {};

        paramsRpt.requesttype = "PDF";

        if (data?.fromDate) {
          paramsRpt.fromDate = data?.fromDate;
        }

        if (data?.toDate) {
          paramsRpt.toDate = data?.toDate;
        }

        if (data?.supplier) {
          paramsRpt.supplier = data?.supplier;
        }

        if (data?.item) {
          paramsRpt.item = data?.item;
        }

        const response = await axios.get(
          `${baseUrl}/purchasereports/purchase-summary-item-print`,
          {
            params: paramsRpt, // ✅ query params
            responseType: "blob", // ✅ CORRECT PLACE
          },
        );

        const blob = new Blob([response.data], {
          type: "application/pdf",
        });

        setIsDataFound(true);
        const url = URL.createObjectURL(blob);

        setPdfUrl(url); // ✅ show in page
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setIsDataFound(false);
    }
  };

  const downloadReportExcel = async () => {
    let paramsRpt = {};

    // if (selectedSection) {
    //   paramsRpt.section = selectedSection;
    // }

    paramsRpt.requesttype = "EXL";
    const reportResponse = await axios.get(
      `${baseUrl}/purchasereports/supplier-list-print`,
      {
        params: paramsRpt, // ✅ goes to req.query
      },
    );
    console.log("reportResponse", reportResponse.data.data);

    if (reportResponse.data.data.length === 0) {
      setMessage("No Data Found");
      setType("error");
      setLoading(false);
      return;
    }
    // 1️⃣ Prepare Header

    const sheetData = [];
    sheetData.push(["Supplier Name", "Code", "Date", "Phone #"]);

    // 📥 Data Rows
    reportResponse.data.data.forEach((row) => {
      sheetData.push([
        row?.name,
        row?.supplier_code,
        dayjs(row.joinDate).format("DD-MM-YYYY"),
        row?.phone_no,
      ]);
    });

    // 3️⃣ Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(sheetData);

    // 4️⃣ Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Supplierlist");

    const date = new Date();
    // 5️⃣ Download
    XLSX.writeFile(workbook, `Supplierlist_${date}.xlsx`);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }
  return (
    <>
      {message && (
        <CustomizedSnackbars
          reset={resetMessage}
          type={type}
          message={message}
        />
      )}
      {/* <div className="max-w-2xl mx-auto my-10"> */}
      <div className="w-full min-h-screen flex flex-col">
        {/* <div className="w-full h-[600px]"> */}
        {/* PDF Viewer */}
        <div className="w-full flex-1 min-h-[calc(100vh-70px)]">
          {pdfUrl ? (
            <iframe
              src={`${pdfUrl}#zoom=page-width`}
              title="Purchase Summary Supplier PDF"
              className="w-full h-full border-0"
              style={{
                minHeight: "calc(100vh - 70px)",
              }}
            />
          ) : (
            <div className="w-full h-screen flex items-center justify-center">
              <Typography>Loading PDF...</Typography>
            </div>
          )}
        </div>

        {pdfUrl && (
          // <div className="mt-6 flex justify-center gap-3">
          <div className="w-full py-4 flex justify-center gap-3 bg-white">
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = pdfUrl;
                link.download = "SupplierPurchaseSummary.pdf";
                link.click();
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Download PDF
            </button>

            <button
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              onClick={downloadReportExcel}
            >
              Download Excel
            </button>
          </div>
        )}
      </div>
    </>
  );
}
