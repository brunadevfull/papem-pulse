export const utils = {
  aoa_to_sheet(data) {
    if (!Array.isArray(data)) {
      throw new TypeError("Expected an array of arrays when building a sheet");
    }

    return {
      __type: "aoa_sheet",
      data: data.map((row) => (Array.isArray(row) ? [...row] : [])),
    };
  },
  book_new() {
    return {
      SheetNames: [],
      Sheets: {},
    };
  },
  book_append_sheet(workbook, worksheet, sheetName) {
    if (!workbook || !worksheet || !sheetName) {
      throw new Error("book_append_sheet requires a workbook, sheet and sheet name");
    }

    if (!workbook.SheetNames.includes(sheetName)) {
      workbook.SheetNames.push(sheetName);
    }

    workbook.Sheets[sheetName] = worksheet;
  },
};

function toCsv(worksheet) {
  const rows = worksheet && Array.isArray(worksheet.data) ? worksheet.data : [];

  return rows
    .map((row) =>
      row
        .map((cell) => {
          if (cell == null) {
            return "";
          }

          const stringValue = String(cell);
          if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes("\"")) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }

          return stringValue;
        })
        .join(",")
    )
    .join("\n");
}

function triggerBrowserDownload(filename, content) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function writeFile(workbook, filename) {
  if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
    return;
  }

  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const csvContent = toCsv(worksheet);

  if (typeof window !== "undefined" && typeof document !== "undefined") {
    triggerBrowserDownload(filename, csvContent);
    return;
  }

    import("fs")
      .then((fsModule) => {
        if (fsModule && fsModule.promises && typeof fsModule.promises.writeFile === "function") {
          return fsModule.promises.writeFile(filename, csvContent, "utf8");
        }

        if (fsModule && typeof fsModule.writeFileSync === "function") {
          fsModule.writeFileSync(filename, csvContent, "utf8");
        }
      })
      .catch((error) => {
        console.warn("xlsx shim could not write the file using fs", error);
      });
}
