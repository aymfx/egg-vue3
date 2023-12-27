/*
 * @Author: mark
 * @Date: 2023-06-26 22:03:25
 * @LastEditors: mark
 * @LastEditTime: 2023-07-02 17:53:27
 * @FilePath: /自研/RuoYI-egg/ruoyi-egg/app/controller/system/sysBasic.js
 * @Description:
 * 系统的基础接口，如登录，获取验证码等
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
const Controller = require("egg").Controller;

class SysBasicController extends Controller {
  /**
   * 获取验证码图片
   * @param {*} ctx
   */
  async captchaImage(ctx) {
    ctx.body = await ctx.service.system.sysBasic.captchaImage(ctx.request.body);
    ctx.status = 200;
  }

  /**
   * 登录
   * @param {*} ctx
   */
  async login(ctx) {
    ctx.body = await ctx.service.system.sysBasic.login(ctx.request.body);
    ctx.status = 200;
  }

  /**
   * 获取登录信息
   * @param {*} ctx
   */
  async getInfo(ctx) {
    ctx.body = await ctx.service.system.sysBasic.getInfo();
    ctx.status = 200;
  }

  /**
   * 获取路由信息
   */
  async getRouters(ctx) {
    ctx.body = await ctx.service.system.sysBasic.getRoute();
    ctx.status = 200;
  }
}

module.exports = SysBasicController;
