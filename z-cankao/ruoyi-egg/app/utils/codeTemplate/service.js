const fs = require("fs");
const path = require("path");
/**
 * 对列项的查询数据进行参数配置
 * @param {*} columnData sql中查出的数据
 */
function autoDealQuery(columnData) {
  let selectArray = columnData.filter((item) => item.isQuery == "1");
  // let status = columnData.filter((item2) => item2.columnComment == "status");
  let returnStr = "";
  selectArray.forEach((item) => {
    if (item.columnType == "DATE" || item.columnType == "datetime") {
      returnStr += `
    //查询${item.columnComment}
    if (params["params[${underlineToHump(item.columnName)}Start]"]) {
      query.where.${item.columnName} = {
        [Op.${item.queryType.toLowerCase()}]:[
          params["params[${underlineToHump(item.columnName)}Start]"],
          params["params[${underlineToHump(item.columnName)}End]"],
        ]
      }
    }
      `;
    } else if (item.queryType == "LIKE") {
      returnStr += `
    //查询${item.columnComment}
    if (params.${underlineToHump(item.columnName)}) {
      query.where.${item.columnName} = {
        [Op.${item.queryType.toLowerCase()}]:\`%\$\{params.${underlineToHump(
        item.columnName
      )}\}%\`
      }
    }
      `;
    } else {
      returnStr += `
    //查询${item.columnComment}
    if (params.${underlineToHump(item.columnName)}) {
      query.where.${item.columnName} = {
        [Op.${item.queryType.toLowerCase()}]:params.${underlineToHump(
        item.columnName
      )}
      }
    }
      `;
    }
  });
  // if (status.length) {
  //   returnStr += `
  //   query.where.status = "0"
  //     `;
  // }
  return returnStr;
}

/**
 * 对新增的时候进行处理
 * @param {*} config
 */
function autoDealCreate(config) {
  //type 生成的类型 crud 基础的增删改查    tree 树组件     sub关联表增删改查  第一期暂时不实现
  let type = config.newData[0].tpl_category;
  // 关联表名
  let subTableName = null;
  //关联表的外键
  let subTableFK = null;
  if (type == "sub") {
    subTableName = underlineToBigHump(config.newData[0].sub_table_name, 1);
    subTableFK = config.newData[0].sub_table_fk_name;
  }

  let onlyOneList = config.data.filter((item) => item.onlyByte == "1");
  let addOnlyStr = "[Op.or]:[";
  onlyOneList.forEach((item) => {
    addOnlyStr += `
          {
            ${item.columnName}:params.${underlineToHump(item.columnName)}
          },`;
  });
  addOnlyStr += `
        ]`;
  let timeMark = config.data.filter((item) => item.columnName == "update_time");
  if (timeMark.length) {
    timeMark = `create_time: new Date(),
          update_time: new Date(),`;
  } else {
    timeMark = "";
  }
  let returnStr = "";
  if (onlyOneList.length) {
    returnStr += `
    const findRepeat = await this.${config.moduleClass}.findOne({
      where: {
        ${addOnlyStr}
      },
    });
    if (findRepeat) {
      return this.ServerResponse.createByErrorCodeMsgBusiness(10011);
    } else {
      await this.${config.moduleClass}.create(
        Object.assign(
          {
            ${timeMark}
          },
          this.objHumpToUnderline(params)
        )
      );
      return this.ServerResponse.createBySuccessMsg("新增成功");
    }
    `;
  } else {
    returnStr += `
    await this.${config.moduleClass}.create(
      Object.assign(
        {
          ${timeMark}
        },
        this.objHumpToUnderline(params)
      )
    );
    return this.ServerResponse.createBySuccessMsg("新增成功");
    `;
  }
  return returnStr;
}

/**
 * 下划线转驼峰方法
 * type 默认小驼峰  传1时是大驼峰
 */
function underlineToHump(str, type = 0) {
  var a = str.split("_");
  var result = a[0];
  for (var i = 1; i < a.length; i++) {
    result = result + a[i].slice(0, 1).toUpperCase() + a[i].slice(1);
  }
  if (type == 1) {
    result = result.slice(0, 1).toUpperCase() + result.slice(1);
  }
  return result;
}

/**
 * 生成树列表的查询接口
 * @param {*} type
 * @param {*} treeCode
 * @param {*} menuName
 * @param {*} pId
 */
function buildTree(type, treeCode, pId) {
  if (type == "tree") {
    return `
  /**
   * 生成树形返回
   * @param {*} params 
   * @returns 
   */
  async tree(params){
    let res = await this.allList(params)
    res = this.ctx.changeToTree(res.data,"${underlineToHump(
      pId
    )}","${underlineToHump(treeCode)}")
    return this.ServerResponse.createBySuccessData(rows);
  }
    `;
  } else {
    return "";
  }
}

