/*
 * @Author: mark
 * @Date: 2023-08-14 02:28:04
 * @LastEditors: mark
 * @LastEditTime: 2023-08-14 10:39:31
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/router/system/notice.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
module.exports = (app, basicUrl) => {
  //通知公告表查询
  app.router.get(
    basicUrl + "/system/notice/list",
    app.controller.system.sysNotice.list
  );

  //通知公告表详情
  app.router.get(
    basicUrl + "/system/notice/:noticeId",
    app.controller.system.sysNotice.detail
  );

  //通知公告表新增
  app.router.post(
    basicUrl + "/system/notice",
    app.controller.system.sysNotice.create
  );

  //通知公告表删除
  app.router.delete(
    basicUrl + "/system/notice/:noticeId",
    app.controller.system.sysNotice.delete
  );

  //通知公告表修改
  app.router.put(
    basicUrl + "/system/notice",
    app.controller.system.sysNotice.update
  );
};
