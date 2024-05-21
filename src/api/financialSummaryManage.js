import request from "@/utils/request";

export default {
  getFinancialSummary() {
    return request({
      url: "/info/financialSummary/getFinancialSummary",
      method: "get",
    });
  },
};
