/*
 * @Author: mark
 * @Date: 2023-04-07 22:19:49
 * @LastEditors: mark
 * @LastEditTime: 2023-08-25 06:34:40
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/extend/context.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

async function getToken(data) {
  return await this.app.jwt.sign(data, this.app.config.jwt.secret, {
    expiresIn: 30 * 24 * 60 * 60 + "s",
  });
}
async function checkToken(token) {
  return await this.app.jwt.verify(token, this.app.config.jwt.secret);
}

// app/extend/context.js
// 获取用户信息
async function getUserData(tokenInfo) {
  var token;
  if (this.headers && this.headers.authorization) {
    token = this.headers.authorization;
  } else {
    token =
      this.ctx && this.ctx.headers && this.ctx.headers.authorization
        ? this.ctx.headers.authorization
        : "";
  }
  if (tokenInfo) token = tokenInfo;
  token = token.substring(7); //把Bearer 截取掉，解析的时候不需要加上Bearer
  let user = {};

  try {
    user = await this.app.jwt.verify(token, this.app.config.jwt.secret);
  } catch (err) {
    user = {};
  }
  return user;
}

/**
 * 将对象中的下划线都转成驼峰
 */
function objUnderlineToHump(obj) {
  let newObj = {};
  for (var key in obj) {
    newObj[underlineToHump(key)] = obj[key];
  }
  return newObj;
}

/**
 * 将对象中的驼峰都转成下划线
 */
function objHumpToUnderline(obj) {
  let newObj = {};
  for (var key in obj) {
    newObj[humpToUnderline(key)] = obj[key];
  }
  return newObj;
}

/**
 * 下划线转驼峰方法
 */
function underlineToHump(str) {
  var str2 = str.toLowerCase();
  var a = str2.split("_");
  var result = a[0];
  for (var i = 1; i < a.length; i++) {
    result = result + a[i].slice(0, 1).toUpperCase() + a[i].slice(1);
  }
  return result;
}

/**
 * 下划线转大驼峰
 * @param {*} str
 * @returns
 */
function underlineToBigHump(str) {
  str = underlineToHump(str);
  str = str.charAt(0).toUpperCase() + str.slice(1);
  return str;
}

/**
 * 驼峰转下划线
 */
function humpToUnderline(str) {
  return str.replace(/([A-Z])/g, "_$1").toLowerCase();
}

/**
 * 转换为number类型
 * @param {*} str
 * @returns
 */
function toInt(str) {
  if (typeof str === "number") return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}
/**
 * 将数据处理成树形结构的
 * @param {*} data 数据源 传入的顺序需要为排列的正序
 * @param {*} parentId 父id的属性名
 * @param {*} id 自己的属性名
 * @param {*} children 孩子组件的属性名
 */
function changeToTree(
  data,
  parentId = "parentId",
  id = "id",
  children = "children"
) {
  for (var key = data.length - 1; key >= 0; key--) {
    data.forEach((element) => {
      if (element) {
        if (element[id] == data[key][parentId]) {
          if (!element[children]) {
            element[children] = [];
          }
          element[children].unshift(data[key]);
          //标记该对象已经被添加到别的地方
          data[key].used = true;
        }
      }
    });
  }
  let returnData = data.filter((item) => !item.used);
  return returnData;
}

/**
 * 首字母大写
 * @param {*} string
 * @returns
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
module.exports = {
  objUnderlineToHump,
  underlineToHump,
  objHumpToUnderline,
  humpToUnderline,
  toInt,
  changeToTree,
  capitalizeFirstLetter,
  getToken,
  checkToken,
  getUserData,
  underlineToBigHump,
};
