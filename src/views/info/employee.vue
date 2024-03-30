<template>
  <div>
    <!-- 搜索栏 -->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input v-model="searchModel.account" placeholder="账号" clearable></el-input>
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
        <el-table-column prop="account" label="账号" width="120">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="100">
        </el-table-column>
        <el-table-column prop="gender" label="性别" width="100">
        </el-table-column>
        <el-table-column prop="folk" label="民族" width="100">
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号码" width="200">
        </el-table-column>
        <el-table-column prop="birthDate" label="出生日期" :formatter="dateFormat" width="200">
        </el-table-column>
        <el-table-column prop="marital" label="婚姻状况" width="100">
        </el-table-column>
        <el-table-column prop="hometown" label="籍贯" width="150">
        </el-table-column>
        <el-table-column prop="address" label="现居住地" width="200">
        </el-table-column>
        <el-table-column prop="educational" label="学历" width="80">
        </el-table-column>
        <el-table-column prop="health" label="健康状况" width="120">
        </el-table-column>
        <el-table-column prop="religious" label="宗教信仰" width="120">
        </el-table-column>
        <el-table-column prop="political" label="政治面貌" width="120">
        </el-table-column>
        <el-table-column prop="phone" label="联系方式" width="120">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="registrationDate" label="注册时间" :formatter="dateFormat" width="200">
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button @click="openEditUI(scope.row.id)" type="primary" icon="el-icon-edit" circle
              size="mini"></el-button>
            <el-button @click="deleteEmployee(scope.row)" type="danger" icon="el-icon-delete" circle
              size="mini"></el-button>
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
        <el-form-item v-if="employeeForm.id == null || employeeForm.id == undefined" label="账号" prop="account"
          :label-width="formLabelWidth">
          <el-input v-model="employeeForm.account" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="employeeForm.id == null || employeeForm.id == undefined" label="密码" prop="password"
          :label-width="formLabelWidth">
          <el-input type="password" v-model="employeeForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="employeeForm.id == null || employeeForm.id == undefined" label="确认密码" prop="passwordCheck"
          :label-width="formLabelWidth">
          <el-input type="password" v-model="employeeForm.passwordCheck" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name" :label-width="formLabelWidth">
          <el-input v-model="employeeForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-radio-group v-model="employeeForm.gender">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="民族" prop="folk" :label-width="formLabelWidth">
          <el-input v-model="employeeForm.folk" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码" prop="idCard" :label-width="formLabelWidth">
          <el-input v-model="employeeForm.idCard" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthDate" :label-width="formLabelWidth">
          <el-date-picker v-model="employeeForm.birthDate" type="date" placeholder="选择日期" :formatter="dateFormat">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="婚姻状况" prop="marital" :label-width="formLabelWidth">
          <el-select v-model="employeeForm.marital" placeholder="请选择">
            <el-option v-for="item in maritalList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="籍贯" prop="hometown" :label-width="formLabelWidth">
          <el-input v-model="employeeForm.hometown" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="现居住地" prop="address" :label-width="formLabelWidth">
          <el-input v-model="employeeForm.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学历" :label-width="formLabelWidth">
          <el-select v-model="employeeForm.educational" placeholder="请选择">
            <el-option v-for="item in educationalList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="健康状况" :label-width="formLabelWidth">
          <el-input v-model="employeeForm.health" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="宗教信仰" prop="religious" :label-width="formLabelWidth">
          <el-input v-model="employeeForm.religious" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="政治面貌" prop="political" :label-width="formLabelWidth">
          <el-select v-model="employeeForm.political" placeholder="请选择">
            <el-option v-for="item in politicalList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone" :label-width="formLabelWidth">
          <el-input v-model="employeeForm.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="employeeForm.email" autocomplete="off"></el-input>
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
    var checkAccount = (rule, value, callback) => {
      var reg = /^[a-zA-Z0-9_-]{4,16}$/;
      if (!reg.test(value)) {
        return callback(new Error('请输入正确的账号，长度为4到16位，可以包含字母、数字、"_"和"-"'));
      }
      callback();
    };
    var checkEmail = (rule, value, callback) => {
      var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (!reg.test(value)) {
        return callback(new Error('请输入正确的邮箱'));
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
      maritalList: [{
        value: '未婚',
        label: '未婚'
      }, {
        value: '已婚',
        label: '已婚'
      }, {
        value: '离婚',
        label: '离婚'
      }, {
        value: '丧偶',
        label: '丧偶'
      }],
      value: '',

      educationalList: [{
        value: '无',
        label: '无'
      }, {
        value: '小学',
        label: '小学'
      }, {
        value: '初中',
        label: '初中'
      }, {
        value: '高中',
        label: '高中'
      }, {
        value: '大学本科',
        label: '大学本科'
      }, {
        value: '硕士',
        label: '硕士'
      }, {
        value: '博士',
        label: '博士'
      }, {
        value: '中职',
        label: '中职'
      }, {
        value: '高职',
        label: '高职'
      }, {
        value: '大专',
        label: '大专'
      }],
      value: '',

      politicalList: [{
        value: '共产党员',
        label: '共产党员'
      }, {
        value: '共青团员',
        label: '共青团员'
      }, {
        value: '民主党派成员',
        label: '民主党派成员'
      }, {
        value: '群众',
        label: '群众'
      }, {
        value: '独立人士',
        label: '独立人士'
      }, {
        value: '无党派人士',
        label: '无党派人士'
      }],
      value: '',
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
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { validator: checkAccount, trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '性别不能为空', trigger: 'blur' }
        ],
        folk: [
          { required: true, message: '请输入你的民族', trigger: 'blur' }
        ],
        idCard: [
          { required: true, message: '请输入你的身份证号码', trigger: 'blur' }
        ],
        birth_date: [
          { required: true, message: '出生日期不能为空', trigger: 'blur' }
        ],
        marital: [
          { required: true, message: '婚姻状况不能为空', trigger: 'blur' }
        ],
        hometown: [
          { required: true, message: '请输入你的籍贯', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入你的现居住地', trigger: 'blur' }
        ],
        religious: [
          { required: true, message: '宗教信仰不能为空', trigger: 'blur' }
        ],
        political: [
          { required: true, message: '政治面貌不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: { //定义方法
    deleteEmployee(employee) {
      this.$confirm(`您确认删除用户 ${employee.name} ?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        employeeApi.deleteEmployeeById(employee.id).then(response => {
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
      if (id == null) {
        this.title = '新增用户';
      } else {
        this.title = '修改用户';
        //根据id查询用户数据
        employeeApi.getEmployeeById(id).then(response => {
          this.employeeForm = response.data;
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