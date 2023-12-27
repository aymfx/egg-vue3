/*
 * @Author: mark
 * @Date: 2023-06-26 22:07:17
 * @LastEditors: mark
 * @LastEditTime: 2023-09-03 20:43:30
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/service/system/sysBasic.js
 * @Description:
 * 基础服务，如获取验证码等
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
const Service = require("egg").Service;
//验证码插件
const captchapng = require("captchapng");
//加密模块
const utility = require("utility");
const { v4: uuidv4 } = require("uuid");
//数据库模块
const { Op } = require("sequelize");
class SysBasicService extends Service {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.getUserData = ctx.getUserData;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
    this.objUnderlineToHump = ctx.objUnderlineToHump;
    this.objHumpToUnderline = ctx.objHumpToUnderline;
    this.capitalizeFirstLetter = ctx.capitalizeFirstLetter;
    this.changeToTree = ctx.changeToTree;
    this.toInt = ctx.toInt;
    this.SysUser = ctx.model.SysUser;
    this.SysDept = ctx.model.SysDept;
    this.SysRole = ctx.model.SysRole;
    this.SysMenu = ctx.model.SysMenu;
    this.getUserData = ctx.getUserData;
  }

  /**
   * 创建验证码
   * @returns
   */
  async captchaImage() {
    // 第三方插件，
    let captchaVal = parseInt(Math.random() * 9000 + 1000);
    var p = new captchapng(80, 30, captchaVal); // width,height,numeric captcha
    p.color(205, 205, 205, 128); // First color: background (red, green, blue, alpha)
    p.color(2, 5, 230, 255); // Second color: paint (red, green, blue, alpha)
    var img = p.getBase64();
    //验证码存session
    this.session.code = {
      value: utility.md5(utility.md5(captchaVal + "")),
      time: Date.now(),
    };
    return {
      //TODO这里可以设置开启或者关闭系统的验证码，需要存在数据库中，在系统缓存中实现
      captchaEnabled: true,
      img,
      msg: "操作成功",
      uuid: uuidv4(),
      code: 200,
    };
  }

  /**
   * 登录
   * @returns
   */
  async login(params) {
    // console.log("加密后的密码", utility.md5(params.password));
    if (utility.md5(utility.md5(params.code)) != this.session.code.value) {
      return {
        code: 600,
        msg: "验证码不正确，请输入正确验证码",
      };
    }
    let res = await this.SysUser.findOne({
      where: {
        user_name: params.username,
        password: utility.md5(params.password),
      },
      raw: true,
    });
    if (!res) {
      return this.ServerResponse.createByErrorCodeMsgBusiness(50001);
    } else {
      const token = this.app.jwt.sign(
        {
          userId: res.user_id,
          userName: params.username,
        },
        this.app.config.jwt.secret
      );
      this.ctx.handleUser = {
        userId: res.user_id,
        userName: params.username,
      };
      return {
        code: 200,
        msg: "操作成功",
        token,
      };
    }
  }

  /**
   * 获取登录信息
   */
  async getInfo() {
    let userResuserData = await this.getUserData();
    let { userId } = userResuserData;
    let userRes = await this.SysUser.findAll({
      where: {
        user_id: userId,
      },
      include: [{ model: this.SysDept }, { model: this.SysRole }],
    });
    let permissions = [];
    let roles = [];
    //判断是否为超管权限
    if (userRes[0].sys_roles[0].role_key == "admin") {
      permissions.push("*:*:*");
    } else {
      userRes[0].sys_roles.forEach((element) => {
        permissions.push(element.role_key);
      });
    }
    userRes[0].sys_roles.forEach((element) => {
      roles.push(element.role_key);
    });
    //返回成若依的数据结构
    userRes[0].dataValues.roles = this.objUnderlineToHump(
      JSON.parse(JSON.stringify(userRes[0].sys_roles))
    );
    userRes[0].dataValues.dept = this.objUnderlineToHump(
      JSON.parse(JSON.stringify(userRes[0].sys_dept))
    );
    delete userRes[0].dataValues.sys_roles;
    delete userRes[0].dataValues.sys_dept;
    return {
      code: 200,
      msg: "操作成功",
      permissions,
      user: this.objUnderlineToHump(userRes[0].dataValues),
      roles,
    };
  }

  /**
   * 获取用户的路由权限
   * 路由返回参数及格式
   *
   * @param {*} params
   */
  async getRoute() {
    let userResuserData = await this.getUserData();
    let { userName, userId } = userResuserData;
    let res;
    if (userName == "admin") {
      //超管查询所有的菜单
      res = await this.SysMenu.findAll({
        where: {
          status: "0",
          [Op.or]: [
            {
              menu_type: "M",
            },
            {
              menu_type: "C",
            },
          ],
        },
        order: [
          ["parent_id", "asc"],
          ["order_num", "asc"],
        ],
      });
    } else {
      //查询 user对应的roleID
      let rowIds = await this.SysUserRole.findAll({
        where: {
          user_id: userId,
        },
      });
      let rowArr = [];
      rowIds.forEach((element) => {
        rowArr.push(element.dataValues.role_id);
      });
      //查询所有的匹配权限的菜单
      res = await this.SysRoleMenu.findAll({
        where: {
          role_id: {
            [Op.or]: rowArr,
          },
        },
        include: [
          {
            model: this.SysMenu,
          },
        ],
      });
      //console.log(res);
      res = res.map((item) => {
        return item.sys_menu;
      });
    }

    res = res.map((item) => {
      if (item) {
        item = this.objUnderlineToHump(item.dataValues);
        //当为根路径并且不为外链时path加上’/‘
        item.name = this.capitalizeFirstLetter(item.path);
        if (item.parentId == 0 && item.isFrame) {
          item.path = "/" + item.path;
        }
        return item;
      }
    });
    res = res.filter(
      (item) => item && (item.menuType == "M" || item.menuType == "C")
    );
    res = this.changeReturnTree(this.changeToTree(res, "parentId", "menuId"));
    return this.ServerResponse.createBySuccessMsgAndData("查询成功", res);
  }

  /**
   * 将路由树的数据库数据转换为对应的路由数据
   * @param {*} data
   */
  changeReturnTree(data) {
    data = data.map((item) => {
      if (item.children) {
        item.children = this.changeReturnTree(item.children);
      }
      return this.getRouteLint(item);
    });
    return data;
  }
  getRouteLint(item) {
    let component = item.menuType == "M" ? "Layout" : item.component;
    if (item.parentId != 0 && component == "Layout") {
      component = "ParentView";
    }
    let returnData = {
      //路由的名称
      name: item.name,
      //路径的地址
      path: item.path,
      //菜单是否隐藏
      hidden: item.visible ? false : true,
      //面包屑是否能点击  暂定菜单层次的才可以点击
      // redirect: item.menuType == "C" ? "Redirect" : "noRedirect",
      //组件地址
      component,
      //是否长展示
      // alwaysShow: item.menuType == "M" ? "" : "noRedirect",
      //其他数据
      meta: {
        //菜单名称
        title: item.menuName,
        //图标
        icon: item.icon,
        //是否缓存
        noCache: item.isCache ? false : true,
        //跳转路径
        link: !item.isFrame ? item.path : null,
      },
    };
    if (item.children) {
      returnData.children = item.children;
    }
    return returnData;
  }
}

module.exports = SysBasicService;
