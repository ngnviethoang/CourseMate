// import * as XLSX from 'xlsx';
// import {String} from '../share-function/string';
// import ExcelJS from 'exceljs';
// import FileSaver from 'file-saver';


// function s2ab(s: string): ArrayBuffer {
//   const buf: ArrayBuffer = new ArrayBuffer(s.length);
//   const view: Uint8Array = new Uint8Array(buf);
//   for (let i = 0; i !== s.length; ++i) {
//     // tslint:disable-next-line:no-bitwise
//     view[i] = s.charCodeAt(i) & 0xFF;
//   }
//   return buf;
// }

// const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
// const EXCEL_EXTENSION = 'xlsx';
// const PDF_EXTENSION = 'pdf';


// export class ExportExcelFile {
//   workbooks: XLSX.WritingOptions = {bookType: EXCEL_EXTENSION, type: 'binary'};
//   // tslint:disable-next-line:variable-name
//   STR_Arr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

//   private mergeCells(pWorksheet: any, pTitleRow: any, pColumnNumber: number) {
//     pWorksheet.mergeCells(`A${pTitleRow.number}:${this.STR_Arr.charAt((pColumnNumber > 25) ? 25 : pColumnNumber)}${pTitleRow.number}`);
//   }


//   public exportExcelByArrayQuanLyThieuNhiProject(title1: any, title2: any, title3: any, title4: any, title5: any, jsonHeaderTitle: any, jsonDetail: any[]): boolean {
//     const objTitle = JSON.parse(JSON.stringify(jsonHeaderTitle || '{}'));
//     const hRow = new Array<any>();
//     hRow.push('STT');

//     // tslint:disable-next-line:forin
//     for (const ob in objTitle) {
//       hRow.push(objTitle[ob]);
//     }

//     const columnCount = hRow.length - 1;

//     // Create workbook and worksheet
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet(title1);

//     const titleRow1 = worksheet.addRow([title1]);
//     titleRow1.font = {family: 4, size: 16, bold: true};

//     // worksheet.mergeCells(`A${titleRow1.number}:${this.STR_Arr.charAt(hRow.length - 1)}${titleRow1.number}`);
//     this.mergeCells(worksheet, titleRow1, columnCount);

//     // titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true }

//     if (title2 !== '') {
//       const titleRow2 = worksheet.addRow([title2]);
//       // worksheet.mergeCells(`A${titleRow2.number}:${this.STR_Arr.charAt(hRow.length - 1)}${titleRow2.number}`);
//       this.mergeCells(worksheet, titleRow2, columnCount);
//     }

//     if (title3 !== '') {
//       const titleRow3 = worksheet.addRow([title3]);
//       // worksheet.mergeCells(`A${titleRow3.number}:${this.STR_Arr.charAt(hRow.length - 1)}${titleRow3.number}`);
//       this.mergeCells(worksheet, titleRow3, columnCount);
//     }

//     if (title4 !== '') {
//       const titleRow4 = worksheet.addRow([title4]);
//       // worksheet.mergeCells(`A${titleRow4.number}:${this.STR_Arr.charAt(hRow.length - 1)}${titleRow4.number}`);
//       this.mergeCells(worksheet, titleRow4, columnCount);
//     }

//     if (title5 !== '') {
//       const titleRow5 = worksheet.addRow([title5]);
//       // worksheet.mergeCells(`A${titleRow5.number}:${this.STR_Arr.charAt(hRow.length - 1)}${titleRow5.number}`);
//       this.mergeCells(worksheet, titleRow5, columnCount);
//     }

//     worksheet.addRow([]);

//     // Add Header Row
//     const headerRow = worksheet.addRow(hRow);
//     headerRow.font = {family: 4, size: 11, bold: true};
//     let index = 1;

//     worksheet.columns.forEach((column: any) => {
//       if (index === 1) {
//         column.width = 10;
//       } else {
//         column.width = 30;
//       }
//       index++;
//     });

//     // Cell Style : Fill and Border
//     // tslint:disable-next-line:variable-name
//     headerRow.eachCell((cell: any, number: any) => {
//       cell.fill = {
//         type: 'pattern',
//         pattern: 'solid',
//         fgColor: {argb: 'FFFFFF00'},
//         bgColor: {argb: 'FF0000FF'}
//       };
//       cell.border = {top: {style: 'thin'}, left: {style: 'thin'}, bottom: {style: 'thin'}, right: {style: 'thin'}};
//     });

//     // Add Data and Conditional Formatting
//     let i = 1;
//     const objData = JSON.parse(JSON.stringify(jsonDetail || '{}'));
//     // tslint:disable-next-line:forin
//     for (const object in objData) {
//       const row = new Array<any>();
//       row.push(i++);

//       // tslint:disable-next-line:forin
//       for (const objectTitle in jsonHeaderTitle) {
//         if (objData[object][objectTitle] == null) {
//           objData[object][objectTitle] = '';
//         }
//         row.push(objData[object][objectTitle]);
//       }

//       const dataRow = worksheet.addRow(row);
//       // tslint:disable-next-line:variable-name
//       dataRow.eachCell((cell: any, number: any) => {
//         cell.border = {right: {style: 'thin'}};
//       });
//     }


//     worksheet.addRow([]);
//     // Generate Excel File with given name
//     workbook.xlsx.writeBuffer().then((excelBuffer: any) => {
//       this.saveAsExcelFile(excelBuffer, title1);
//     });

//     if (workbook.worksheets.length > 0) {
//       return true;
//     } else {
//       return false;
//     }
//   }


//   private saveAsExcelFile(buffer: any, fileNameDefault: string): void {

//     const data: Blob = new Blob([buffer], {
//       type: EXCEL_TYPE
//     });

//     FileSaver.saveAs(data, fileNameDefault + '_export_' + String.FormatDateTime(new Date()) + '.' + EXCEL_EXTENSION);

//   }
// }
