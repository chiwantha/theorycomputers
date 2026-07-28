"use client";

import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Button from "@/components/button/Button";

const RptAdminSales = () => {
  const generateSalesReport = () => {
    const now = new Date();

    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.width;

    // ================= SAMPLE DATA =================

    const report = {
      totalSales: 1250000,
      invoices: 156,
      avgInvoice: 8012,
      lastActive: 215450,

      cash: 650000,
      card: 420000,
      bank: 80000,
      credit: 100000,

      gross: 1320000,
      discount: 70000,
      net: 1250000,
      refunds: 15000,
    };

    const invoices = [
      ["INV-001245", "08/07/2026", "ABC Computers", "Cash", "95,000"],
      ["INV-001087", "03/07/2026", "John Smith", "Card", "350"],
      ["INV-001120", "05/07/2026", "Walk-In Customer", "Cash", "25,500"],
      ["INV-001300", "10/07/2026", "XYZ Traders", "Credit", "45,000"],
    ];

    // ================= HEADER =================

    doc.setFontSize(16);
    doc.setTextColor(0);

    doc.text("SALES REPORT", 8, 15);

    doc.setFontSize(10);
    doc.setTextColor(100);

    doc.text(`Generated: ${date} ${time}`, pageWidth - 8, 15, {
      align: "right",
    });

    doc.text("Report Period : 01/07/2026 - 10/07/2026", 8, 22);

    // ================= KPI BOX FUNCTION =================

    const drawBox = (x, y, title, value) => {
      doc.setDrawColor(180);

      // Rectangle box
      doc.rect(x, y, 45, 25);

      doc.setFontSize(9);
      doc.setTextColor(80);

      doc.text(title, x + 3, y + 8);

      doc.setFontSize(11);
      doc.setTextColor(0);

      doc.text(value, x + 3, y + 18);
    };

    // ================= SUMMARY BOXES =================

    let y = 32;

    [
      ["Total Sales", "LKR 1,250,000"],
      ["Invoices", "156"],
      ["Avg / Invoice", "LKR 8,012"],
      ["Last Active Day", "LKR 215,450"],
    ].forEach((x, i) => {
      drawBox(8 + i * 48, y, x[0], x[1]);
    });

    // Payment Boxes

    y += 32;

    [
      ["Cash Sales", "650,000"],
      ["Card Sales", "420,000"],
      ["Bank Transfer", "80,000"],
      ["Credit Sales", "100,000"],
    ].forEach((x, i) => {
      drawBox(8 + i * 48, y, x[0], x[1]);
    });

    // Sales Summary

    y += 32;

    [
      ["Gross Sales", "1,320,000"],
      ["Discounts", "70,000"],
      ["Net Sales", "1,250,000"],
      ["Refunds", "15,000"],
    ].forEach((x, i) => {
      drawBox(8 + i * 48, y, x[0], x[1]);
    });

    // ================= ANALYSIS =================

    y += 38;

    doc.setFontSize(12);
    doc.text("Sales Analysis", 8, y);

    doc.setFontSize(10);

    const analysis = [
      "Highest Sales Day       : 08/07/2026 (LKR 245,000)",
      "Lowest Sales Day        : 03/07/2026 (LKR 48,500)",
      "Average Daily Sales     : LKR 125,000",
      "Average Invoice Value   : LKR 8,012",
      "Largest Invoice         : INV-001245 (LKR 95,000)",
      "Smallest Invoice        : INV-001087 (LKR 350)",
      "Total Credit Issued     : LKR 100,000",
      "Outstanding Credit      : LKR 42,000",
      "Returned Items          : 7",
      "Refunded Amount         : LKR 15,000",
    ];

    y += 8;

    analysis.forEach((line) => {
      doc.text("• " + line, 10, y);

      y += 6;
    });

    // ================= PAYMENT =================

    y += 5;

    doc.setFontSize(12);

    doc.text("Payment Breakdown", 8, y);

    y += 8;

    doc.setFontSize(10);

    [
      "Cash              52%",
      "Card              34%",
      "Bank               6%",
      "Credit             8%",
    ].forEach((x) => {
      doc.text(x, 10, y);
      y += 6;
    });

    // ================= INVOICE TABLE =================

    y += 8;

    doc.text("Invoice List", 8, y);

    autoTable(doc, {
      startY: y + 5,

      margin: {
        left: 8,
        right: 8,
      },

      head: [["Invoice", "Date", "Customer", "Payment", "Net"]],

      body: invoices,

      styles: {
        fontSize: 9,
        cellPadding: 3,
      },

      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
      },

      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },

      didDrawPage: () => {
        const h = doc.internal.pageSize.height;

        doc.setFontSize(8);
        doc.setTextColor(100);

        doc.text(`Page ${doc.internal.getNumberOfPages()} | ${date}`, 8, h - 8);

        doc.text("System Developed by K-Chord Pvt Ltd", pageWidth - 8, h - 8, {
          align: "right",
        });
      },
    });

    doc.save("Sales-Report.pdf");
  };

  return (
    <div>
      Comming Soon !
      {/* <Button click={generateSalesReport} name="Generate Sales Report" /> */}
    </div>
  );
};

export default RptAdminSales;
