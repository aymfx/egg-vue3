/*
 * @Author: mark
 * @Date: 2023-07-01 17:32:49
 * @LastEditors: mark
 * @LastEditTime: 2023-07-01 17:43:51
 * @FilePath: /自研/RuoYI-egg/ruoyi-egg/app/controller/system/log.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */

// const fs = require("fs");
// const path = require("path");
// const readline = require("readline");
const Controller = require("egg").Controller;
class LogController extends Controller {
  async index() {
    const { ctx } = this;
    const { date, path, content, page = 1, pageSize = 10 } = ctx.query;
    const logPath = path.join(this.config.logger.dir, path);
    const logStream = fs.createReadStream(logPath);
    const rl = readline.createInterface({ input: logStream });
    const logs = [];
    let lineNumber = 0;
    rl.on("line", (line) => {
      if (line.includes(date) && line.includes(content)) {
        lineNumber++;
        if (
          lineNumber > (page - 1) * pageSize &&
          lineNumber <= page * pageSize
        ) {
          logs.push(line);
        }
      }
    });
    rl.on("close", () => {
      ctx.body = {
        total: lineNumber,
        logs,
      };
    });
  }
}

module.exports = LogController;