/**
 * 创建方法
 * @param {*} config 配置参数
 * @param {*} primaryKey 唯一索引
 * @param {*} primaryKeyHump 唯一索引驼峰
 */
function buildService(config, primaryKey, primaryKeyHump) {
  let queryString = autoDealQuery(config.data);
  //type 生成的类型 crud 基础的增删改查    tree 树组件     sub关联表增删改查
  let type = config.newData[0].tpl_category;
  //树组件相关参数
  let treeData;
  //本组件id字段
  let treeCode;
  //菜单名称
  let menuName;
  //父id
  let pId;
  if (config.newData[0].options) {
    treeData = JSON.parse(config.newData[0].options);
    treeCode = treeData.treeCode;
    menuName = treeData.menu_name;
    pId = treeData.treeParentCode;
  }
  // 生成 service 文件
  //对应路径
  const serviceFile = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "autoModule",
    "service",
    "app",
    "service",
    config.module,
    `${config.moduleName}.js`
  );
  if (!fs.existsSync(serviceFile)) {
    const serviceCode = `
const Service = require('egg').Service;
const { Op } = require("sequelize");
class ${config.moduleClass}Service extends Service {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.${config.moduleClass} = ctx.model.${config.moduleClass};
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
    this.objUnderlineToHump = ctx.objUnderlineToHump;
    this.objHumpToUnderline = ctx.objHumpToUnderline;
    this.toInt = ctx.toInt;
    this.userName = ctx.handleUser && ctx.handleUser.userName ? ctx.handleUser.userName : "";
  }

  /**
   * 分页查询
   * @param {*} params
   */
  async list(params) {
    let select = params.pageSize ? 1 : 0;
    params = this.dealQuery(params);
    let data;
    data = await this.${config.moduleClass}.findAndCountAll(
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
   * 获取所有列表数据
   * @param {*} params
   * @returns
   */
  async allList(params) {
    let newParams = this.dealQuery(params);
    delete newParams.limit;
    delete newParams.offset;
    let data;
    data = await this.${config.moduleClass}.findAndCountAll(
      Object.assign(newParams, { raw: true })
    );
    let rows = data.rows;
    rows = rows.map((item) => {
      return this.objUnderlineToHump(item);
    });
    return this.ServerResponse.createBySuccessData(rows);
  }

  ${buildTree(type, treeCode, pId)}

  /**
   * 新增 
   * @returns
   */
  async create(params) {
    ${autoDealCreate(config)}
  }

  /**
   * 删除
   * @param {*} params
   */
  async delete(${primaryKeyHump}) {
    let ids = ${primaryKeyHump}.split(",");
    await this.${config.moduleClass}.destroy({
      where: {
        ${primaryKey}: {
          [Op.in]: ids,
        },
      },
    });
    return this.ServerResponse.createBySuccessMsg("删除成功！");
  }

  /**
   * 修改数据
   * @param {*} params
   * @returns
   */
  async update(params, msg) {
    const findRepeat = await this.${
      config.moduleClass
    }.findByPk(params.${primaryKeyHump});
    if (!findRepeat) {
      return this.ServerResponse.createByErrorCodeMsgBusiness(10013);
    } else {
      await findRepeat.update(
        Object.assign(
          {
            ${
              config.data.filter((item) => item.columnName == "update_time")
                ? "update_time:new Date()"
                : ""
            }
          },
          this.objHumpToUnderline(params)
        )
      );
      return this.ServerResponse.createBySuccessMsg(msg || "修改成功");
    }
  }

  /**
   * 获取详情
   * @param {*} ${primaryKeyHump}
   */
  async detail(${primaryKeyHump}) {
    let data = await this.${config.moduleClass}.findByPk(${primaryKeyHump});
    data = this.objUnderlineToHump(data.dataValues);
    return this.ServerResponse.createBySuccessData(data);
  }

  /**
   * 处理查询的参数
   */
  dealQuery(params) {
    let query = {
      where: {},
      order: [["${primaryKey}", "ASC"]],
    };
    if (params.pageSize && params.pageNum) {
      query.limit = this.toInt(params.pageSize);
      query.offset = (this.toInt(params.pageNum) - 1) * query.limit;
    }

    //根据id进行查询
    if (params.${primaryKeyHump}) {
      query.where.${primaryKey} = params.${primaryKeyHump};
    }

    ${queryString}

    return query;
  }
}

module.exports = ${config.moduleClass}Service;
    `;
    // fs.mkdirSync(moduleDir, { recursive: true });
    fs.writeFileSync(serviceFile, serviceCode);
    console.log("创建service成功");
  }
}

module.exports = {
  buildService,
};
