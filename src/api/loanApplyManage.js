import request from '@/utils/request'

export default{
  getLoanApplyList(searchModel){ //括号是接收前端的参数，params和data是传给后端的入参和Json参数
    return request({
      url: '/info/loan/list',
      method: 'post',
      data: searchModel
    });
  },
  addLoanApply(loanApply){
    return request({
      url: '/info/loan/add',
      method: 'post',
      data: loanApply //参数
    });
  },
  fetchUserInfo(idCard){
    return request({
      url: `/info/loan/idCard/${idCard}`,
      method: 'get'
    });
  },
}