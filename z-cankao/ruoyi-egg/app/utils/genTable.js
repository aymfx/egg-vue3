const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const { buildController } = require("./codeTemplate/controller");
const { buildService } = require("./codeTemplate/service");
const { buildRouter } = require("./codeTemplate/router");
const { buildView } = require("./codeTemplate/webView");
//订阅类
let tableCreateEvent = null;
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

/**
 * 删除文件夹下的所有文件和文件夹
 * @param {*} folderPath 文件路径
 */
function deleteFolderRecursive(folderPath) {
  //判断文件夹是否存在
  if (fs.existsSync(folderPath)) {
    //读取文件夹下的文件目录，以数组形式输出
    fs.readdirSync(folderPath).forEach((file) => {
      //拼接路径
      const curPath = path.join(folderPath, file);
      //判断是不是文件夹，如果是，继续递归
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        //删除文件或文件夹
        fs.unlinkSync(curPath);
      }
    });
    //仅可用于删除空目录
    fs.rmdirSync(folderPath);
  }
}

/**
 * 创建路径下不存在的文件夹
 * @param {*} targetDir
 * @return {*}
 */
function createDirectoryRecursiveSync(targetDir) {
  const targetDirPathArr = path.normalize(targetDir).split(path.sep);

  let currentPath = "";
  for (let i = 0; i < targetDirPathArr.length; i++) {
    currentPath = path.join(currentPath, targetDirPathArr[i]);
    if (!fs.existsSync(currentPath)) {
      // if (i === targetDirPathArr.length - 1) {
      //   fs.writeFileSync(currentPath, "");
      // } else {
      fs.mkdirSync(currentPath);
      // }
    }
  }
}

/**
 * 根据规则在autoModule中创建文件夹
 */
function createPiKaRule(module) {
  let createUrl = path.join("autoModule", "service", "app", "service", module);
  createDirectoryRecursiveSync(createUrl);
  createUrl = path.join("autoModule", "service", "app", "controller", module);
  createDirectoryRecursiveSync(createUrl);
  createUrl = path.join("autoModule", "service", "app", "router", module);
  createDirectoryRecursiveSync(createUrl);
  createUrl = path.join("autoModule", "view", "src", "views", module);
  createDirectoryRecursiveSync(createUrl);
  createUrl = path.join("autoModule", "view", "src", "api", module);
  createDirectoryRecursiveSync(createUrl);
}

/**
 * config
 *  moduleName      表名 驼峰
 *  module          模块名称  区分业务还是系统
 *  moduleClass     服务名/类名
 *  data            数据库数据参数
 *  primaryKey      关键字
 */

function generateFiles(config, eventTable) {
  //删除已生成的项目文件
  deleteFolderRecursive(path.join(__dirname, "..", "..", "autoModule"));
  deleteFolderRecursive(
    path.join(__dirname, "..", "..", "..", "public", "genTable")
  );
  //生成空白的文件夹
  createPiKaRule(config.module);
  //订阅
  if (eventTable) {
    tableCreateEvent = eventTable;
  }
  //索引
  let primaryKey = config.data.filter((item) => item.isRequired == "1");
  primaryKey = config.primaryKey || primaryKey[0].columnName;

  let primaryKeyHump = underlineToHump(primaryKey);

  //生成service文件
  buildService(config, primaryKey, primaryKeyHump);
  //生成controller文件
  buildController(config, primaryKeyHump);
  //生成router文件
  buildRouter(config, primaryKey);
  //生成前端可视文件
  buildView(config, primaryKey, primaryKeyHump);

  //压缩成zip文件
  compressFiles(config.moduleName);
}

function compressFiles(moduleName) {
  const sourceDir = path.join(__dirname, "..", "..", "autoModule");
  let targetFile = path.join(
    __dirname,
    "..",
    "public",
    "genTable",
    `${moduleName}.zip`
  );
  const output = fs.createWriteStream(targetFile);
  const archive = archiver("zip", { zlib: { level: 9 } });

  output.on("close", () => {
    console.log(`${archive.pointer()} total bytes`);
    console.log(`Zip file ${targetFile} has been created.`);
    if (tableCreateEvent) {
      tableCreateEvent.emit("createTable", {
        isCreatedTable: true,
      });
    }
  });

  archive.on("warning", (err) => {
    if (err.code === "ENOENT") {
      console.warn(err);
    } else {
      throw err;
    }
  });

  archive.on("error", (err) => {
    throw err;
  });

  archive.pipe(output);

  archive.directory(sourceDir, false);

  archive.finalize();
}

module.exports = {
  generateFiles,
};
