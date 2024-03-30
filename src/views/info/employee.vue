<template>
  <div>
    <!-- 搜索栏 -->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input v-model="searchModel.id" placeholder="职工号" clearable></el-input>
          <el-input v-model="searchModel.name" placeholder="姓名" clearable></el-input>
          <el-input v-model="searchModel.phone" placeholder="电话" clearable></el-input>
          <el-button @click="getEmployeeList" type="primary" round icon="el-icon-search">查询</el-button>
        </el-col>
        <el-col :span="4" align="right">
          <el-button @click="openEditUI(null)" type="primary" round icon="el-icon-plus" circle></el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 结果列表 -->
    <el-card>
      <el-table :data="employeeList" stripe style="width: 100%">
        <el-table-column label="#" width="100">
          <template slot-scope="scope">
            {{ (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="id" label="职工号" width="120">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="100">
        </el-table-column>
        <el-table-column prop="gender" label="性别" width="100">
        </el-table-column>
        <el-table-column prop="age" label="年龄" width="100">
        </el-table-column>
        <el-table-column prop="phone" label="电话" width="120">
        </el-table-column>
        <el-table-column prop="position" label="职位" width="120">
        </el-table-column>
        <el-table-column prop="hireDate" label="加入时间" :formatter="dateFormat">
        </el-table-column>
        <el-table-column prop="salary" label="薪资" width="120">
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button @click="openEditUI(scope.row.id)" type="primary" icon="el-icon-edit" circle size="mini"></el-button>
            <el-button @click="deleteEmployee(scope.row)" type="danger" icon="el-icon-delete" circle size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分页组件 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="searchModel.pageNo" :page-sizes="[5, 10, 20, 50]" :page-size="searchModel.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!-- 用户信息编辑对话框 -->
    <el-dialog @close="clearForm" :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="employeeForm" ref="employeeFormRef" :rules="rules">
        <el-form-item label="姓名" prop="name" :label-width="formLabelWidth">
          <el-input v-model="employeeForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="employeeForm.id == null || employeeForm.id == undefined" label="密码" prop="password" :label-width="formLabelWidth">
          <el-input type="password" v-model="employeeForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="employeeForm.id == null || employeeForm.id == undefined" label="确认密码" prop="passwordCheck" :label-width="formLabelWidth">
          <el-input type="password" v-model="employeeForm.passwordCheck" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-radio-group v-model="employeeForm.gender">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" :label-width="formLabelWidth">
          <el-input v-model="employeeForm.age" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone" :label-width="formLabelWidth">
          <el-input v-model="employeeForm.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="职位" :label-width="formLabelWidth">
          <el-input v-model="employeeForm.position" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="薪资" :label-width="formLabelWidth">
          <el-input v-model="employeeForm.salary" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEmployee">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import employeeApi from '@/api/employeeManage' //导入Api
import moment from 'moment' //导入日期处理包
export default {
  data() { //数据处理
    var checkPhone = (rule, value, callback) => {
      var reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (!reg.test(value)) {
        return callback(new Error('请输入正确的电话号码'));
      }
      callback();
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.employeeForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return { //简单变量
      formLabelWidth: '130px',
      employeeForm: {

      },
      dialogFormVisible: false,
      title: "",
      total: 0,
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      employeeList: [],
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录初始密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        passwordCheck: [
          { validator: validatePass, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
      }
    }
  },
  methods: { //定义方法
    deleteEmployee(employee){
      this.$confirm(`您确认删除用户 ${employee.name} ?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          employeeApi.deleteEmployeeById(employee.id).then(response=>{
            this.$message({
            type: 'success',
            message: response.message
          });
          this.getEmployeeList();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 编写日期格式化方法
    dateFormat: function (row, column) {
      console.log(row, column)
      const date = row[column.property]
      if (date === undefined) {
        return ''
      }
      // 这里的格式根据需求修改
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    saveEmployee() {
      //触发表单验证
      this.$refs.employeeFormRef.validate((valid) => {//valid就是验证结果
        if (valid) {
          //提交请求给后台
          employeeApi.saveEmployee(this.employeeForm).then(response => {
            //已经提交成功，then里面是提交之后要做的处理,response是后端返回的内容
            //成功提示
            this.$message({
              message: response.message,
              type: 'success'
            });
            //关闭对话框
            this.dialogFormVisible = false;
            //刷新展示表格
            this.getEmployeeList();
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    clearForm() {
      this.employeeForm = {};
      this.$refs.employeeFormRef.clearValidate();
    },
    openEditUI(id) {
      if(id==null){
        this.title = '新增用户';
      }else{
        this.title = '修改用户';
        //根据id查询用户数据
        employeeApi.getEmployeeById(id).then(response =>{
          this.employeeForm=response.data;
        });
      }
      this.dialogFormVisible = true;
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize;
      this.getEmployeeList();
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo;
      this.getEmployeeList();
    },
    getEmployeeList() {
      employeeApi.getEmployeeList(this.searchModel).then(response => {
        this.employeeList = response.data.rows;
        this.total = response.data.total;
      });
    }
  },
  created() {
    this.getEmployeeList();
  }
}
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