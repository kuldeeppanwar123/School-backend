import exceljs from 'exceljs'

export function constructStudentXlsxTemplate(){
  let workbook = new exceljs.Workbook();
  let worksheet = workbook.addWorksheet("Worksheet")

  let columns = ['firstname', 'lastname','gender','bloodGroup', 'dob','address','city','district', 'state', 'country', 'pincode','parentName','phone','email', 'qualification', 'occupation']
  let row = ['(REQUIIRED)', '(REQUIIRED)','(REQUIIRED)','(OPTIONAL)', '(OPTIONAL)','(OPTIONAL)','(OPTIONAL)','(OPTIONAL)', '(OPTIONAL)', '(OPTIONAL)', '(OPTIONAL)','(REQUIRED)','(REQUIRED)','(OPTIONAL)', '(OPTIONAL)', '(OPTIONAL)']
  worksheet.columns = columns.map(el=>({header:el, key:el, width:20}));
  worksheet.insertRow(2,row)
  return workbook;
}