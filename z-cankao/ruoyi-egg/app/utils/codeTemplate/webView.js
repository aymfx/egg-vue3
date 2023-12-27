const fs = require("fs");
const path = require("path");

/**
 * 添加查询的${config.newData[0].table_comment}
 * @param {*} config
 */
function addQuery(config) {
  let queryData = config.newData[0].gen_table_columns.filter(
    (item) => item.is_query == "1"
  );
  queryData = queryData.sort((a, b) => a.column_id - b.column_id);
  let queryStr = "";
  queryData.forEach((element) => {
    if (element.html_type == "select") {
      queryStr += `<el-form-item label="${element.column_comment}" prop="${element.column_name}">
        <el-select v-model="queryParams.${element.column_name}" placeholder="请选择" clearable>
          <el-option
            v-for="dict in dict.type.${element.dict_type}"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>`;
    } else {
      queryStr += `<el-form-item label="${element.column_comment}" prop="${element.column_name}">
        <el-input
          v-model="queryParams.${element.column_name}"
          placeholder="请输入${element.column_comment}"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
    `;
    }
  });
  return queryStr;
}

/**
 * 添加列项的${config.newData[0].table_comment}
 * @param {*} config
 */
function addTableCol(config) {
  let queryData = config.newData[0].gen_table_columns.filter(
    (item) => item.is_list == "1"
  );
  queryData = queryData.sort((a, b) => a.column_id - b.column_id);
  let queryStr = "";
  queryData.forEach((element) => {
    if (element.dict_type) {
      queryStr += `<el-table-column label="${element.column_comment}" align="center" prop="${element.column_name}">
      <template slot-scope="scope">
        <dict-tag :options="dict.type.${element.dict_type}" :value="scope.row.${element.column_name}"/>
      </template>
    </el-table-column>`;
    } else {
      queryStr += `<el-table-column label="${element.column_comment}" align="center" prop="${element.column_name}" />
      `;
    }
  });
  return queryStr;
}

/**
 * 添加增改编辑弹窗${config.newData[0].table_comment}
 * @param {*} config
 */
function addEdit(config) {
  let queryData = config.newData[0].gen_table_columns.filter(
    (item) => item.is_insert == "1" || item.is_edit == "1"
  );
  queryData = queryData.sort((a, b) => a.column_id - b.column_id);
  let queryStr = "";
  queryData.forEach((element) => {
    if (element.html_type == "select") {
      queryStr += `<el-form-item label="${element.column_comment}" ${
        element.is_required ? `prop="${element.column_name}"` : ""
      }>
              <el-select v-model="queryParams.${
                element.column_name
              }" placeholder="请选择" clearable>
                <el-option
                  v-for="dict in dict.type.${element.dict_type}"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
        </el-form-item>`;
    } else if (element.html_type == "radio") {
      queryStr += `<el-form-item label="${element.column_comment}" ${
        element.is_required ? `prop="${element.column_name}"` : ""
      }>
              <el-radio-group v-model="queryParams.${element.column_name}" >
                <el-radio
                    v-for="dict in dict.type.${element.dict_type}"
                    :key="dict.value"
                    :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
        </el-form-item>`;
    } else {
      queryStr += `<el-form-item label="${element.column_comment}" ${
        element.is_required ? `prop="${element.column_name}"` : ""
      }>
            <el-${
              element.html_type ? element.html_type : "input"
            } v-model="form.${element.column_name}" placeholder="请输入${
        element.column_comment
      }" />
        </el-form-item>
          `;
    }
  });
  return queryStr;
}

/**
 * 添加表单校验
 * @param {*} config
 */
function addFormCheck(config) {
  let queryData = config.newData[0].gen_table_columns.filter(
    (item) => item.is_required && (item.is_edit || item.is_insert)
  );
  queryData = queryData.sort((a, b) => a.column_id - b.column_id);
  let queryStr = "";
  queryData.forEach((element) => {
    queryStr += `
    ${element.column_name}: [
        { required: true, message: "${element.column_comment}不能为空", trigger: "blur" }
      ],
    `;
  });
  return queryStr;
}

/**
 * 添加需要用到的字典列表
 * @param {*} config
 */
function addDictList(config) {
  let queryData = config.newData[0].gen_table_columns.filter(
    (item) => item.dict_type
  );
  queryData = queryData.map((item) => {
    return `"${item.dict_type}"`;
  });
  return queryData.join(",");
}

/**
 * 添加需要用到的查询${config.newData[0].table_comment}
 * @param {*} config
 */
function addQueryParams(config) {
  let queryData = config.newData[0].gen_table_columns.filter(
    (item) => item.is_query
  );
  let queryStr = "";
  queryData.forEach((item) => {
    queryStr += `
        ${item.column_name}:undefined,`;
  });
  return queryStr;
}

