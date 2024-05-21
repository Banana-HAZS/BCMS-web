<template>
  <div class="finance-report">
    <h1>财务汇总报表</h1>

    <!-- 总览部分 -->
    <div class="section">
      <h2>总览部分</h2>
      <p>报告日期范围：{{ overview.reportDateRange }}</p>
      <p>货币单位：{{ overview.currency }}</p>
    </div>

    <!-- 利润表 -->
    <div class="section">
      <h2>利润表</h2>
      <table>
        <thead>
          <tr>
            <th>项目</th>
            <th>金额 (CNY)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>利息收入</td>
            <td>{{ income.interest }}</td>
          </tr>
          <tr>
            <td>手续费及佣金收入</td>
            <td>{{ income.fee }}</td>
          </tr>
          <tr>
            <td>其他收入</td>
            <td>{{ income.other }}</td>
          </tr>
          <tr>
            <td>总收入</td>
            <td>{{ totalIncome }}</td>
          </tr>
          <tr>
            <td>利息费用</td>
            <td>{{ expenses.interest }}</td>
          </tr>
          <tr>
            <td>手续费及佣金支出</td>
            <td>{{ expenses.fee }}</td>
          </tr>
          <tr>
            <td>运营费用</td>
            <td>{{ expenses.operating }}</td>
          </tr>
          <tr>
            <td>总费用</td>
            <td>{{ totalExpenses }}</td>
          </tr>
          <tr>
            <td>净利润</td>
            <td>{{ netProfit }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 关键财务比率 -->
    <div class="section">
      <h2>关键财务比率</h2>
      <table>
        <thead>
          <tr>
            <th>比率</th>
            <th>比率值</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>流动比率</td>
            <td>{{ ratios.current }}</td>
          </tr>
          <tr>
            <td>速动比率</td>
            <td>{{ ratios.quick }}</td>
          </tr>
          <tr>
            <td>资产收益率（ROA）</td>
            <td>{{ ratios.roa }}</td>
          </tr>
          <tr>
            <td>股东权益回报率（ROE）</td>
            <td>{{ ratios.roe }}</td>
          </tr>
          <tr>
            <td>净利率</td>
            <td>{{ this.netProfitMargin }}</td>
          </tr>
          <tr>
            <td>不良贷款率</td>
            <td>{{ ratios.badLoanRatio }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 图表和可视化 -->
    <div class="section">
      <h2>图表和可视化</h2>
      <div ref="incomeChart" class="chart"></div>
      <div ref="profitChart" class="chart"></div>
      <div ref="ratiosChart" class="chart"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import financialSummaryApi from "@/api/financialSummaryManage";

export default {
  name: "FinanceReport",
  data() {
    return {
      overview: {
        reportDateRange: "2024年1月1日-至今",
        currency: "人民币（CNY）",
      },
      income: {
        interest: 5000000,
        fee: 1200000,
        other: 300000,
      },
      expenses: {
        interest: 6025.1561,
        fee: 3984.2415,
        operating: 59888.6997,
      },
      ratios: {
        current: 1.5,
        quick: 1.2,
        roa: "2.4%",
        roe: "8.0%",
        badLoanRatio: "1.8%",
      },
    };
  },
  computed: {
    totalIncome() {
      return (
        this.income.interest +
        this.income.fee +
        this.income.other
      ).toFixed(4);
    },
    totalExpenses() {
      return (
        this.expenses.interest +
        this.expenses.fee +
        this.expenses.operating
      ).toFixed(4);
    },
    netProfit() {
      return (this.totalIncome - this.totalExpenses).toFixed(4);
    },
    netProfitMargin() {
      return ((this.netProfit / this.totalIncome) * 100).toFixed(2) + "%";
    },
  },
  mounted() {
    this.getFinancialSummary();
  },
  methods: {
    getFinancialSummary() {
      financialSummaryApi.getFinancialSummary().then((response) => {
        this.income.interest = response.data.interest;
        this.income.fee = response.data.fee;
        this.income.other = response.data.other;
        this.ratios.badLoanRatio =
          (response.data.badLoanRatio * 100).toFixed(2) + "%";

        // 在数据更新后重新初始化图表
        this.initCharts();
      });
    },
    initCharts() {
      this.initIncomeChart();
      this.initProfitChart();
      this.initRatiosChart();
    },
    initIncomeChart() {
      if (this.$refs.incomeChart) {
        const incomeChart = echarts.init(this.$refs.incomeChart);
        const option = {
          title: {
            text: "收入构成",
            left: "center",
          },
          tooltip: {
            trigger: "item",
          },
          series: [
            {
              name: "收入",
              type: "pie",
              radius: "50%",
              data: [
                { value: this.income.interest, name: "利息收入" },
                { value: this.income.fee, name: "手续费及佣金收入" },
                { value: this.income.other, name: "其他收入" },
              ],
            },
          ],
        };
        incomeChart.setOption(option);
      }
    },
    initProfitChart() {
      if (this.$refs.profitChart) {
        const profitChart = echarts.init(this.$refs.profitChart);
        const option = {
          title: {
            text: "利润情况",
            left: "center",
          },
          tooltip: {
            trigger: "item",
          },
          series: [
            {
              name: "利润",
              type: "pie",
              radius: "50%",
              data: [
                { value: this.totalIncome, name: "总收入" },
                { value: this.totalExpenses, name: "总费用" },
                { value: this.netProfit, name: "净利润" },
              ],
            },
          ],
        };
        profitChart.setOption(option);
      }
    },
    initRatiosChart() {
      if (this.$refs.ratiosChart) {
        const ratiosChart = echarts.init(this.$refs.ratiosChart);
        const option = {
          title: {
            text: "关键财务比率",
            left: "center",
          },
          tooltip: {
            trigger: "axis",
          },
          xAxis: {
            type: "category",
            data: [
              "流动比率",
              "速动比率",
              "ROA",
              "ROE",
              "净利率",
              "不良贷款率",
            ],
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              name: "比率",
              type: "bar",
              data: [
                this.ratios.current,
                this.ratios.quick,
                parseFloat(this.ratios.roa),
                parseFloat(this.ratios.roe),
                parseFloat(this.netProfitMargin),
                parseFloat(this.ratios.badLoanRatio),
              ],
            },
          ],
        };
        ratiosChart.setOption(option);
      }
    },
  },
};
</script>

<style scoped>
.finance-report {
  width: 80%;
  margin: 0 auto;
}

.section {
  margin-bottom: 40px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

.chart {
  width: 100%;
  height: 400px;
  margin-top: 20px;
}
</style>
