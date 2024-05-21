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
          <el-button
            @click="getDelayRecordsList"
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
      <el-table :data="delayRecordsList" stripe style="width: 100%">
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
        <el-table-column prop="delayPrice" label="展期金额" width="110">
        </el-table-column>
        <el-table-column prop="delayTerms" label="展期期数" width="110">
        </el-table-column>
        <el-table-column
          prop="delayStartDate"
          label="展期开始日期"
          :formatter="dateFormat"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="delayEndDate"
          label="展期结束日期"
          :formatter="dateFormat"
          width="200"
        ></el-table-column>
        <el-table-column prop="delayCharge" label="展期手续费" width="110">
        </el-table-column>
        <el-table-column prop="delayChargeBase" label="展期手续费占比" width="120">
        </el-table-column>
        <el-table-column prop="delayInterestAdjust" label="展期利率调整" width="110">
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
import delayRecordsApi from "@/api/delayRecordsManage"; //导入Api
import moment from "moment"; //导入日期处理包
export default {
  data() {
    return {
      //简单变量
      value: "",
      formLabelWidth: "130px",
      total: 0,
      searchModel: {
        pageNo: 1,
        pageSize: 10,
      },
      delayRecordsList: [],
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
      this.getDelayRecordsList();
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo;
      this.getDelayRecordsList();
    },
    getDelayRecordsList() {
      delayRecordsApi.getDelayRecordsList(this.searchModel).then((response) => {
        this.delayRecordsList = response.data.rows;
        this.total = response.data.total;
      });
    },
  },
  created() {
    this.getDelayRecordsList();
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
