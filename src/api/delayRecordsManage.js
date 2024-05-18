import request from "@/utils/request";

export default {
  getDelayRecordsList(searchModel) {
    //括号是接收前端的参数，params和data是传给后端的入参和Json参数
    return request({
      url: "/info/delayRecords/list",
      method: "post",
      data: searchModel,
    });
  },
};
