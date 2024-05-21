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
            v-model="searchModel.overdueDurationType"
            clearable
            placeholder="逾期时长类型"
          >
            <el-option
              v-for="item in overdueDurationTypeList"
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
          <el-button
            @click="getOverdueRecordsList"
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
      <el-table :data="overdueRecordsList" stripe style="width: 100%">
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
        <el-table-column prop="overduePrice" label="逾期金额" width="110">
        </el-table-column>
        <el-table-column prop="overdueDurationType" label="逾期时长类型" width="110">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.overdueDurationType == '1'" type="info"
              >普通逾期</el-tag
            >
            <el-tag v-if="scope.row.overdueDurationType == '2'" type="warning"
              >较长逾期</el-tag
            >
            <el-tag v-if="scope.row.overdueDurationType == '3'" type="danger"
              >严重逾期</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="overdueStartDate"
          label="逾期开始日期"
          :formatter="dateFormat"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="overdueEndDate"
          label="逾期结束日期"
          :formatter="dateFormat"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="overdueDays"
          label="逾期天数"
          width="110"
        ></el-table-column>
        <el-table-column
          prop="lateCharge"
          label="逾期罚息"
          width="110"
        >
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
        <el-table-column prop="currentTerm" label="当前期数" width="110">
        </el-table-column>
        <el-table-column prop="customerPhone" label="客户联系方式" width="120">
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
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
  </div>
</template>

<script>
import overdueRecordsApi from "@/api/overdueRecordsManage"; //导入Api
import moment from "moment"; //导入日期处理包
export default {
  data() {
    return {
      //简单变量
      overdueDurationTypeList: [
        {
          value: "1",
          label: "普通逾期",
        },
        {
          value: "2",
          label: "较长逾期",
        },
        {
          value: "3",
          label: "严重逾期",
        }
      ],
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
      value: "",
      formLabelWidth: "130px",
      total: 0,
      searchModel: {
        pageNo: 1,
        pageSize: 10,
      },
      overdueRecordsList: [],
    };
  },

  methods: {
    // 编写日期格式化方法
    confirmRemind(id) {
      overdueRecordsApi.confirmRemind({
        id: id
      }).then((response) => {
        this.$message({
          message: response.message,
          type: "success",
        });
        //刷新展示表格
        this.getOverdueRecordsList();
      });
    },
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
      this.getOverdueRecordsList();
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo;
      this.getOverdueRecordsList();
    },
    getOverdueRecordsList() {
      overdueRecordsApi.getOverdueRecordsList(this.searchModel).then((response) => {
        this.overdueRecordsList = response.data.rows;
        this.total = response.data.total;
      });
    },
  },
  created() {
    this.getOverdueRecordsList();
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
