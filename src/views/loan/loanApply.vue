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
        <el-col :span="4" align="right">
          <el-button
            @click="openEditUI()"
            type="primary"
            round
            icon="el-icon-plus"
            circle
          ></el-button>
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
        <el-table-column prop="grantExecutor" label="贷款发放执行人" width="80">
        </el-table-column>
        <el-table-column
          prop="grantDate"
          label="贷款发放日期"
          :formatter="dateFormat"
          width="200"
        ></el-table-column>
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
        <el-table-column
          prop="repayDate"
          label="还款日期"
          :formatter="dateFormat"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="termRepayPrincipal"
          label="每期还款本金"
          width="110"
        >
        </el-table-column>
        <el-table-column
          prop="termRepayInterest"
          label="每期还款利息"
          width="110"
        >
        </el-table-column>
        <el-table-column prop="termRepayPrice" label="每期还款金额" width="110">
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
        <el-table-column
          prop="recoveredInterest"
          label="已收回利息"
          width="100"
        >
        </el-table-column>
        <el-table-column prop="balance" label="剩余本金" width="120">
        </el-table-column>
        <el-table-column prop="customerPhone" label="客户联系方式" width="120">
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
      <el-form :model="loanApplyForm" ref="loanApplyFormRef" :rules="rules">
        <el-form-item
          label="身份证号码"
          prop="idCard"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="loanApplyForm.idCard"
            autocomplete="off"
            @blur="handleBlur"
            @input="handleInput"
          ></el-input>
        </el-form-item>
        <!-- 查表 -->
        <el-form-item
          label="姓名"
          prop="customerName"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="loanApplyForm.customerName"
            autocomplete="off"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="银行预留手机号"
          prop="customerPhone"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="loanApplyForm.customerPhone"
            autocomplete="off"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="资产评估"
          prop="evaluateStatus"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="loanApplyForm.evaluateStatus"
            autocomplete="off"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="贷款额度等级"
          prop="loanLimitLevelName"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="loanApplyForm.loanLimitLevelName"
            autocomplete="off"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="贷款额度上限"
          prop="loanLimit"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="loanApplyForm.loanLimit"
            autocomplete="off"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="贷款类型"
          prop="loanType"
          :label-width="formLabelWidth"
        >
          <el-radio-group v-model="loanApplyForm.loanType">
            <el-radio :label="1">个人贷款</el-radio>
            <el-radio :label="2">商业贷款</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="贷款金额"
          prop="price"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="loanApplyForm.price"
            autocomplete="off"
            @blur="handleBlurCalculate"
            @input="handleInputCalculate"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="还款方式"
          prop="repayMethod"
          :label-width="formLabelWidth"
        >
          <el-select
            v-model="loanApplyForm.repayMethod"
            placeholder="请选择"
            @change="handleChangeCalculate"
          >
            <el-option
              v-for="item in repayMethodList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="还款期数(月)"
          prop="repayTerm"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="loanApplyForm.repayTerm"
            autocomplete="off"
            @blur="handleBlurCalculate"
            @input="handleInputCalculate"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="年利率"
          prop="interestRate"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="loanApplyForm.interestRate"
            autocomplete="off"
            @blur="handleBlurCalculate"
            @input="handleInputCalculate"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="还款日期"
          prop="repayDate"
          :label-width="formLabelWidth"
        >
          <el-date-picker
            v-model="loanApplyForm.repayDate"
            type="date"
            placeholder="选择日期"
            :formatter="dateFormat"
          >
          </el-date-picker>
        </el-form-item>
        <!-- 自动计算 -->
        <el-form-item label="每期还款本金" :label-width="formLabelWidth">
          <el-input
            v-model="loanApplyForm.termRepayPrincipal"
            autocomplete="off"
            :disabled="true"
            placeholder="按当期实际情况计算"
          ></el-input>
        </el-form-item>
        <el-form-item label="每期还款利息" :label-width="formLabelWidth">
          <el-input
            v-model="loanApplyForm.termRepayInterest"
            autocomplete="off"
            :disabled="true"
            placeholder="按当期实际情况计算"
          ></el-input>
        </el-form-item>
        <el-form-item label="每期还款金额" :label-width="formLabelWidth">
          <el-input
            v-model="loanApplyForm.termRepayPrice"
            autocomplete="off"
            :disabled="true"
            placeholder="按当期实际情况计算"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="逾期罚息基数"
          prop="lateChargeBase"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="loanApplyForm.lateChargeBase"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="贷款用途"
          prop="loanPurpose"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="loanApplyForm.loanPurpose"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addLoanApply">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import loanApplyApi from "@/api/loanApplyManage"; //导入Api
