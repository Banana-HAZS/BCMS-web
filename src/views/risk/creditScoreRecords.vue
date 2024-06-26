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
            v-model="searchModel.changeType"
            clearable
            placeholder="变动类型"
          >
            <el-option
              v-for="item in changeTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-date-picker
            v-model="searchModel.changeDate"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="变动开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
          <el-button
            @click="getCreditScoreRecordsList"
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
      <el-table :data="creditScoreRecordsList" stripe style="width: 100%">
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
        <el-table-column prop="loanNo" label="贷款流水号" width="150">
        </el-table-column>
        <el-table-column
          prop="loanRecoverNo"
          label="贷款收回流水号"
          width="150"
        >
        </el-table-column>
        <el-table-column prop="changeDescription" label="变动原因" width="200">
        </el-table-column>
        <el-table-column
          prop="changeValue"
          label="变动值"
          width="110"
        ></el-table-column>
        <el-table-column
          prop="changeDate"
          label="变动日期"
          :formatter="dateFormat"
          width="200"
        ></el-table-column>
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
import creditScoreRecordsApi from "@/api/creditScoreRecordsManage"; //导入Api
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
      changeTypeList: [
        {
          value: "1",
          label: "一次完整的贷款结清",
        },
        {
          value: "2",
          label: "一期贷款收回结清",
        },
        {
          value: "3",
          label: "一次延期还款",
        },
        {
          value: "4",
          label: "一次普通逾期还款",
        },
        {
          value: "5",
          label: "一次较长逾期还款",
        },
        {
          value: "6",
          label: "一次严重逾期还款",
        },
      ],
      value: "",
      formLabelWidth: "130px",
      total: 0,
      searchModel: {
        pageNo: 1,
        pageSize: 10,
      },
      creditScoreRecordsList: [],
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
      this.getCreditScoreRecordsList();
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo;
      this.getCreditScoreRecordsList();
    },
    getCreditScoreRecordsList() {
        creditScoreRecordsApi.getCreditScoreRecordsList(this.searchModel).then((response) => {
        this.creditScoreRecordsList = response.data.rows;
        this.total = response.data.total;
      });
    },
  },
  created() {
    this.getCreditScoreRecordsList();
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
