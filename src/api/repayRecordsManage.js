import request from '@/utils/request'

export default{
  repay(param){ //括号是接收前端的参数，params和data是传给后端的入参和Json参数
    return request({
      url: '/info/loanRecover/repay',
      method: 'post',
      data: param
    });
  }
}