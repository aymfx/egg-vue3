/*
 * @Author: mark
 * @Date: 2023-07-02 21:13:59
 * @LastEditors: mark
 * @LastEditTime: 2023-08-24 06:45:58
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/service/tool/gen.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
const Service = require("egg").Service;
const { Op } = require("sequelize");
class GenService extends Service {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.GenTable = ctx.model.GenTable;
    this.GenTableColumn = ctx.model.GenTableColumn;
    this.Model = ctx.model;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
    this.underlineToBigHump = ctx.underlineToBigHump;
    this.underlineToHump = ctx.underlineToHump;
    this.objUnderlineToHump = ctx.objUnderlineToHump;
    this.objHumpToUnderline = ctx.objHumpToUnderline;
    this.toInt = ctx.toInt;
    this.getUserData = ctx.getUserData;
  }

  /**
   * 分页查询
   * @param {*} params
   */
  async list(params) {
    let select = params.pageSize ? 1 : 0;
    params = this.dealQuery(params);
    let data;
    data = await this.GenTable.findAndCountAll(
      Object.assign(params, { raw: true })
    );
    let total = data.count;
    let rows = data.rows;
    rows = rows.map((item) => {
      return this.objUnderlineToHump(item);
    });
    return select
      ? this.ServerResponse.createBySuccessMsgAndData(
          "请求成功",
          {},
          {
            rows,
            total,
          }
        )
      : this.ServerResponse.createBySuccessData(rows);
  }

  /**
   * 查询数据表
   * @param {*} params
   * @returns
   */
  async DBlist(params) {
    let { pageNum, pageSize, tableName, tableComment } = params;
    let rows = await this.Model
      .query(`SELECT table_name,table_comment,create_time,update_time 
        FROM information_schema.TABLES 
        WHERE table_schema = '${this.config.sequelize.database}'
          AND table_name NOT IN (
            SELECT table_name FROM gen_table
          )
        AND (table_name LIKE '%${tableName || ""}%' AND table_comment LIKE '%${
      tableComment || ""
    }%')
      ORDER BY table_name
      LIMIT ${pageSize}
      OFFSET ${(pageNum - 1) * pageSize}
        `);
    rows = rows[0].map((item) => {
      return this.objUnderlineToHump(item);
    });
    let total = await this.Model.query(`SELECT count(*)
        FROM information_schema.TABLES 
        WHERE table_schema = '${this.config.sequelize.database}'
          AND table_name NOT IN (
            SELECT table_name FROM gen_table
          )
        AND (table_name LIKE '%${tableName || ""}%' AND table_comment LIKE '%${
      tableComment || ""
    }%')
      ORDER BY table_name
        `);
    total = total[0][0]["count(*)"];
    return this.ServerResponse.createBySuccessMsgAndData(
      "请求成功",
      {},
      {
        rows,
        total,
      }
    );
  }

  /**
   * 处理查询的参数
   */
  dealQuery(params) {
    let query = {
      where: {},
      order: [],
    };
    if (params.pageSize && params.pageNum) {
      query.limit = this.toInt(params.pageSize);
      query.offset = (this.toInt(params.pageNum) - 1) * query.limit;
    }
    //表名称
    if (params.tableName) {
      query.where.table_name = {
        [Op.like]: `%${params.tableName}%`,
      };
    }
    //表描述
    if (params.tableComment) {
      query.where.table_comment = {
        [Op.like]: `%${params.tableComment}%`,
      };
    }
    //查询创建时间
    if (params["params[beginTime]"]) {
      query.where.create_time = {
        [Op.between]: [params["params[beginTime]"], params["params[endTime]"]],
      };
    }
    return query;
  }

  /**
   * 导入数据库
   * @param {*} params
   */
  async importTable(params) {
    let name = await this.getUserData(this.ctx.headers.authorization);
    name = name.userName;
    let query = params.tables.split(",").join("','");
    query = "'" + query + "'";
    //查询所有的表数据
    let tables = await this.Model.query(
      `SELECT table_name,table_comment,create_time,update_time FROM information_schema.TABLES WHERE table_name IN (${query}) AND table_schema = '${this.config.sequelize.database}'`
    );
    tables = tables[0];
    for (var key = 0; key < tables.length; key++) {
      //查询表下所有列的数据
      let col = await this.Model.query(
        `select table_name,column_name,column_default,is_nullable,data_type,column_type,column_comment,column_key,extra from information_schema.columns where table_name = '${tables[key].TABLE_NAME}' AND table_schema = '${this.config.sequelize.database}';`
      );
      col = col[0];
      let setTableKey = this.objHumpToUnderline(
        this.objUnderlineToHump(tables[key])
      );
      setTableKey.class_name = this.underlineToBigHump(setTableKey.table_name);
      setTableKey.function_name = setTableKey.table_comment
        .split("表")
        .join("");
      setTableKey.business_name = this.underlineToHump(
        setTableKey.table_name.split("_").slice(1).join("_")
      );
      if (setTableKey.table_name.indexOf("sys_") > -1) {
        setTableKey.module_name = "system";
      }
      //添加作者和包名
      setTableKey.function_author = name;
      setTableKey.package_name =
        (setTableKey.module_name ? setTableKey.module_name : "") +
        "/" +
        setTableKey.business_name;
      //查询当前添加表是否在genTable这个数据表中，若存在则不新创建，若不存在则新创建
      let setTable;
      let tableId;
      let isTable = await this.GenTable.findAll({
        where: {
          table_name: tables[key].table_name,
        },
        raw: true,
      });
      if (isTable.length) {
        setTable = isTable[0];
        tableId = setTable.table_id;
        //删除原始的列数据
        await this.GenTableColumn.destroy({
          where: {
            table_id: tableId,
          },
        });
      } else {
        setTable = await this.GenTable.create(setTableKey);
        tableId = setTable.table_id;
      }

      let add = col.map((item) => {
        let setData = this.objHumpToUnderline(this.objUnderlineToHump(item));
        //匹配两个数据 查询出的数据对比数据表中需要存入的数据
        setData.table_id = tableId;
        setData.is_pk = setData.column_key == "PRI" ? "1" : "0";
        delete setData.column_key;
        setData.java_type = setData.data_type;
        delete setData.data_type;
        setData.is_required = setData.is_nullable == "NO" ? "1" : "0";
        delete setData.is_nullable;
        setData.is_increment = setData.extra == "auto_increment" ? "1" : "0";
        delete setData.extra;
        delete setData.column_default;
        delete setData.table_name;
        //默认填入增删改查
        setData.is_insert = "1";
        setData.is_edit = "1";
        setData.is_list = "1";
        setData.is_query = "1";
        return setData;
      });
      await this.GenTableColumn.bulkCreate(add);
    }
    return this.ServerResponse.createBySuccessMsg("操作成功");
  }

  /**
   * 删除数据
   * @param {*} params
   */
  async deleteTable(params) {
    let tableId = params.tableId.split(",");
    await this.GenTable.destroy({
      where: {
        table_id: {
          [Op.in]: tableId,
        },
      },
    });
    await this.GenTableColumn.destroy({
      where: {
        table_id: {
          [Op.in]: tableId,
        },
      },
    });
    return this.ServerResponse.createBySuccessMsg("操作成功");
  }

  /**
   * 查询某个表的详细数据
   * @param {*} params
   * info 查询的表信息
   * rows 查询的列信息
   * tables 所有的表信息
   */
  async findOne(params) {
    let info = await this.GenTable.findAll({
      where: { table_id: params.tableId },
      include: {
        model: this.GenTableColumn,
      },
    });
    info = info[0].dataValues;
    info.columns = info.gen_table_columns.map((item) => {
      return this.objUnderlineToHump(item.dataValues);
    });
    delete info.gen_table_columns;
    info = this.objUnderlineToHump(info);
    if (info.options) {
      Object.assign(info, JSON.parse(info.options));
    }
    let rows = await this.GenTableColumn.findAll({
      where: {
        table_id: info.tableId,
      },
      raw: true,
    });
    rows = rows.map((rowsE) => {
      return this.objUnderlineToHump(rowsE);
    });
    let tables = await this.GenTable.findAll({
      include: {
        model: this.GenTableColumn,
      },
    });
    tables = tables.map((tableE) => {
      let returnTable = this.objUnderlineToHump(tableE.dataValues);
      returnTable.columns = returnTable.genTableColumns.map((item) => {
        return this.objUnderlineToHump(item.dataValues);
      });
      delete returnTable.genTableColumns;
      return returnTable;
    });
    return this.ServerResponse.createBySuccessMsgAndData("请求成功", {
      info,
      rows,
      tables,
    });
  }

  /**
   * 更新
   * @param {*} params
   */
  async update(params) {
    let data = await this.GenTable.findByPk(params.tableId);
    if (!data) {
      return this.ServerResponse.createByErrorCodeMsgBusiness(10013);
    } else {
      let columns = JSON.parse(JSON.stringify(params.columns)).map((item) => {
        return this.objHumpToUnderline(item);
      });
      delete params.columns;
      params.options = JSON.stringify(params.params);
      delete params.params;
      //更新列数据
      await this.GenTableColumn.bulkCreate(columns, {
        updateOnDuplicate: [
          "column_id",
          "table_id",
          "column_name",
          "column_comment",
          "column_type",
          "is_required",
          "is_insert",
          "is_edit",
          "is_list",
          "is_query",
          "query_type",
          "html_type",
          "dict_type",
          "sort",
          "only_byte",
          "create_time",
          "update_time",
        ],
      });
      //更新表数据
      await this.GenTable.update(this.objHumpToUnderline(params), {
        where: {
          table_id: params.tableId,
        },
      });
      return this.ServerResponse.createBySuccessMsg("修改成功！");
    }
  }
}

module.exports = GenService;
