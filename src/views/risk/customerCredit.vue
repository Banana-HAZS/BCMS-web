<template>
  <div>
    <!-- 搜索栏 -->
    <el-card id="search">
      <el-row>
        <el-col :span="20" class="search-bar custom-search-bar">
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
            v-model="searchModel.creditLevel"
            clearable
            placeholder="信用评估等级"
          >
            <el-option
              v-for="item in creditLevelList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-button
            @click="getCustomerCreditList"
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
      <el-table :data="customerCreditList" stripe style="width: 100%">
        <el-table-column label="#" width="80">
          <template slot-scope="scope">
            {{
              (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1
            }}
          </template>
        </el-table-column>
        <el-table-column prop="customerAccount" label="客户账号" width="200">
        </el-table-column>
        <el-table-column prop="customerName" label="姓名" width="150">
        </el-table-column>
        <el-table-column prop="creditScore" label="信用分" width="200">
        </el-table-column>
        <el-table-column prop="creditLevel" label="信用评估等级" width="200">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.creditLevel == 'A'" type="success"
              >信用极好</el-tag
            >
            <el-tag v-if="scope.row.creditLevel == 'B'" type="success"
              >信用优秀</el-tag
            >
            <el-tag v-if="scope.row.creditLevel == 'C'" type="success"
              >信用良好</el-tag
            >
            <el-tag v-if="scope.row.creditLevel == 'D'" type="warning"
              >信用中等</el-tag
            >
            <el-tag v-if="scope.row.creditLevel == 'E'" type="danger"
              >信用较差</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="customerPhone" label="客户联系方式">
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
import customerCreditApi from "@/api/customerCreditManage"; //导入Api
import moment from "moment"; //导入日期处理包
export default {
  data() {
    return {
      //简单变量
      // 信用评估等级A(700-950：信用极好)、B(650-700：信用优秀)、C(600-650：信用良好)、D(550-600：信用中等)、E(350-550：信用较差)
      creditLevelList: [
        {
          value: "A",
          label: "信用极好",
        },
        {
          value: "B",
          label: "信用优秀",
        },
        {
          value: "C",
          label: "信用良好",
        },
        {
          value: "D",
          label: "信用中等",
        },
        {
          value: "E",
          label: "信用较差",
        },
      ],
      value: "",
      formLabelWidth: "130px",
      total: 0,
      searchModel: {
        pageNo: 1,
        pageSize: 10,
      },
      customerCreditList: [],
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
      this.getCustomerCreditList();
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo;
      this.getCustomerCreditList();
    },
    getCustomerCreditList() {
      customerCreditApi
        .getCustomerCreditList(this.searchModel)
        .then((response) => {
          this.customerCreditList = response.data.rows;
          this.total = response.data.total;
        });
    },
  },
  created() {
    this.getCustomerCreditList();
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
