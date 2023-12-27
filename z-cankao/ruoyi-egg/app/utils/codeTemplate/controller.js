const fs = require("fs");
const path = require("path");

/**
 * 根据是否字典 导出对应的字典数据
 * @param {*} config
 * @returns
 */
function addDictMap(config) {
  let returnStr = "";
  let dictData = config.data.filter((item) => item.dictType);
  dictData = dictData.map((item) => {
    item.columnKey = underlineToHump(item.columnName);
    return item;
  });
  if (dictData.length) {
    returnStr += `//字典关联项
    data.forEach(async(item) => {
      for(var key2 in item){
        `;
    dictData.forEach((element) => {
      returnStr += `if(key2 == "${element.columnKey}"){
          var checkData = await this.ctx.service.dict.get("${element.dictType}")
          checkData = checkData.filter(item => item.dict_value == item.${element.columnKey})
          item.${element.columnKey} = checkData
        }
      `;
    });
    returnStr += `}
      return item
    })
    `;
  }
  return returnStr;
}

/**
 * 下划线转驼峰方法
 */
function underlineToHump(str) {
  var a = str.split("_");
  var result = a[0];
  for (var i = 1; i < a.length; i++) {
    result = result + a[i].slice(0, 1).toUpperCase() + a[i].slice(1);
  }
  return result;
}

function buildController(config, primaryKeyHump) {
  let treeAdd = "";
  //判断是否需要生成树查询接口
  let type = config.newData[0].tpl_category;
  if (type == "tree") {
    treeAdd = `
    /**
     * 获取树形列表数据
     * @param {*} ctx
     */
    async tree(ctx) {
      ctx.body = await ctx.service.${config.module}.${config.moduleName}.tree(ctx.request.query);
      ctx.status = 200;
    }
    `;
  }
  // 生成 controller 文件
  const controllerFile = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "autoModule",
    "service",
    "app",
    "controller",
    config.module,
    `${config.moduleName}.js`
  );
  if (!fs.existsSync(controllerFile)) {
    const controllerCode = `
const Controller = require('egg').Controller;

class ${config.moduleClass}Controller extends Controller {
  /**
   * 普通分页查询
   * @param {*} ctx
   */
  async list(ctx) {
    ctx.body = await ctx.service.${config.module}.${
      config.moduleName
    }.list(ctx.request.query);
    ctx.status = 200;
  }

  /**
   * 获取列表数据
   * @param {*} ctx
   */
  async allList(ctx) {
    ctx.body = await ctx.service.${config.module}.${
      config.moduleName
    }.allList(ctx.request.query);
    ctx.status = 200;
  }

  ${treeAdd}
  
  /**
   * 删除
   * @param {*} ctx
   */
  async delete(ctx) {
    ctx.body = await ctx.service.${config.module}.${
      config.moduleName
    }.delete(ctx.params.${config.primaryKeyHub});
    ctx.status = 200;
  }

  /**
   * 更新
   * @param {*} ctx
   */
  async update(ctx) {
    ctx.body = await ctx.service.${config.module}.${
      config.moduleName
    }.update(ctx.request.body);
    ctx.status = 200;
  }

  /**
   * 获取详情
   * @param {*} ctx
   */
  async detail(ctx) {
    ctx.body = await ctx.service.${config.module}.${
      config.moduleName
    }.detail(ctx.params.${config.primaryKeyHub});
    ctx.status = 200;
  }

  /**
   * 创建
   * @param {*} ctx
   */
  async create(ctx) {
    ctx.body = await ctx.service.${config.module}.${
      config.moduleName
    }.create(ctx.request.body);
    ctx.status = 200;
  }

  async downLoad(ctx){
    let data = await ctx.service.${config.module}.${
      config.moduleName
    }.allList(ctx.request.body);
    
    ${addDictMap(config)}

    let downLoadModule = ctx.model.${config.moduleClass}.fieldRawAttributesMap;
    let columnData = [];
    for (var key in downLoadModule) {
      columnData.push({
        header: downLoadModule[key].comment,
        key: ctx.underlineToHump(key),
        width: 15,
      });
    }
    if (data.code == 200) {
      await ctx.service.exportExcel.publicDownLoad(columnData, data.data);
    } else {
      ctx.body = data;
      ctx.status = 200;
    }
  }
}

module.exports = ${config.moduleClass}Controller;
    `;
    fs.writeFileSync(controllerFile, controllerCode);
  }

  console.log(`生成 ${config.moduleName} 模块的增删改查文件成功！`);
}

module.exports = {
  buildController,
};
