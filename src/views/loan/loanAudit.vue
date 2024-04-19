<template>
  <div>
    <!-- 搜索栏 -->
    <el-card id="search">
      <el-row>
        <el-col :span="20" class="search-bar custom-search-bar">
          <el-input
            v-model="searchModel.loanNo"
            placeholder="贷款流水号"
            clearable
          ></el-input>
          <el-input
            v-model="searchModel.customerAccount"
            placeholder="客户账号"
            clearable
          ></el-input>
          <el-input
            v-model="searchModel.customerName"
            placeholder="客户姓名"
            clearable
          ></el-input>
          <el-input
            v-model="searchModel.customerPhone"
            placeholder="预留手机号码"
            clearable
          ></el-input>
          <el-select
            v-model="searchModel.auditType"
            clearable
            placeholder="审核状态"
          >
            <el-option
              v-for="item in auditTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="searchModel.loanStatus"
            clearable
            placeholder="贷款状态"
          >
            <el-option
              v-for="item in loanStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="searchModel.repayMethod"
            clearable
            placeholder="还款方式"
          >
            <el-option
              v-for="item in repayMethodList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-date-picker
            v-model="searchModel.applyDate"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="贷款申请开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
          <el-button
            @click="getLoanApplyList"
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
      <el-table :data="loanApplyList" stripe style="width: 100%">
        <el-table-column label="#" width="80">
          <template slot-scope="scope">
            {{
              (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1
            }}
          </template>
        </el-table-column>
        <el-table-column prop="loanNo" label="贷款流水号" width="150">
        </el-table-column>
        <el-table-column prop="customerAccount" label="客户账号" width="120">
        </el-table-column>
        <el-table-column prop="customerName" label="姓名" width="100">
        </el-table-column>
        <el-table-column prop="price" label="贷款金额" width="120">
        </el-table-column>
        <el-table-column prop="loanType" label="贷款类型" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.loanType == 1">个人贷款</el-tag>
            <el-tag v-if="scope.row.loanType == 2">商业贷款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="applyExecutor" label="贷款申请执行人" width="80">
        </el-table-column>
        <el-table-column
          prop="applyDate"
          label="申请日期"
          :formatter="dateFormat"
          width="200"
        >
        </el-table-column>
        <el-table-column prop="auditType" label="审核状态" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.auditType == 1">待审核</el-tag>
            <el-tag v-if="scope.row.auditType == 2">审核中</el-tag>
            <el-tag v-if="scope.row.auditType == 3" type="success"
              >已通过</el-tag
            >
            <el-tag v-if="scope.row.auditType == 4" type="danger"
              >已驳回</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="auditorName" label="审核人" width="80">
        </el-table-column>
        <el-table-column
          prop="auditDate"
          label="审核日期"
          :formatter="dateFormat"
          width="200"
        ></el-table-column>
        <el-table-column prop="auditOpinion" label="审核意见" width="200">
        </el-table-column>
        <el-table-column prop="loanStatus" label="贷款状态" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.loanStatus == 1">等待审核</el-tag>
            <el-tag v-if="scope.row.loanStatus == 2">待放款</el-tag>
            <el-tag v-if="scope.row.loanStatus == 3">放款中</el-tag>
            <el-tag v-if="scope.row.loanStatus == 4" type="success"
              >已放款</el-tag
            >
            <el-tag v-if="scope.row.loanStatus == 5" type="danger"
              >已驳回</el-tag
            >
            <el-tag v-if="scope.row.loanStatus == 6" type="info">已结清</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="interestRate" label="年利率" width="120">
        </el-table-column>
        <el-table-column prop="repayMethod" label="还款方式" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.repayMethod == 1" type="info"
              >等额本息还款</el-tag
            >
            <el-tag v-if="scope.row.repayMethod == 2" type="info"
              >等额本金还款</el-tag
            >
            <el-tag v-if="scope.row.repayMethod == 3" type="info"
              >按期付息</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="repayTerm" label="还款期数(月)" width="50">
        </el-table-column>
        <el-table-column
          prop="loanDate"
          label="贷款期限"
          :formatter="dateFormat"
          width="200"
        >
        </el-table-column>
        <el-table-column prop="lateChargeBase" label="逾期罚息基数" width="60">
        </el-table-column>
        <el-table-column prop="loanPurpose" label="贷款用途" width="150">
        </el-table-column>
        <el-table-column prop="customerPhone" label="客户联系方式" width="120">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              @click="openAuditUI(scope.row.id, 1)"
              type="primary"
              size="mini"
              v-if="scope.row.auditType == 1"
              >审核</el-button
            >
            <el-button
              @click="openAuditUI(scope.row.id, 2)"
              size="mini"
              type="danger"
              v-if="scope.row.auditType != 4 && 
              scope.row.loanStatus !=4 && 
              scope.row.loanStatus !=5 && 
              scope.row.loanStatus !=6"
              >驳回</el-button
            >
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

    <!-- 贷款审核对话框 -->
    <el-dialog
      @close="clearAuditForm"
      :title="auditTitle"
      :visible.sync="auditFormVisible"
    >
      <el-form :model="auditLoanForm" ref="auditLoanFormRef" :rules="auditRules">
        <el-form-item
          label="审核意见"
          prop="auditOpinion"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="auditLoanForm.auditOpinion"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="auditFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="opLoan()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import loanApplyApi from "@/api/loanApplyManage"; //导入Api
import auditLoanApi from "@/api/auditLoanManage"; //导入Api
import moment from "moment"; //导入日期处理包
export default {
  data() {
    
    return {
      //简单变量
      op: 0,
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      //审核状态(1待审核、2审核中、3已通过、4已驳回)
      auditTypeList: [
        {
          value: "1",
          label: "待审核",
        },
        {
          value: "2",
          label: "审核中",
        },
        {
          value: "3",
          label: "已通过",
        },
        {
          value: "4",
          label: "已驳回",
        },
      ],
      //贷款状态(1等待审核、2待放款、3放款中、4已放款、5已驳回、6已结清)
      loanStatusList: [
        {
          value: "1",
          label: "等待审核",
        },
        {
          value: "2",
          label: "待放款",
        },
        {
          value: "3",
          label: "放款中",
        },
        {
          value: "4",
          label: "已放款",
        },
        {
          value: "5",
          label: "已驳回",
        },
        {
          value: "6",
          label: "已结清",
        },
      ],
      //还款方式(1等额本息还款、2等额本金还款、3按期付息)
      repayMethodList: [
        {
          value: "1",
          label: "等额本息还款",
        },
        {
          value: "2",
          label: "等额本金还款",
        },
        {
          value: "3",
          label: "按期付息",
        },
      ],
      value: "",
      formLabelWidth: "130px",
      auditLoanForm: {
        id: 0,
      },
      auditId: 0,
      auditFormVisible: false,
      auditTitle: "",
      total: 0,
      searchModel: {
        pageNo: 1,
        pageSize: 10,
      },
      loanApplyList: [],
      auditRules: {
        auditOpinion: [
          { required: true, message: "请输入审核意见", trigger: "blur" },
        ]
      },
    };
  },

  methods: {
    // 编写日期格式化方法
    dateFormat: function (row, column) {
      const date = row[column.property];
      if (date === undefined || date === null) {
        return "";
      }
      // 这里的格式根据需求修改
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    opLoan(){
      if(this.op === 1){
        auditLoan();
      }else if(this.op === 2){
        rejectLoan();
      }
    },
    auditLoan() {
      this.auditLoanForm.id = this.auditId;
      //触发表单验证
      this.$refs.auditLoanFormRef.validate((valid) => {
        //valid就是验证结果
        if (valid) {
          //提交请求给后台
          auditLoanApi.auditLoan(this.auditLoanForm).then((response) => {
            //已经提交成功，then里面是提交之后要做的处理,response是后端返回的内容
            //成功提示
            this.$message({
              message: response.message,
              type: "success",
            });
            //关闭对话框
            this.auditFormVisible = false;
            //刷新展示表格
            this.getLoanApplyList();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    rejectLoan() {
      this.auditLoanForm.id = this.auditId;
      //触发表单验证
      this.$refs.auditLoanFormRef.validate((valid) => {
        //valid就是验证结果
        if (valid) {
          //提交请求给后台
          auditLoanApi.rejectLoan(this.auditLoanForm).then((response) => {
            //已经提交成功，then里面是提交之后要做的处理,response是后端返回的内容
            //成功提示
            this.$message({
              message: response.message,
              type: "success",
            });
            //关闭对话框
            this.auditFormVisible = false;
            //刷新展示表格
            this.getLoanApplyList();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    clearAuditForm() {
      this.auditLoanForm = {};
      this.auditId = 0;
      this.op = 0;
      this.$refs.auditLoanFormRef.clearValidate();
    },
    openAuditUI(id, op) {
      this.op = op;
      this.auditTitle = "贷款审核";
      this.auditFormVisible = true;
      this.auditId = id;
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize;
      this.getLoanApplyList();
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo;
      this.getLoanApplyList();
    },
    getLoanApplyList() {
      loanApplyApi.getLoanApplyList(this.searchModel).then((response) => {
        this.loanApplyList = response.data.rows;
        this.loanApplyList.forEach((row)=>{
          row.termRepayInterest = row.termRepayInterest === null ? "按期计算": row.termRepayInterest;
          row.termRepayPrice = row.termRepayPrice === null ? "按期计算": row.termRepayPrice;
          row.termRepayPrincipal = row.termRepayPrincipal === null ? "按期计算": row.termRepayPrincipal; 
        })
        this.total = response.data.total;
      });
    },
  },
  created() {
    this.getLoanApplyList();
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

.custom-search-bar .el-input,
.custom-search-bar .el-button {
  margin-bottom: 10px; /* 调整搜索栏之间的下方间距 */
  margin-left: 10px;
}
</style>
