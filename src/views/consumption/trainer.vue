<template>
  <div>
    <!-- 搜索栏 -->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input v-model="searchModel.memberId" placeholder="会员号" clearable></el-input>
          <el-input v-model="searchModel.memberName" placeholder="会员名" clearable></el-input>
          <el-input v-model="searchModel.trainerName" placeholder="教练名" clearable></el-input>
          <el-button @click="getMemberTrainerList" type="primary" round icon="el-icon-search">查询</el-button>
        </el-col>
        <el-col :span="4" align="right">
          <el-button @click="openEditUI(null)" type="primary" round icon="el-icon-plus" circle></el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 结果列表 -->
    <el-card>
      <el-table :data="memberTrainerList" stripe style="width: 100%">
        <el-table-column label="#" width="100">
          <template slot-scope="scope">
            {{ (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="memberId" label="会员号" width="100">
        </el-table-column>
        <el-table-column prop="memberName" label="会员名" width="120">
        </el-table-column>
        <el-table-column prop="trainerName" label="教练名" width="80">
        </el-table-column>
        <el-table-column prop="fee" label="费用" width="100">
        </el-table-column>
        <el-table-column prop="actualPay" label="实际支付(元)" width="120">
        </el-table-column>
        <el-table-column prop="startDate" label="开始时间" width="180" :formatter="dateFormat">
        </el-table-column>
        <el-table-column prop="endDate" label="结束时间" width="180" :formatter="dateFormat">
        </el-table-column>
        <el-table-column prop="state" label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state == 1" type="success">正常</el-tag>
            <el-tag v-if="scope.row.state == 2" type="danger">已过期</el-tag>
            <el-tag v-if="scope.row.state == 3" type="warning">退款中</el-tag>
            <el-tag v-if="scope.row.state == 4" type="info">已退款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button @click="openEditUI(scope.row.memberId)" type="primary" icon="el-icon-edit" circle
              size="mini"></el-button>
            <el-button @click="refund(scope.row, scope.row.memberId)" type="warning" size="mini">退款</el-button>
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
      <el-form :model="memberTrainerForm" ref="memberTrainerFormRef" :rules="rules">
        <el-form-item label="会员号" prop="memberId" :label-width="formLabelWidth">
          <el-input v-model="memberTrainerForm.memberId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="会员姓名" prop="memberName" :label-width="formLabelWidth">
          <el-input v-model="memberTrainerForm.memberName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="教练名" prop="trainerName" :label-width="formLabelWidth">
          <el-input v-model="memberTrainerForm.trainerName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="费用" :label-width="formLabelWidth">
          <el-input v-model="memberTrainerForm.fee" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="实际支付" prop="actualPay" :label-width="formLabelWidth">
          <el-input v-model="memberTrainerForm.actualPay" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="结束时间" prop="endDate" :label-width="formLabelWidth">
          <el-date-picker v-model="memberTrainerForm.endDate" type="date" placeholder="选择日期" :formatter="dateFormat">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveMemberTrainer">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import memberTrainerApi from '@/api/memberTrainerManage' //导入Api
import moment from 'moment' //导入日期处理包
export default {
  data() { //数据处理
    return { //简单变量
      isAdd: 0,
      formLabelWidth: '130px',
      memberTrainerForm: {

      },
      dialogFormVisible: false,
      title: "",
      total: 0,
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      memberTrainerList: [],
      rules: {
        memberId: [
          { required: true, message: '请输入会员账号', trigger: 'blur' }
        ],
        memberName: [
          { required: true, message: '请输入会员姓名', trigger: 'blur' }
        ],
        trainerName: [
          { required: true, message: '请输入私教教练名称', trigger: 'blur' }
        ],
        actualPay: [
          { required: true, message: '请输入实际支付金额', trigger: 'blur' }
        ],
        endDate: [
          { required: true, message: '请输入结束时间', trigger: 'blur' }
        ]
      }
    }
  },
  methods: { //定义方法
    refund(memberTrainer, memberId) {
      this.$confirm(`请确认是否退款?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        memberTrainerApi.refund(memberTrainer).then(response => {
          this.$message({
            type: 'info',
            message: response.message
          });
          this.getMemberTrainerList();
          setTimeout(function () {
            memberTrainerApi.getMemberTrainerById(memberId).then(response => {
              memberTrainerApi.refund(response.data)
            });
          }, 3000)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退款'
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
    addZero: function (str) {
      // 根据 - 符号拆分
      return str
        .split("-")
        .map((item) => {
          // +item 将item字符串转换为数字
          // 小于10的时候就补全一个前缀0
          if (+item < 10) {
            return "0" + +item;
          }

          // 大于10的时候不用补0
          return item;
        })
        .join("-"); // 最后重组回来
    },
    dateTimeFormat() {
      this.memberTrainerForm.endDate = this.addZero((this.memberTrainerForm.endDate).toLocaleDateString().split('/').join('-'));
      if (this.memberTrainerForm.endDate.length < 11) {
        this.memberTrainerForm.endDate = this.memberTrainerForm.endDate + ' 00:00:00';
      }
      console.log(this.memberTrainerForm.endDate)
    },
    saveMemberTrainer() {
      //触发表单验证
      this.$refs.memberTrainerFormRef.validate((valid) => {//valid就是验证结果
        if (valid) {
          //提交请求给后台
          this.dateTimeFormat();
          memberTrainerApi.saveMemberTrainer(this.memberTrainerForm, this.isAdd).then(response => {
            //已经提交成功，then里面是提交之后要做的处理,response是后端返回的内容
            //成功提示
            this.$message({
              message: response.message,
              type: 'success'
            });
            //关闭对话框
            this.dialogFormVisible = false;
            //刷新展示表格
            this.getMemberTrainerList();
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    clearForm() {
      this.memberTrainerForm = {};
      this.$refs.memberTrainerFormRef.clearValidate();
    },
    openEditUI(memberId) {
      if (memberId == null) {
        this.isAdd = 1;
        this.title = '新增私教消费记录';
      } else {
        this.isAdd = 0;
        this.title = '修改私教消费记录';
        //根据id查询用户数据
        memberTrainerApi.getMemberTrainerById(memberId).then(response => {
          this.memberTrainerForm = response.data;
        });
      }
      this.dialogFormVisible = true;
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize;
      this.getMemberTrainerList();
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo;
      this.getMemberTrainerList();
    },
    getMemberTrainerList() {
      memberTrainerApi.getMemberTrainerList(this.searchModel).then(response => {
        memberTrainerApi.expiredOrNot();
        this.memberTrainerList = response.data.rows;
        this.total = response.data.total;
      });
    }
  },
  created() {
    this.getMemberTrainerList();
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