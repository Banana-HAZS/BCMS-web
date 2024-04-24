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
            @click="getRepayRecordsList"
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
      <el-table :data="repayRecordsList" stripe style="width: 100%">
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
        <el-table-column prop="repayPrice" label="还款金额" width="110">
        </el-table-column>
        <el-table-column
          prop="repayDate"
          label="还款日期"
          :formatter="dateFormat"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="actualRepayPrice"
          label="累计还款金额"
          width="110"
        ></el-table-column>
        <el-table-column prop="remainRepayPrice" label="剩余待还金额" width="110">
        </el-table-column>
        <el-table-column prop="currentTerm" label="当前期数" width="110">
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
  </div>
</template>

<script>
import repayRecordsApi from "@/api/repayRecordsManage"; //导入Api
import moment from "moment"; //导入日期处理包
export default {
  data() {
    return {
      //简单变量
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
      value: "",
      formLabelWidth: "130px",
      auditLoanForm: {
        id: 0,
      },
      total: 0,
      searchModel: {
        pageNo: 1,
        pageSize: 10,
      },
      repayRecordsList: [],
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
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize;
      this.getRepayRecordsList();
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo;
      this.getRepayRecordsList();
    },
    getRepayRecordsList() {
      const nowTime = new Date();
      console.log(nowTime,'nowTime');
      repayRecordsApi.getRepayRecordsList(this.searchModel).then((response) => {
        this.repayRecordsList = response.data.rows;
        this.total = response.data.total;
      });
    },
  },
  created() {
    this.getRepayRecordsList();
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
