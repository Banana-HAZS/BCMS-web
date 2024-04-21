import request from '@/utils/request'

export default{
  grantLoan(param){
    return request({
      url: '/info/loan/grant',
      method: 'post',
      data: param //参数
    });
  },
  rejectLoan(param){
    return request({
      url: '/info/loan/reject',
      method: 'post',
      data: param //参数
    });
  },
}