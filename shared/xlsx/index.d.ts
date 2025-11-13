export interface Worksheet {
  __type: "aoa_sheet";
  data: (string | number | null | undefined)[][];
}

export interface Workbook {
  SheetNames: string[];
  Sheets: Record<string, Worksheet>;
}

export type AOAToSheetOptions = Record<string, never>;

export declare const utils: {
  aoa_to_sheet(data: (string | number | null | undefined)[][], opts?: AOAToSheetOptions): Worksheet;
  book_new(): Workbook;
  book_append_sheet(workbook: Workbook, worksheet: Worksheet, sheetName: string): void;
};

export declare function writeFile(workbook: Workbook, filename: string): void;
