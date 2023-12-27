/*
 * @Author: mark
 * @Date: 2023-06-26 07:15:20
 * @LastEditors: mark
 * @LastEditTime: 2023-08-28 07:24:57
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/service/tool/redis.js
 * @Description:redis的基础操作
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
const Service = require("egg").Service;
const time = 60 * 60 * 24 * 365; //默认缓存失效时间 365天
// 对应的标识与db的关系
const dbMap = {
  0: "client0",
  1: "client1",
};
class RedisService extends Service {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.SysOperLog = ctx.model.SysOperLog;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
    this.objUnderlineToHump = ctx.objUnderlineToHump;
    this.objHumpToUnderline = ctx.objHumpToUnderline;
    this.toInt = ctx.toInt;
  }
  // 设置
  async set(db, key, value, seconds) {
    // seconds 有效时长
    let { redis } = this.app;
    value = JSON.stringify(value);
    if (!seconds) {
      await redis.get(dbMap[db]).set(key, value);
    } else {
      // 设置有效时间
      await redis.get(dbMap[db]).set(key, value, "EX", seconds);
    }
  }

  // 获取
  async get(db, key) {
    let { redis } = this.app;
    let data = await redis.get(dbMap[db]).get(key);
    if (!data) return;
    data = JSON.parse(data);
    return data;
  }

  // 清空redis
  async flushall() {
    let { redis } = this.app;
    redis.flushall();
    return;
  }
}
module.exports = RedisService;
