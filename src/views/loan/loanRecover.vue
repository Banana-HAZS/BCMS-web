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
            v-model="searchModel.loanRecoverNo"
            placeholder="贷款收回流水号"
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
            v-model="searchModel.termStatus"
            clearable
            placeholder="还款状态"
          >
            <el-option
              v-for="item in termStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="searchModel.remindStatus"
            clearable
            placeholder="提醒状态"
          >
            <el-option
              v-for="item in remindStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-date-picker
            v-model="searchModel.repayDate"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="还款开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
          <el-button
            @click="getLoanRecoverList"
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
        <el-table-column
          prop="loanRecoverNo"
          label="贷款收回流水号"
          width="150"
        >
        </el-table-column>
        <el-table-column prop="customerAccount" label="客户账号" width="120">
        </el-table-column>
        <el-table-column prop="customerName" label="姓名" width="100">
        </el-table-column>
        <el-table-column prop="price" label="贷款金额" width="120">
        </el-table-column>
        <el-table-column prop="termRepayPrice" label="本期还款金额" width="110">
        </el-table-column>
        <el-table-column
          prop="termRepayPrincipal"
          label="本期还款本金"
          width="110"
        >
        </el-table-column>
        <el-table-column
          prop="termRepayInterest"
          label="本期还款利息"
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
            <el-tag v-if="scope.row.termStatus == 1">待还款</el-tag>
            <el-tag v-if="scope.row.termStatus == 2" type="success"
              >当期已结清</el-tag
            >
            <el-tag v-if="scope.row.termStatus == 3" type="success"
              >提前全部结清</el-tag
            >
            <el-tag v-if="scope.row.termStatus == 4" type="warning"
              >已延期</el-tag
            >
            <el-tag v-if="scope.row.termStatus == 5" type="danger"
              >已逾期</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="actualRepayPrice"
          label="实际还款金额"
          width="110"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.actualRepayPrice">{{
              scope.row.actualRepayPrice
            }}</span>
            <span v-else>待还款</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="remainRepayPrice"
          label="剩余待还金额"
          width="110"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.remainRepayPrice">{{
              scope.row.remainRepayPrice
            }}</span>
            <span v-else>已结清</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="actualRepayDate"
          label="实际结清日期"
          width="200"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.actualRepayDate">
              {{
                moment(scope.row.actualRepayDate).format("YYYY-MM-DD HH:mm:ss")
              }}
            </span>
            <span v-else>待结清</span>
          </template>
        </el-table-column>
        <el-table-column prop="delayTerm" label="延期期数" width="60">
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
        <el-table-column prop="lateCharge" label="逾期罚息" width="120">
        </el-table-column>
        <el-table-column prop="currentTerm" label="当前期数" width="120">
        </el-table-column>
        <el-table-column prop="remainTerm" label="剩余期数" width="120">
        </el-table-column>
        <el-table-column prop="balance" label="当期本金参考" width="120">
        </el-table-column>
        <el-table-column prop="remindStatus" label="提醒状态" width="110">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.remindStatus == '1'" type="info"
              >暂无</el-tag
            >
            <el-tag v-if="scope.row.remindStatus == '2'" type="warning"
              >还款提醒</el-tag
            >
            <el-tag v-if="scope.row.remindStatus == '3'" type="success"
              >已提醒</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="customerPhone" label="客户联系方式" width="120">
        </el-table-column>
        <el-table-column label="操作" width="350">
          <template slot-scope="scope">
            <el-button
              @click="openRepayUI(scope.row)"
              type="success"
              size="mini"
              v-if="
                scope.row.termStatus == 1 ||
                scope.row.termStatus == 4 ||
                scope.row.termStatus == 5
              "
              >还款</el-button
            >
            <el-button
              @click="earlyPayoff(scope.row)"
              type="success"
              size="mini"
              v-if="scope.row.termStatus != 3 && scope.row.termStatus != 2"
              >提前结清</el-button
            >
            <el-button
              @click="openDelayUI(scope.row)"
              type="warning"
              size="mini"
              v-if="scope.row.termStatus == 1"
              >展期</el-button
            >
            <el-button
              @click="confirmRemind(scope.row.id)"
              type="warning"
              size="mini"
              v-if="scope.row.remindStatus == 2"
              >确认提醒</el-button
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

    <!-- 还款对话框 -->
    <el-dialog
      @close="clearRepayForm"
      title="还款"
      :visible.sync="repayFormVisible"
    >
      <el-form :model="repayForm" ref="repayFormRef" :rules="repayRules">
        <el-form-item
          label="还款金额"
          prop="repayPrice"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="repayForm.repayPrice"
            autocomplete="off"
            @input="onRepayPriceChange"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="repayFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="repay()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 贷款展期对话框 -->
    <el-dialog
      @close="clearDelayForm"
      title="贷款展期"
      :visible.sync="delayFormVisible"
    >
      <el-form :model="delayForm" ref="delayFormRef" :rules="delayRules">
        <el-form-item
          label="展期金额"
          prop="delayPrice"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="delayForm.delayPrice"
            autocomplete="off"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="展期开始日期"
          prop="delayStartDate"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="delayForm.delayStartDate"
            autocomplete="off"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="展期结束日期"
          prop="delayEndDate"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="delayForm.delayEndDate"
            autocomplete="off"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="展期期数"
          prop="delayTerms"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="delayForm.delayTerms"
            autocomplete="off"
            @change="calculateDelayEndDate"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="展期手续费"
          prop="delayCharge"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="delayForm.delayCharge"
            autocomplete="off"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="展期手续费基数"
          prop="delayChargeBase"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="delayForm.delayChargeBase"
            autocomplete="off"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="展期利率调整"
          prop="delayInterestAdjust"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="delayForm.delayInterestAdjust"
            autocomplete="off"
            :disabled="true"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delayFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="delayPayoff()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import loanRecoverApi from "@/api/loanRecoverManage"; //导入Api
