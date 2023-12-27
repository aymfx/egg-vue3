/*
 * @Author: mark
 * @Date: 2023-07-01 17:32:14
 * @LastEditors: mark
 * @LastEditTime: 2023-07-01 17:32:16
 * @FilePath: /自研/RuoYI-egg/ruoyi-egg/app/middleware/console_to_file.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
module.exports = () => {
  return async function consoleToFile(ctx, next) {
    console.log = ctx.logger.info.bind(ctx.logger);
    console.error = ctx.logger.error.bind(ctx.logger);
    console.warn = ctx.logger.warn.bind(ctx.logger);
    console.debug = ctx.logger.debug.bind(ctx.logger);
    await next();
  };
};
