
module.exports = (app, basicUrl) => {
    //用户和角色关联表查询
    app.router.get(
        basicUrl + "/system/sysUserRole/list",
        app.controller.system.sysUserRole.list
    );

    //用户和角色关联表详情
    app.router.get(
        basicUrl + "/system/sysUserRole/:userId",
        app.controller.system.sysUserRole.detail
    );

    //用户和角色关联表新增
    app.router.post(
        basicUrl + "/system/sysUserRole",
        app.controller.system.sysUserRole.create
    );

    //用户和角色关联表删除
    app.router.delete(
        basicUrl + "/system/sysUserRole/:userId",
        app.controller.system.sysUserRole.delete
    );

    //用户和角色关联表修改
    app.router.put(
        basicUrl + "/system/sysUserRole",
        app.controller.system.sysUserRole.update
    );

    
};      
    