import moment from "moment"; //导入日期处理包
export default {
  data() {
    var validatePositiveNumber = (rule, value, callback) => {
      var reg = /^\d+(\.\d+)?$/;
      if (!reg.test(value)) {
        return callback(new Error("请输入正确的格式"));
      }
      callback();
    };

    return {
      //简单变量
      moment: moment,
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
      remindStatusList: [
        {
          value: "1",
          label: "暂无",
        },
        {
          value: "2",
          label: "还款提醒",
        },
        {
          value: "3",
          label: "已提醒",
        }
      ],
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
      repayForm: {
        id: 0,
        repayPrice: 0,
      },
      delayForm: {
        id: 0,
      },
      repayFormVisible: false,
      delayFormVisible: false,
      total: 0,
      searchModel: {
        pageNo: 1,
        pageSize: 10,
      },
      loanRecoverList: [],
      repayRules: {
        repayPrice: [
          {
            required: true,
            message: "请输入还款金额",
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              const floatValue = parseFloat(value);
              if (floatValue < 0.01) {
                callback(new Error("还款金额不能小于0.01"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
      delayRules: {
        delayTerms: [
          { required: true, message: "展期期数不能为空", trigger: "blur" },
          { validator: validatePositiveNumber, trigger: "blur" },
        ],
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
    calculateDelayEndDate() {
      if (this.delayForm.delayStartDate && this.delayForm.delayTerms) {
        const startDate = new Date(this.delayForm.delayStartDate);
        const delayTerms = parseInt(this.delayForm.delayTerms);
        const endDate = new Date(
          startDate.getTime() + delayTerms * 30 * 24 * 60 * 60 * 1000
        );
        this.delayForm.delayEndDate = this.formatDate(endDate);
      } else {
        this.delayForm.delayEndDate = "";
      }
      this.$forceUpdate();
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    clearRepayForm() {
      this.repayForm = {};
      this.$refs.repayFormRef.clearValidate();
    },
    clearDelayForm() {
      this.delayForm = {};
      this.$refs.delayFormRef.clearValidate();
    },
    async onRepayPriceChange(value) {
      if (value == null || value == undefined) {
        return;
      }
      this.repayForm.repayPrice = value;
      await this.$forceUpdate();
    },
    openRepayUI(row) {
      this.repayFormVisible = true;
      this.repayForm.id = row.id;
      this.repayForm.repayPrice = row.remainRepayPrice;
    },
    async openDelayUI(row) {
      this.delayForm.id = row.id;
      this.delayForm.delayPrice = row.remainRepayPrice;
      this.delayForm.delayStartDate = moment(row.repayDate).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      await this.initDelayForm();
      this.delayFormVisible = true;
    },
    async initDelayForm() {
      const response = await loanRecoverApi.initDelayForm();
      this.delayForm.delayChargeBase = response.data.delayChargeBase;
      this.delayForm.delayInterestAdjust = response.data.delayInterestAdjust;
      this.delayForm.delayCharge =
        this.delayForm.delayPrice * this.delayForm.delayChargeBase;
    },
    repay() {
      //触发表单验证
      this.$refs.repayFormRef.validate((valid) => {
        //valid就是验证结果
        if (valid) {
          //提交请求给后台
          loanRecoverApi.repay(this.repayForm).then((response) => {
            //已经提交成功，then里面是提交之后要做的处理,response是后端返回的内容
            //成功提示
            this.$message({
              message: response.message,
              type: "success",
            });
            //关闭对话框
            this.repayFormVisible = false;
            //刷新展示表格
            this.getLoanRecoverList();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    delayPayoff() {
      this.$refs.delayFormRef.validate((valid) => {
        if (valid) {
          // 手动格式化 delayStartDate 和 delayEndDate 属性
          this.delayForm.delayStartDate = moment(
            this.delayForm.delayStartDate
          ).format("YYYY-MM-DDTHH:mm:ss");
          this.delayForm.delayEndDate = moment(
            this.delayForm.delayEndDate
          ).format("YYYY-MM-DDTHH:mm:ss");
          loanRecoverApi
            .delayPayoff(this.delayForm)
            .then((response) => {
              this.$message({
                message: response.message,
                type: "success",
              });
              //关闭对话框
              this.delayFormVisible = false;
              //刷新展示表格
              this.getLoanRecoverList();
            })
            .catch((error) => {
              // 错误处理逻辑
              this.delayForm.delayStartDate = moment(
                this.delayForm.delayStartDate
              ).format("YYYY-MM-DD HH:mm:ss");
              this.delayForm.delayEndDate = moment(
                this.delayForm.delayEndDate
              ).format("YYYY-MM-DD HH:mm:ss");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    earlyPayoff(row) {
      let earlyPayoffPrice;
      let message;
      if (row.termStatus == 2) {
        earlyPayoffPrice = row.balance - row.termRepayPrincipal;
        message = `当期贷款已结清，提前结清剩余贷款需要支付：\n${earlyPayoffPrice}元`;
      } else {
        // 注意：已结清和未结清状态下的balance不一样
        earlyPayoffPrice =
          row.balance + row.termRepayInterest - row.actualRepayPrice;
        message = `当期贷款尚未结清，提前结清剩余贷款需要支付：\n${earlyPayoffPrice}元`;
      }
      this.$confirm(message, "请确认是否结清剩余贷款？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          loanRecoverApi.earlyPayoff(row.id).then((response) => {
            this.$message({
              message: response.message,
              type: "success",
            });
            //刷新展示表格
            this.getLoanRecoverList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消提前结清贷款",
          });
        });
    },
    confirmRemind(id) {
      loanRecoverApi.confirmRemind({
        id: id
      }).then((response) => {
        this.$message({
          message: response.message,
          type: "success",
        });
        //刷新展示表格
        this.getLoanRecoverList();
      });
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
