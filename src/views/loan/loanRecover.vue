<template>
  <div>
    <!-- 搜索栏 -->
    <el-card id="search">
      <el-row>
        <el-col :span="20" class="search-bar custom-search-bar">
          <el-input v-model="searchModel.loanNo" placeholder="贷款流水号" clearable></el-input>
          <el-input v-model="searchModel.loanRecoverNo" placeholder="贷款收回流水号" clearable></el-input>
          <el-input v-model="searchModel.customerAccount" placeholder="客户账号" clearable></el-input>
          <el-input v-model="searchModel.customerName" placeholder="客户姓名" clearable></el-input>
          <el-input v-model="searchModel.customerPhone" placeholder="预留手机号码" clearable></el-input>
          <el-select v-model="searchModel.termStatus" clearable placeholder="还款状态">
            <el-option v-for="item in termStatusList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-date-picker v-model="searchModel.repayDate" type="daterange" align="right" unlink-panels
            range-separator="至" start-placeholder="还款开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
          </el-date-picker>
          <el-button @click="getLoanRecoverList" type="primary" round icon="el-icon-search">查询</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 结果列表 -->
    <el-card>
      <el-table :data="loanRecoverList" stripe style="width: 100%">
        <el-table-column label="#" width="80">
          <template slot-scope="scope">
            {{
          (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1
        }}
          </template>
        </el-table-column>
        <el-table-column prop="loanNo" label="贷款流水号" width="150">
        </el-table-column>
        <el-table-column prop="loanRecoverNo" label="贷款收回流水号" width="150">
        </el-table-column>
        <el-table-column prop="customerAccount" label="客户账号" width="120">
        </el-table-column>
        <el-table-column prop="customerName" label="姓名" width="100">
        </el-table-column>
        <el-table-column prop="price" label="贷款金额" width="120">
        </el-table-column>
        <el-table-column prop="termRepayPrice" label="还款金额" width="110">
        </el-table-column>
        <el-table-column
          prop="termRepayPrincipal"
          label="还款本金"
          width="110"
        >
        </el-table-column>
        <el-table-column
          prop="termRepayInterest"
          label="还款利息"
          width="110"
        >
        </el-table-column>
        <el-table-column
          prop="repayDate"
          label="还款日期"
          :formatter="dateFormat"
          width="200"
        ></el-table-column>
        <el-table-column prop="termStatus" label="还款状态" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.loanStatus == 1">待还款</el-tag>
            <el-tag v-if="scope.row.loanStatus == 2" type="success">当期已结清</el-tag>
            <el-tag v-if="scope.row.loanStatus == 3" type="success">提前全部结清</el-tag>
            <el-tag v-if="scope.row.loanStatus == 4" type="warning"
              >已延期</el-tag
            >
            <el-tag v-if="scope.row.loanStatus == 5" type="danger"
              >已逾期</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="actualRepayPrice" label="实际还款金额" width="110"></el-table-column>
        <el-table-column
          prop="actualRepayDate"
          label="实际还款日期"
          :formatter="dateFormat"
          width="200"
        ></el-table-column>
        <el-table-column prop="delayNum" label="延期月数" width="60">
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
        <el-table-column prop="interestRate" label="利率(年)" width="120">
        </el-table-column>
        <el-table-column prop="interestRateAdjust" label="利率调整" width="120">
        </el-table-column>
        <el-table-column prop="lateChargeBase" label="逾期罚息基数" width="60">
        </el-table-column>
        <el-table-column prop="currentTerm" label="当前期数" width="120">
        </el-table-column>
        <el-table-column prop="remainTerm" label="剩余期数" width="120">
        </el-table-column>
        <el-table-column prop="balance" label="剩余本金" width="120">
        </el-table-column>
        <el-table-column prop="customerPhone" label="客户联系方式" width="120">
        </el-table-column>
        <el-table-column label="操作" width="150">
          
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分页组件 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="searchModel.pageNo" :page-sizes="[5, 10, 20, 50]" :page-size="searchModel.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!-- 贷款审核对话框 -->
    <el-dialog @close="clearAuditForm" :title="auditTitle" :visible.sync="auditFormVisible">
      <el-form :model="auditLoanForm" ref="auditLoanFormRef" :rules="auditRules">
        <el-form-item label="审核意见" prop="auditOpinion" :label-width="formLabelWidth">
          <el-input v-model="auditLoanForm.auditOpinion" autocomplete="off"></el-input>
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
import loanRecoverApi from "@/api/loanRecoverManage"; //导入Api
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
      //当期还款状态(1待还款、2当期已结清、3提前结清、4已延期、5已逾期)
      termStatusList: [
        {
          value: "1",
          label: "待还款",
        },
        {
          value: "2",
          label: "当期已结清",
        },
        {
          value: "3",
          label: "提前结清",
        },
        {
          value: "4",
          label: "已延期",
        },
        {
          value: "5",
          label: "已逾期",
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
      loanRecoverList: [],
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
    opLoan() {
      if (this.op === 1) {
        this.auditLoan();
      } else if (this.op === 2) {
        this.rejectLoan();
      }
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize;
      this.getLoanRecoverList();
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo;
      this.getLoanRecoverList();
    },
    getLoanRecoverList() {
      loanRecoverApi.getLoanRecoverList(this.searchModel).then((response) => {
        this.loanRecoverList = response.data.rows;
        this.total = response.data.total;
      });
    },
  },
  created() {
    this.getLoanRecoverList();
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
  margin-bottom: 10px;
  /* 调整搜索栏之间的下方间距 */
  margin-left: 10px;
}
</style>
