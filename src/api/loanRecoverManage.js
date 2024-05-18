import request from '@/utils/request'

export default{
  getLoanRecoverList(searchModel){ //括号是接收前端的参数，params和data是传给后端的入参和Json参数
    return request({
      url: '/info/loanRecover/list',
      method: 'post',
      data: searchModel
    });
  },
  repay(param){ 
    return request({
      url: '/info/loanRecover/repay',
      method: 'post',
      data: param
    });
  },
  earlyPayoff(id){ 
    return request({
      url: '/info/loanRecover/earlyPayoff',
      method: 'post',
      data: {
        id: id
      }
    });
  },
  initDelayForm(){ 
    return request({
      url: '/info/loanRecover/initDelayForm',
      method: 'get'
    });
  },
  delayPayoff(param){ 
    return request({
      url: '/info/loanRecover/delayPayoff',
      method: 'post',
      data: param
    });
  },
}