import request from '@/utils/request'

export default{
  getCustomerCreditList(searchModel){ //括号是接收前端的参数，params和data是传给后端的入参和Json参数
    return request({
      url: '/info/customerCredit/list',
      method: 'post',
      data: searchModel //参数
    });
  },
  getCreditLevel(param){
    return request({
      url: '/info/customerCredit/getCreditLevel',
      method: 'post',
      data: param
    });
  }
}