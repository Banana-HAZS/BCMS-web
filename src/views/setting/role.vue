<template>
  <div>
    <!-- 搜索栏 -->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input
            v-model="searchModel.account"
            placeholder="账号"
            clearable
          ></el-input>
          <el-input
            v-model="searchModel.name"
            placeholder="姓名"
            clearable
          ></el-input>
          <el-input
            v-model="searchModel.phone"
            placeholder="电话"
            clearable
          ></el-input>
          <el-button
            @click="getRoleList"
            type="primary"
            round
            icon="el-icon-search"
            >查询</el-button
          >
        </el-col>
      </el-row>
    </el-card>

    <!-- 结果列表 -->
    <el-card>
      <el-table :data="roleList" stripe style="width: 100%">
        <el-table-column label="#" width="100">
          <template slot-scope="scope">
            {{
              (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1
            }}
          </template>
        </el-table-column>
        <el-table-column prop="account" label="账号" width="120">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="100">
        </el-table-column>
        <el-table-column prop="workTime" label="在职时间(天)" width="120">
        </el-table-column>
        <el-table-column prop="num" label="累计处理业务次数" width="200">
        </el-table-column>
        <el-table-column prop="roleName" label="当前权限" width="120">
        </el-table-column>
        <el-table-column
          prop="registrationDate"
          label="入职时间"
          :formatter="dateFormat"
          width="200"
        >
        </el-table-column>
        <el-table-column prop="phone" label="联系方式" width="120">
        </el-table-column>

        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              @click="openEditUI(scope.row.id)"
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchModel.pageNo"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="searchModel.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!-- 用户信息编辑对话框 -->
    <el-dialog
      @close="clearForm"
      :title="title"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="roleForm" ref="roleFormRef">
        <el-form-item label="权限" :label-width="formLabelWidth">
          <el-radio-group v-model="roleForm.roleId">
            <el-radio :label="1">一级管理员</el-radio>
            <el-radio :label="2">二级管理员</el-radio>
            <el-radio :label="3">三级管理员</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import roleApi from "@/api/roleManage"; //导入Api
import moment from "moment"; //导入日期处理包
export default {
  data() {
    return {
      value: "",
      formLabelWidth: "130px",
      roleForm: {},
      dialogFormVisible: false,
      title: "",
      total: 0,
      searchModel: {
        pageNo: 1,
        pageSize: 10,
      },
      roleList: [],
    };
  },
  methods: {
    //定义方法
    // 编写日期格式化方法
    dateFormat: function (row, column) {
      const date = row[column.property];
      if (date === undefined) {
        return "";
      }
      // 这里的格式根据需求修改
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    updateRole() {
      //触发表单验证
      this.$refs.roleFormRef.validate((valid) => {
        //valid就是验证结果
        if (valid) {
          //提交请求给后台
          roleApi.updateRole(this.roleForm).then((response) => {
            //已经提交成功，then里面是提交之后要做的处理,response是后端返回的内容
            //成功提示
            this.$message({
              message: response.message,
              type: "success",
            });
            //关闭对话框
            this.dialogFormVisible = false;
            //刷新展示表格
            this.getRoleList();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    clearForm() {
      this.roleForm = {};
      this.$refs.roleFormRef.clearValidate();
    },
    openEditUI(id) {
      this.title = "修改权限";
      //根据id查询用户数据
      roleApi.getRoleById(id).then((response) => {
        this.roleForm = response.data;
      });
      this.dialogFormVisible = true;
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize;
      this.getRoleList();
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo;
      this.getRoleList();
    },
    getRoleList() {
      roleApi.getRoleList(this.searchModel).then((response) => {
        this.roleList = response.data.rows;
        this.total = response.data.total;
      });
    },
  },
  created() {
    this.getRoleList();
  },
};
</script>

<style>
#search .el-input {
  width: 250px;
  margin-right: 10px;
}

.el-dialog .el-input {
  width: 85%;
}
</style>
