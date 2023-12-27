/*
 * @Author: mark
 * @Date: 2023-07-01 18:00:06
 * @LastEditors: mark
 * @LastEditTime: 2023-07-02 22:06:35
 * @FilePath: /自研/RuoYI-egg/ruoyi-egg/app/utils/public.js
 * @Description:一些公共的方法
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
/**
 * 加密
 * @param {*} data
 * @param {*} secretKey
 * @returns
 */
function encryptData(data, secretKey) {
  const cipher = crypto.createCipher("aes-256-cbc", secretKey);
  let encryptedData = cipher.update(data, "utf8", "hex");
  encryptedData += cipher.final("hex");
  return encryptedData;
}

/**
 * 解密
 * @param {*} encryptedData
 * @param {*} secretKey
 * @returns
 */
function encryptData(encryptedData, secretKey) {
  const decipher = crypto.createDecipher("aes-256-cbc", secretKey);
  let decryptedData = decipher.update(encryptedData, "hex", "utf8");
  decryptedData += decipher.final("utf8");
  return decryptedData;
}

/**
 * 获取某个路径下的所有文件
 * @param {*} directoryPath
 */
function fileDisplay(directoryPath) {
  try {
    const files = fs.readdirSync(directoryPath);
    let filePaths = [];
    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      const stats = fs.statSync(filePath);
      if (stats.isFile()) {
        filePaths.push(filePath);
      } else if (stats.isDirectory()) {
        const subDirectoryPaths = fileDisplay(filePath);
        filePaths = filePaths.concat(subDirectoryPaths);
      }
    });
    return filePaths;
  } catch (error) {
    console.error("读取路由失败", error);
    return [];
  }
}

module.exports = {
  encryptData,
  encryptData,
  fileDisplay,
};
