import request from '@/utils/request'

export default{
  getLoanRecoverList(searchModel){ //括号是接收前端的参数，params和data是传给后端的入参和Json参数
    return request({
      url: '/info/loanRecover/list',
      method: 'post',
      data: searchModel
    });
  },
  repay(param){ //括号是接收前端的参数，params和data是传给后端的入参和Json参数
    return request({
      url: '/info/loanRecover/repay',
      method: 'post',
      data: param
    });
  }
}