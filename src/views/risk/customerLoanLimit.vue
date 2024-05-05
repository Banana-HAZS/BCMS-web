<template>
    <div>
        <!-- 搜索栏 -->
        <el-card id="search">
            <el-row>
                <el-col :span="20" class="search-bar custom-search-bar">
                    <el-input v-model="searchModel.customerAccount" placeholder="客户账号" clearable></el-input>
                    <el-input v-model="searchModel.customerName" placeholder="客户姓名" clearable></el-input>
                    <el-input v-model="searchModel.customerPhone" placeholder="预留手机号码" clearable></el-input>
                    <el-select v-model="searchModel.loanLimitLevel" clearable placeholder="贷款额度等级">
                        <el-option v-for="item in loanLimitLevelList" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="searchModel.evaluateStatus" clearable placeholder="评估状态">
                        <el-option v-for="item in evaluateStatusList" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-date-picker v-model="searchModel.evaluateDate" type="daterange" align="right" unlink-panels
                        range-separator="至" start-placeholder="还款开始日期" end-placeholder="结束日期"
                        :picker-options="pickerOptions">
                    </el-date-picker>
                    <el-button @click="getCustomerLoanLimitList" type="primary" round
                        icon="el-icon-search">查询</el-button>
                </el-col>
                <el-col :span="4" align="right">
                    <el-button @click="openEditUI(null, 0)" type="primary" round icon="el-icon-plus" circle></el-button>
                </el-col>
            </el-row>
        </el-card>

        <!-- 结果列表 -->
        <el-card>
            <el-table :data="customerLoanLimitList" stripe style="width: 100%">
                <el-table-column label="#" width="80">
                    <template slot-scope="scope">
                        {{
                            (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1
                        }}
                    </template>
                </el-table-column>
                <el-table-column prop="customerAccount" label="客户账号" width="120">
                </el-table-column>
                <el-table-column prop="customerName" label="姓名" width="100">
                </el-table-column>
                <el-table-column prop="customerPhone" label="客户联系方式" width="120">
                </el-table-column>
                <el-table-column prop="occupation" label="职业" width="80">
                </el-table-column>
                <el-table-column prop="workUnit" label="工作单位" width="200">
                </el-table-column>
                <el-table-column prop="annualIncome" label="年收入(元)" width="120">
                </el-table-column>
                <el-table-column prop="careerYears" label="从事行业年限" width="80">
                </el-table-column>
                <el-table-column prop="debtAmount" label="负债金额(元)" width="120">
                </el-table-column>
                <el-table-column prop="houseProperty" label="房产估值" width="120">
                </el-table-column>
                <el-table-column prop="carProperty" label="车产估值" width="120">
                </el-table-column>
                <el-table-column prop="monthDebtRepay" label="每月用于还债金额(元)" width="120">
                </el-table-column>
                <el-table-column prop="dti" label="债务收入比" width="120">
                </el-table-column>
                <el-table-column prop="deposit" label="储蓄(元)" width="120">
                </el-table-column>
                <el-table-column prop="invest" label="投资金额(元)" width="120">
                </el-table-column>
                <el-table-column prop="assetValuation" label="资产估值(元)" width="120">
                </el-table-column>
                <el-table-column prop="netAssetValue" label="资产净值(元)" width="120">
                </el-table-column>
                <el-table-column prop="loanLimitLevel" label="贷款额度等级" width="80">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.loanLimitLevel == 'S'" type="success">S类客户</el-tag>
                        <el-tag v-if="scope.row.loanLimitLevel == 'A+'" type="success">A+类客户</el-tag>
                        <el-tag v-if="scope.row.loanLimitLevel == 'A'" type="success">A类客户</el-tag>
                        <el-tag v-if="scope.row.loanLimitLevel == 'A-'" type="success">A-类客户</el-tag>
                        <el-tag v-if="scope.row.loanLimitLevel == 'B'" type="success">B类客户</el-tag>
                        <el-tag v-if="scope.row.loanLimitLevel == 'C+'" type="success">C+类客户</el-tag>
                        <el-tag v-if="scope.row.loanLimitLevel == 'C'" type="success">C类客户</el-tag>
                        <el-tag v-if="scope.row.loanLimitLevel == 'D'" type="success">D类客户</el-tag>
                        <el-tag v-if="scope.row.loanLimitLevel == 'E'" type="success">E类客户</el-tag>
                        <el-tag v-if="scope.row.loanLimitLevel == 'F'" type="success">F类客户</el-tag>
                        <el-tag v-if="scope.row.loanLimitLevel == 'G'" type="danger">G类客户</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="evaluateStatus" label="评估状态" width="80">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.loanLimitLevel == '1'" type="warning">待评估</el-tag>
                        <el-tag v-if="scope.row.loanLimitLevel == '2'" type="success">已评估</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="evaluateDate" label="评估日期" :formatter="dateFormat" width="200"></el-table-column>
                <el-table-column prop="evaluatorName" label="评估人" width="80">
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button @click="openEditUI(scope.row.id, 0)" type="primary" icon="el-icon-edit" circle
                            size="mini" v-if="scope.row.evaluateStatus == 1"></el-button>
                        <el-button @click="openEditUI(scope.row.id, 1)" type="primary" size="mini"
                            v-if="scope.row.evaluateStatus == 1">评估</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 分页组件 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="searchModel.pageNo" :page-sizes="[5, 10, 20, 50]" :page-size="searchModel.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

        <!-- 贷款额度评估对话框 -->
        <el-dialog @close="clearEvaluateForm" :title="evaluateTitle" :visible.sync="evaluateFormVisible">
            <el-form :model="evaluateForm" ref="evaluateFormRef" :rules="evaluateRules">
                <el-form-item v-if="evaluateForm.id == null || evaluateForm.id == undefined" label="身份证号码" prop="idCard"
                    :label-width="formLabelWidth">
                    <el-input v-model="evaluateForm.idCard" autocomplete="off" @blur="handleBlur"
                        @input="handleInput"></el-input>
                </el-form-item>
                <!-- 查表 -->
                <el-form-item v-if="evaluateForm.id == null || evaluateForm.id == undefined" label="姓名"
                    prop="customerName" :label-width="formLabelWidth">
                    <el-input v-model="evaluateForm.customerName" autocomplete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item v-if="evaluateForm.id == null || evaluateForm.id == undefined" label="银行预留手机号"
                    prop="customerPhone" :label-width="formLabelWidth">
                    <el-input v-model="evaluateForm.customerPhone" autocomplete="off" :disabled="true"></el-input>
                </el-form-item>

                <el-form-item label="职业" prop="occupation" :label-width="formLabelWidth">
                    <el-input v-model="evaluateForm.occupation" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="工作单位" prop="workUnit" :label-width="formLabelWidth">
                    <el-input v-model="evaluateForm.workUnit" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="年收入(元)" prop="annualIncome" :label-width="formLabelWidth">
                    <el-input v-model="evaluateForm.annualIncome" autocomplete="off" @blur="handleBlurCalculate"
                        @input="handleInputCalculate"></el-input>
                </el-form-item>
                <el-form-item label="从事行业年限" prop="careerYears" :label-width="formLabelWidth">
                    <el-input v-model="evaluateForm.careerYears" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="负债金额(元)" prop="debtAmount" :label-width="formLabelWidth">
                    <el-input v-model="evaluateForm.debtAmount" autocomplete="off" @blur="handleBlurAssetCalculate"
                        @input="handleInputAssetCalculate"></el-input>
                </el-form-item>
                <el-form-item label="房产估值" prop="houseProperty" :label-width="formLabelWidth">
                    <el-input v-model="evaluateForm.houseProperty" autocomplete="off" @blur="handleBlurAssetCalculate"
                        @input="handleInputAssetCalculate"></el-input>
                </el-form-item>
                <el-form-item label="车产估值" prop="carProperty" :label-width="formLabelWidth">
                    <el-input v-model="evaluateForm.carProperty" autocomplete="off" @blur="handleBlurAssetCalculate"
                        @input="handleInputAssetCalculate"></el-input>
                </el-form-item>
                <el-form-item label="每月用于还债金额(元)" prop="monthDebtRepay" :label-width="formLabelWidth">
                    <el-input v-model="evaluateForm.monthDebtRepay" autocomplete="off" @blur="handleBlurCalculate"
                        @input="handleInputCalculate"></el-input>
                </el-form-item>
                <el-form-item label="债务收入比" prop="dti" :label-width="formLabelWidth">
                    <el-input v-model="evaluateForm.dti" autocomplete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="储蓄(元)" prop="deposit" :label-width="formLabelWidth">
                    <el-input v-model="evaluateForm.deposit" autocomplete="off" @blur="handleBlurAssetCalculate"
                        @input="handleInputAssetCalculate"></el-input>
                </el-form-item>
                <el-form-item label="投资金额(元)" prop="invest" :label-width="formLabelWidth">
                    <el-input v-model="evaluateForm.invest" autocomplete="off" @blur="handleBlurAssetCalculate"
                        @input="handleInputAssetCalculate"></el-input>
                </el-form-item>
                <el-form-item label="资产估值(元)" prop="assetValuation" :label-width="formLabelWidth">
                    <el-input v-model="evaluateForm.assetValuation" autocomplete="off"
                        :disabled="isEvaluate"></el-input>
                </el-form-item>
                <el-form-item label="资产净值(元)" prop="netAssetValue" :label-width="formLabelWidth">
                    <el-input v-model="evaluateForm.netAssetValue" autocomplete="off" :disabled="isEvaluate"></el-input>
                </el-form-item>
                <el-form-item v-if="op == 1" label="贷款额度等级" prop="loanLimitLevel" :label-width="formLabelWidth">
                    <el-select v-model="evaluateForm.loanLimitLevel" placeholder="请选择">
                        <el-option v-for="item in loanLimitLevelList" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="evaluateFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="operateCustomerLoanLimit()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import customerLoanLimitApi from "@/api/customerLoanLimitManage"; //导入Api
import customerApi from "@/api/customerManage";
import moment from "moment"; //导入日期处理包
export default {
    data() {
        var checkIdCard = (rule, value, callback) => {
            var reg =
                /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
            if (!reg.test(value)) {
                return callback(new Error("请输入正确的身份证号码"));
            }
            callback();
        };
        var validatePositiveNumber = (rule, value, callback) => {
            var reg = /^\d+(\.\d+)?$/;
            if (!reg.test(value)) {
                return callback(new Error("请输入正确的格式"));
            }
            callback();
        };
        return {
            //简单变量
            isEvaluate: true,
            isAssetChanged: false,
            isCalculateChanged: false,
            op: 0,
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
            //贷款额度等级(S(100亿元)、A+(10亿元)、A(1亿元)、A-(1千万元)、B(1百万元)、C+(50万元)、C(10万元)、D(1万元)、E(5千元)、F(2千元)、G(0元))
            loanLimitLevelList: [
                {
                    value: "S",
                    label: "S类客户(100亿元)",
                },
                {
                    value: "A+",
                    label: "A+类客户(10亿元)",
                },
                {
                    value: "A",
                    label: "A类客户(1亿元)",
                },
                {
                    value: "A-",
                    label: "A-类客户(1千万元)",
                },
                {
                    value: "B",
                    label: "B类客户(1百万元)",
                },
                {
                    value: "C+",
                    label: "C+类客户(50万元)",
                },
                {
                    value: "C",
                    label: "C类客户(10万元)",
                },
                {
                    value: "D",
                    label: "D类客户(1万元)",
                },
                {
                    value: "E",
                    label: "E类客户(5千元)",
                },
                {
                    value: "F",
                    label: "F类客户(2千元)",
                },
                {
                    value: "G",
                    label: "G类客户(0元)",
                },
            ],
            // 评估状态(1待评估 2已评估)
            evaluateStatusList: [
                {
                    value: "1",
                    label: "待评估",
                },
                {
                    value: "2",
                    label: "已评估",
                }
            ],
            value: "",
            formLabelWidth: "130px",
            evaluateForm: {
            },
            total: 0,
            searchModel: {
                pageNo: 1,
                pageSize: 10,
            },
            customerLoanLimitList: [],
            evaluateFormVisible: false,
            evaluateTitle: '',
            evaluateRules: {
                idCard: [
                    { required: true, message: "请输入你的身份证号码", trigger: "blur" },
                    { validator: checkIdCard, trigger: "blur" },
                ],
                occupation: [
                    { required: true, message: "请输入你的职业", trigger: "blur" }
                ],
                annualIncome: [
                    { required: true, message: "年收入不能为空", trigger: "blur" },
                    { validator: validatePositiveNumber, trigger: 'blur' }
                ],
                careerYears: [
                    { required: true, message: "请输入从事行业年限", trigger: "blur" },
                    { validator: validatePositiveNumber, trigger: 'blur' }
                ],
                debtAmount: [
                    { required: true, message: "负债金额不能为空", trigger: "blur" },
                    { validator: validatePositiveNumber, trigger: 'blur' }
                ],
                houseProperty: [
                    { required: true, message: "请输入房产估值", trigger: "blur" },
                    { validator: validatePositiveNumber, trigger: 'blur' }
                ],
                carProperty: [
                    { required: true, message: "请输入车产估值", trigger: "blur" },
                    { validator: validatePositiveNumber, trigger: 'blur' }
                ],
                monthDebtRepay: [
                    { required: true, message: "请输入每月用于还债金额(元)", trigger: "blur" },
                    { validator: validatePositiveNumber, trigger: 'blur' }
                ],
                deposit: [
                    { required: true, message: "储蓄金额不能为空", trigger: "blur" },
                    { validator: validatePositiveNumber, trigger: 'blur' }
                ],
                invest: [
                    { required: true, message: "投资金额不能为空", trigger: "blur" },
                    { validator: validatePositiveNumber, trigger: 'blur' }
                ],
            },
        };
    },

    methods: {
        calculateDTI() {
            const { monthDebtRepay, annualIncome } =
                this.evaluateForm;

            if (!monthDebtRepay || !annualIncome) {
                this.evaluateForm.dti = null;
                return;
            }

            const monthlyIncome = annualIncome / 12; // 月收入
            this.evaluateForm.dti = (monthDebtRepay / monthlyIncome).toFixed(2);
            this.$forceUpdate();
        },
        handleBlurCalculate() {
            if (this.isCalculateChanged) {
                this.calculateDTI();
                this.isCalculateChanged = false;
            }
        },
        handleInputCalculate() {
            this.isCalculateChanged = true;
        },
        calculateAsset() {
            const { debtAmount, houseProperty, carProperty, deposit, invest } =
                this.evaluateForm;

            if (!debtAmount || !houseProperty || !carProperty || !deposit || !invest) {
                this.evaluateForm.dti = null;
                return;
            }

            this.evaluateForm.assetValuation = Number(houseProperty) + Number(carProperty) + Number(deposit) + Number(invest);
            this.evaluateForm.netAssetValue = this.evaluateForm.assetValuation - debtAmount;
            this.$forceUpdate();
        },
        handleBlurAssetCalculate() {
            if (this.isAssetChanged) {
                this.calculateAsset();
                this.isAssetChanged = false;
            }
        },
        handleInputAssetCalculate() {
            this.isAssetChanged = true;
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
        operateCustomerLoanLimit() {
            console.log(this.evaluateForm, 'evaluateForm');
            //触发表单验证
            this.$refs.evaluateFormRef.validate((valid) => {
                //valid就是验证结果
                if (valid) {
                    //提交请求给后台
                    customerLoanLimitApi.operateCustomerLoanLimit(this.evaluateForm).then((response) => {
                        //已经提交成功，then里面是提交之后要做的处理,response是后端返回的内容
                        //成功提示
                        this.$message({
                            message: response.message,
                            type: "success",
                        });
                        //关闭对话框
                        this.evaluateFormVisible = false;
                        //刷新展示表格
                        this.getCustomerLoanLimitList();
                    });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        openEditUI(id, op) {
            this.op = op;
            this.isEvaluate = op ? false : true;
            console.log(this.isEvaluate, 'isEvaluate');
            if (id == null) {
                this.evaluateTitle = "新增客户资产评估";
            } else {
                this.evaluateTitle = op ? "贷款额度评估" : "修改资产评估信息";
                //根据id查询用户数据
                customerLoanLimitApi.getLoanLimitById({
                    id: id
                }).then((response) => {
                    this.evaluateForm = response.data;
                });
            }
            this.evaluateFormVisible = true;
        },
        handleSizeChange(pageSize) {
            this.searchModel.pageSize = pageSize;
            this.getCustomerLoanLimitList();
        },
        handleCurrentChange(pageNo) {
            this.searchModel.pageNo = pageNo;
            this.getCustomerLoanLimitList();
        },
        getCustomerLoanLimitList() {
            customerLoanLimitApi.getCustomerLoanLimitList(this.searchModel).then((response) => {
                this.customerLoanLimitList = response.data.rows;
                this.total = response.data.total;
            });
        },
        getCustomerByIdCard() {
            customerApi.getCustomerByIdCard(this.evaluateForm.idCard)
                .then((response) => {
                    this.evaluateForm.customerId = response.data.id;
                    this.evaluateForm.customerName = response.data.name;
                    this.evaluateForm.customerPhone = response.data.phone;
                    this.$forceUpdate();
                })
                .catch((error) => {
                    // 请求失败，处理错误情况
                    this.evaluateForm.customerId = "";
                    this.evaluateForm.customerName = "";
                    this.evaluateForm.customerPhone = "";
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
        clearEvaluateForm() {
            this.evaluateForm = {};
            this.auditId = 0;
            this.op = 0;
            this.$refs.evaluateFormRef.clearValidate();
        },
    },
    created() {
        this.getCustomerLoanLimitList();
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
