/*
 * @Author: mark
 * @Date: 2023-09-03 20:22:17
 * @LastEditors: mark
 * @LastEditTime: 2023-09-03 20:38:36
 * @FilePath: /自研/RuoYi_egg/ruoyi-egg/app/middleware/checkToken.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
const jwt = require("jsonwebtoken");

module.exports = (options, app) => {
    return async function jwtMiddleware(ctx, next) {
        // 获取请求头中的 Authorization 字段，通常包含 JWT Token
        const token = ctx.request.header.authorization;
        // 不用token的列表
        const whiteList = ["/captchaImage", "/login", "/prod-api/captchaImage", "/prod-api/login"];
        app.logger.info(ctx.path);
        // 如果没有提供 Token，返回 401 错误
        if (!token && whiteList.indexOf(ctx.path) == -1) {
            ctx.status = 200;
            ctx.body = { code: 401, msg: "会话过期，请重新登录" };
            return;
        }

        if (token) {
            try {
                // 验证 JWT Token
                const decoded = jwt.verify(
                    token.split("Bearer ")[1],
                    app.config.jwt.secret
                );
                // 将解码后的用户信息挂载到 ctx.state.user 中，以便后续路由使用
                ctx.state.user = decoded;
            } catch (err) {
                // Token 验证失败，返回 401 错误
                ctx.status = 200;
                ctx.body = { code: 401, msg: "会话过期，请重新登录" };
                return
            }
        }

        // 继续执行下一个中间件或路由处理函数
        await next();

    };
};
