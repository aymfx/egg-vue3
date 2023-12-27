/*
 * @Author: mark
 * @Date: 2023-04-09 10:56:16
 * @LastEditors: mark
 * @LastEditTime: 2023-04-09 22:36:26
 * @FilePath: /PiKa_server/app/service/system/dictType.js
 * @Description: 公共导出模块
 */

// 引入相关模块
const Excel = require("exceljs");
const Service = require("egg").Service;
class ExportExcelService extends Service {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
    this.objUnderlineToHump = ctx.objUnderlineToHump;
    this.objHumpToUnderline = ctx.objHumpToUnderline;
    this.toInt = ctx.toInt;
  }

  /**
   * 通用普通表格的导出
   * @param {*} columns  { header: '列1', key: 'col1', width: 10 },
   * @param {*} data
   */
  async publicDownLoad(columns, data) {
    // 创建excel文件
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");
    worksheet.columns = columns;
    data.forEach((item) => {
      let addObj = {};
      columns.forEach((col) => {
        addObj[col.key] = item[col.key];
      });
      worksheet.addRow(addObj);
    });

    // 生成excel文件流
    const buffer = await workbook.xlsx.writeBuffer();

    // 设置响应头
    this.ctx.set(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    this.ctx.set("Content-Disposition", "attachment; filename=table.xlsx");

    // 返回excel文件流
    this.ctx.body = buffer;
  }
}

module.exports = ExportExcelService;
