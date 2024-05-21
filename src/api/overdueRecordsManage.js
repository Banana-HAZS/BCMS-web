import request from "@/utils/request";

export default {
  getOverdueRecordsList(searchModel) {
    //括号是接收前端的参数，params和data是传给后端的入参和Json参数
    return request({
      url: "/info/overdueRecords/list",
      method: "post",
      data: searchModel,
    });
  },
  confirmRemind(param){ 
    return request({
      url: '/info/overdueRecords/confirmRemind',
      method: 'post',
      data: param
    });
  },
};