/**
 * 添加表单重置${config.newData[0].table_comment}
 * @param {*} config
 */
function addFormRest(config) {
  let queryData = config.newData[0].gen_table_columns.filter(
    (item) => item.is_query
  );
  let queryStr = "";
  queryData.forEach((item) => {
    if (item.column_type.indexOf("int") > -1) {
      queryStr += `
          ${item.column_name}:0,`;
    } else {
      queryStr += `
          ${item.column_name}:undefined,`;
    }
  });
  return queryStr;
}

/**
 * 下划线转驼峰方法
 */
function underlineToHump(str) {
  var a = str.split("_");
  var result = a[0];
  for (var i = 1; i < a.length; i++) {
    result = result + a[i].slice(0, 1).toUpperCase() + a[i].slice(1);
  }
  return result;
}

function buildView(config, primaryKeyHump) {
  // 生成 view 文件
  const viewFile = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "autoModule",
    "view",
    "src",
    "views",
    config.module,
    `${config.moduleName}.vue`
  );
  if (!fs.existsSync(viewFile)) {
    const viewCode = `
<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      ${addQuery(config)}
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:${config.moduleName}:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:${config.moduleName}:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:${config.moduleName}:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:${config.moduleName}:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      ${addTableCol(config)}
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:${config.moduleName}:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:${config.moduleName}:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改${config.newData[0].table_comment}对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        ${addEdit(config)}
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listPost, getPost, delPost, addPost, updatePost } from "@/api/${
      config.module
    }/${config.moduleName}";

export default {
  name: "${config.primaryKeyHub}",
  dicts: [${addDictList(config)}],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // ${config.newData[0].table_comment}表格数据
      postList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询${config.newData[0].table_comment}
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        ${addQueryParams(config)}
      },
      // 表单${config.newData[0].table_comment}
      form: {},
      // 表单校验
      rules: {
        ${addFormCheck(config)}
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询${config.newData[0].table_comment}列表 */
    getList() {
      this.loading = true;
      listPost(this.queryParams).then(response => {
        this.postList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        ${addFormRest(config)}
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.${config.primaryKeyHub})
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加${config.newData[0].table_comment}";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const ${config.primaryKeyHub} = row.${config.primaryKeyHub} || this.ids
      getPost(${config.primaryKeyHub}).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改${config.newData[0].table_comment}";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.${config.primaryKeyHub} != undefined) {
            updatePost(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPost(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ${config.primaryKeyHub}s = row.${config.primaryKeyHub} || this.ids;
      this.$modal.confirm('是否确认删除${
        config.newData[0].table_comment
      }编号为"' + ${config.primaryKeyHub}s + '"的数据项？').then(function() {
        return delPost(${config.primaryKeyHub}s);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('${config.module}/${config.moduleName}/export', {
        ...this.queryParams
      },\`${config.moduleName}_\${new Date().getTime()}.xlsx\`)
    }
  }
};
</script>

    `;
    fs.writeFileSync(viewFile, viewCode);
  }

  //生成api文件
  const apiFile = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "autoModule",
    "view",
    "src",
    "api",
    config.module,
    `${config.moduleName}.js`
  );

  if (!fs.existsSync(apiFile)) {
    const apiCode = `
import request from '@/utils/request'

// 查询${config.newData[0].table_comment}列表
export function list${config.moduleClass}(query) {
  return request({
    url: '/${config.module}/${config.moduleName}/list',
    method: 'get',
    params: query
  })
}

// 查询${config.newData[0].table_comment}详细
export function get${config.moduleClass}(${config.primaryKeyHub}) {
  return request({
    url: '/${config.module}/${config.moduleName}/' + ${config.primaryKeyHub},
    method: 'get'
  })
}

// 新增${config.newData[0].table_comment}配置
export function add${config.moduleClass}(data) {
  return request({
    url: '/${config.module}/${config.moduleName}',
    method: 'post',
    data: data
  })
}

// 修改${config.newData[0].table_comment}配置
export function update${config.moduleClass}(data) {
  return request({
    url: '/${config.module}/${config.moduleName}',
    method: 'put',
    data: data
  })
}

// 删除${config.newData[0].table_comment}配置
export function del${config.moduleClass}(${config.primaryKeyHub}) {
  return request({
    url: '/${config.module}/${config.moduleName}/' + ${config.primaryKeyHub},
    method: 'delete'
  })
}

    `;
    fs.writeFileSync(apiFile, apiCode);
  }

  console.log(`生成 ${config.moduleName} 前端文件成功！`);
}

module.exports = {
  buildView,
};