import customerApi from "@/api/customerManage"; //导入Api
import customerLoanLimitApi from "@/api/customerLoanLimitManage"; //导入Api
import moment from "moment"; //导入日期处理包
export default {
  data() {
    //数据处理
    var checkPhone = (rule, value, callback) => {
      var reg =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (!reg.test(value)) {
        return callback(new Error("请输入正确的电话号码"));
      }
      callback();
    };
    var checkAccount = (rule, value, callback) => {
      var reg = /^[a-zA-Z0-9_-]{4,16}$/;
      if (!reg.test(value)) {
        return callback(
          new Error(
            '请输入正确的账号，长度为4到16位，可以包含字母、数字、"_"和"-"'
          )
        );
      }
      callback();
    };
    var checkIdCard = (rule, value, callback) => {
      var reg =
        /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      if (!reg.test(value)) {
        return callback(new Error("请输入正确的身份证号码"));
      }
      callback();
    };
    var checkEmail = (rule, value, callback) => {
      var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (!reg.test(value)) {
        return callback(new Error("请输入正确的邮箱"));
      }
      callback();
    };
    var checkInterestRate = (rule, value, callback) => {
      var reg = /^\d+(\.\d+)?$/;
      if (!reg.test(value)) {
        return callback(new Error("请输入有效的贷款年利率"));
      }
      callback();
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.loanApplyForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var validatePositiveNumber = (rule, value, callback) => {
      var reg = /^\d+(\.\d+)?$/;
      if (!reg.test(value)) {
        return callback(new Error("请输入正确的格式"));
      }
      callback();
    };
    var checkPrice = (rule, value, callback) => {
      var reg = /^\d+(\.\d+)?$/;
      if (!reg.test(value)) {
        return callback(new Error("请输入正确的格式"));
      }
      if (
        this.loanApplyForm.loanLimit == null ||
        this.loanApplyForm.loanLimit == undefined
      ) {
        return callback(new Error("请先输入身份证号码查询贷款额度"));
      }
      if (value > this.loanApplyForm.loanLimit) {
        return callback(new Error("贷款金额不能大于贷款限额"));
      }
      callback();
    };
    return {
      //简单变量
      isCalculateChanged: false,
      isIdCardChanged: false,
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
      loanApplyForm: {
        lateChargeBase: 1.3,
      },
      dialogFormVisible: false,
      title: "",
      total: 0,
      searchModel: {
        pageNo: 1,
        pageSize: 10,
      },
      loanApplyList: [],
      rules: {
        customerName: [
          { required: true, message: "请输入姓名", trigger: "blur" },
        ],
        customerPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur",
          },
        ],
        passwordCheck: [{ validator: validatePass, trigger: "blur" }],
        customerPhone: [
          { required: true, message: "请输入银行预留手机号", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" },
        ],
        price: [
          { required: true, message: "请输入贷款金额", trigger: "blur" },
          { validator: checkPrice, trigger: "blur" },
        ],
        loanType: [
          { required: true, message: "请选择贷款类型", trigger: "blur" },
        ],
        idCard: [
          { required: true, message: "请输入身份证号码", trigger: "blur" },
          { validator: checkIdCard, trigger: "blur" },
        ],
        interestRate: [
          { required: true, message: "请输入贷款年利率", trigger: "blur" },
          { validator: checkInterestRate, trigger: "blur" },
        ],
        repayDate: [
          { required: true, message: "请选择还款日期", trigger: "blur" },
        ],
        repayMethod: [
          { required: true, message: "请选择还款方式", trigger: "blur" },
        ],
        repayTerm: [
          { required: true, message: "还款期数不能为空", trigger: "blur" },
          { validator: validatePositiveNumber, trigger: "blur" },
        ],
        lateChargeBase: [
          { required: true, message: "逾期罚息基数不能为空", trigger: "blur" },
          { validator: validatePositiveNumber, trigger: "blur" },
        ],
        loanPurpose: [
          { required: true, message: "请输入贷款用途", trigger: "blur" },
        ],
      },
    };
  },

  methods: {
    calculateRepayment() {
      const { price, repayMethod, repayTerm, interestRate } =
        this.loanApplyForm;

      if (!price || !repayMethod || !repayTerm || !interestRate) {
        this.loanApplyForm.termRepayPrincipal = null;
        this.loanApplyForm.termRepayInterest = null;
        this.loanApplyForm.termRepayPrice = null;
        return;
      }

      const monthlyInterestRate = interestRate / 12; // 月利率

      if (repayMethod === "1") {
        // 等额本息还款
        const termRepayPrice =
          (price *
            monthlyInterestRate *
            Math.pow(1 + monthlyInterestRate, repayTerm)) /
          (Math.pow(1 + monthlyInterestRate, repayTerm) - 1);

        this.loanApplyForm.termRepayPrincipal = null;
        this.loanApplyForm.termRepayInterest = null;
        this.loanApplyForm.termRepayPrice = termRepayPrice.toFixed(2);
      } else if (repayMethod === "2") {
        // 等额本金还款
        const termRepayPrincipal = price / repayTerm;

        this.loanApplyForm.termRepayPrincipal = termRepayPrincipal.toFixed(2);
        this.loanApplyForm.termRepayInterest = null;
        this.loanApplyForm.termRepayPrice = null;
      } else if (repayMethod === "3") {
        // 按期付息还款
        const termRepayInterest = price * monthlyInterestRate;

        this.loanApplyForm.termRepayPrincipal = null;
        this.loanApplyForm.termRepayInterest = termRepayInterest.toFixed(2);
        this.loanApplyForm.termRepayPrice = null;
      }
      this.$forceUpdate();
    },
    // 编写日期格式化方法
    dateFormat: function (row, column) {
      const date = row[column.property];
      if (date === undefined || date === null) {
        return "";
      }
      // 这里的格式根据需求修改
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    addLoanApply() {
      //触发表单验证
      this.$refs.loanApplyFormRef.validate((valid) => {
        //valid就是验证结果
        if (valid) {
          //提交请求给后台
          loanApplyApi.addLoanApply(this.loanApplyForm).then((response) => {
            //已经提交成功，then里面是提交之后要做的处理,response是后端返回的内容
            //成功提示
            this.$message({
              message: response.message,
              type: "success",
            });
            //关闭对话框
            this.dialogFormVisible = false;
            //刷新展示表格
            this.getLoanApplyList();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    clearForm() {
      this.loanApplyForm = {
        lateChargeBase: 1.3,
      };
      this.$refs.loanApplyFormRef.clearValidate();
    },
    openEditUI() {
      this.title = "贷款申请";
      this.dialogFormVisible = true;
    },
    getCustomerByIdCard() {
      if (
        this.loanApplyForm.idCard == null ||
        this.loanApplyForm.idCard == undefined ||
        this.loanApplyForm.idCard == ""
      ) {
        this.loanApplyForm = {
          lateChargeBase: 1.3,
        };
        loanApplyForm: this.$message({
          message: "请输入身份证号码",
          type: "warning",
        });
        return;
      }
      customerApi
        .getCustomerByIdCard(this.loanApplyForm.idCard)
        .then((response) => {
          this.loanApplyForm.customerName = response.data.name;
          this.loanApplyForm.customerPhone = response.data.phone;
          this.getLoanLimitByCustomer({
            customerId: response.data.id,
          });
          this.$forceUpdate();
        })
        .catch((error) => {
          // 请求失败，处理错误情况
          this.loanApplyForm.customerName = "";
          this.loanApplyForm.customerPhone = "";
          this.$forceUpdate();
        });
    },
    getLoanLimitByCustomer(param) {
      customerLoanLimitApi
        .getLoanLimitByCustomer(param)
        .then((response) => {
          switch (response.data.evaluatorId) {
            case 0: {
              this.loanApplyForm.evaluateStatus = "系统自动评估";
              break;
            }
            default: {
              this.loanApplyForm.evaluateStatus = "客户已提交资产评估";
            }
          }
          this.loanApplyForm.loanLimitLevelName =
            response.data.loanLimitLevelName;
          this.loanApplyForm.loanLimit = response.data.loanLimit;
          this.$forceUpdate();
        })
        .catch((error) => {
          // 请求失败，处理错误情况
          this.loanApplyForm.evaluateStatus = "";
          this.loanApplyForm.loanLimitLevelName = "";
          this.loanApplyForm.loanLimit = "";
          this.$forceUpdate();
        });
    },
    handleBlur() {
      if (this.isIdCardChanged) {
        // 调用后端接口查询用户信息
        this.getCustomerByIdCard();
        this.isIdCardChanged = false;
      }
    },
    handleInput() {
      this.isIdCardChanged = true;
    },
    handleBlurCalculate() {
      if (this.isCalculateChanged) {
        this.calculateRepayment();
        this.isCalculateChanged = false;
      }
    },
    handleInputCalculate() {
      this.isCalculateChanged = true;
    },
    handleChangeCalculate() {
      this.calculateRepayment();
      this.isCalculateChanged = false;
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
        this.loanApplyList.forEach((row) => {
          switch (row.repayMethod) {
            case 1: {
              row.termRepayInterest = "按期计算";
              row.termRepayPrincipal = "按期计算";
              break;
            }
            case 2: {
              row.termRepayInterest = "按期计算";
              row.termRepayPrice = "按期计算";
              break;
            }
            case 3: {
              row.termRepayPrincipal = "按期计算";
              row.termRepayPrice = "按期计算";
              break;
            }
          }
        });
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
  margin-bottom: 10px;
  /* 调整搜索栏之间的下方间距 */
  margin-left: 10px;
}
</style>
