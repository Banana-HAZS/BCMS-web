import request from '@/utils/request'

export default{
  auditLoan(param){
    return request({
      url: '/info/loan/audit',
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