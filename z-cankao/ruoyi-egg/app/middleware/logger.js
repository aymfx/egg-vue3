/*
 * @Author: mark
 * @Date: 2023-06-27 23:08:23
 * @LastEditors: mark
 * @LastEditTime: 2023-08-25 07:17:00
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/middleware/logger.js
 * @Description:
 * 中间件，用于记录日志
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
const axios = require("axios");
const useragent = require("useragent");
//获取ip归属地
const libqqwry = require("lib-qqwry");
module.exports = (options, app) => {
  return async function requestLogMiddleware(ctx, next) {
    const startTime = Date.now();
    let { method, host, ip, url } = ctx.request;
    if(ctx.request.header['x-real-ip']){
        ip = ctx.request.header['x-real-ip']
    }
    const userAgent = ctx.get("User-Agent");
    const agent = useragent.parse(userAgent);
    const os = agent.os.toString();
    const browser = agent.toAgent();
    if (host) {
      host = ip;
    }
    let business_type = 0;
    if (method === "POST") {
      business_type = 1;
    } else if (method === "PUT") {
      business_type = 2;
    } else if (method === "DELETE") {
      business_type = 3;
    }

    try {
      // 操作人员
      ctx.handleUser = await ctx.getUserData();
      await next();
      const endTime = Date.now();
      const elapsedTime = endTime - startTime;
      const location = await getLocation(host);
      const logData = {
        business_type,
        request_method: method,
        oper_ip: host,
        oper_name: ctx.handleUser ? ctx.handleUser.userName : "",
        oper_location: location,
        oper_param: JSON.stringify({
          body: ctx.request.body,
          query: ctx.request.query,
          params: ctx.request.params,
        }).substring(0, 1800),
        json_result: ctx.response.body
          ? JSON.stringify(ctx.response.body).substring(0, 1800)
          : "",
        status: 0,
        error_msg: "",
        oper_time: new Date(),
        cost_time: elapsedTime,
        oper_url: url,
        title: ctx.path,
        // operator_type: JSON.stringify({ userAgent, os, browser }),
      };

      await ctx.model.SysOperLog.create(logData);
      if (url == "/login") {
        let loggerData = {
          //登录用户
          user_name: ctx.handleUser ? ctx.handleUser.userName : "",
          //登录ip
          ipaddr: host,
          //登录地点
          login_location: location,
          //浏览器类型
          browser: browser,
          //操作系统
          os: os,
          //登录状态 0成功 1失败
          status: "0",
          //提示消息
          msg: JSON.stringify(ctx.response.body).substring(0, 1800),
          //访问时间
          login_time: new Date(),
        };
        //记录登录日志
        await ctx.model.SysLogininfor.create(loggerData);
      }
    } catch (error) {
      app.logger.warn(error);
      const endTime = Date.now();
      const elapsedTime = endTime - startTime;
      const location = await getLocation(host);
      const logData = {
        business_type,
        request_method: method,
        oper_ip: host,
        oper_location: location,
        oper_param: JSON.stringify({
          body: ctx.request.body,
          query: ctx.request.query,
          params: ctx.request.params,
        }).substring(0, 1800),
        json_result: ctx.response.body
          ? JSON.stringify(ctx.response.body).substring(0, 1800)
          : "",
        status: 1,
        error_msg: JSON.stringify(error).substring(0, 1800),
        oper_time: new Date(),
        cost_time: elapsedTime,
        oper_url: url,
        // operator_type: JSON.stringify({ userAgent, os, browser }),
      };
      //记录操作日志
      await ctx.model.SysOperLog.create(logData);
      if (url == "/login") {
        let loggerData = {
          //登录用户
          user_name: "",
          //登录ip
          ipaddr: host,
          //登录地点
          login_location: location,
          //浏览器类型
          browser: browser,
          //操作系统
          os: os,
          //登录状态 0成功 1失败
          status: "1",
          //提示消息
          msg: ctx.response.body
            ? JSON.stringify(ctx.response.body).substring(0, 1800)
            : "",
          //访问时间
          login_time: new Date(),
        };
        //记录登录日志
        await ctx.model.SysLogininfor.create(loggerData);
      }

      throw error;
    }
  };
};

/**
 * 获取地址归属地
 * @param {*} host
 * @returns
 */
async function getLocation(host) {
  var qqwry = libqqwry.init().speed();
  try {
    const response = await axios.get(
      `https://qifu-api.baidubce.com/ip/geo/v1/district?ip=${host}`
    );
    if (response.data.code !== "Success") {
      if (host.indexOf("localhost") > -1) {
        host = "127.0.0.1";
      }
      return JSON.stringify(qqwry.searchIP(host)) + "  lib-qqwry";
    }
    return `${response.data.data.country}, ${response.data.data.prov}, ${response.data.data.city},${response.data.data.district},${response.data.data.isp},${response.data.data.lat},${response.data.data.lng}`;
  } catch (error) {
    if (host.indexOf("localhost") > -1) {
      host = "127.0.0.1";
    }
    return JSON.stringify(qqwry.searchIP(host)) + "  lib-qqwry";
  }
}
