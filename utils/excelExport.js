const ExcelJS = require('exceljs');

exports.exportToExcel = async (data, sheetName = 'Sheet1') => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    if (data.length === 0) return workbook.xlsx.writeBuffer();

    worksheet.columns = Object.keys(data[0]).map(key => ({
        header: key,
        key,
        width: 20,
    }));

    data.forEach(item => {
        worksheet.addRow(item);
    });

    return await workbook.xlsx.writeBuffer();
};
