import request from '@/utils/request'

export default{
  getLoanApplyList(searchModel){ //括号是接收前端的参数，params和data是传给后端的入参和Json参数
    return request({
      url: '/info/loan/list',
      method: 'get',
      params:{
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        account: searchModel.account,
        name: searchModel.name,
        phone: searchModel.phone
      }
    });
  },
  addLoanApply(loanApply){
    return request({
      url: '/info/loan',
      method: 'post',
      data: loanApply //参数
    });
  },
  getLoanApplyById(id){
    return request({
      url: `/info/loan/${id}`,
      method: 'get'
    });
  },
  updateLoanApply(loanApply){
    return request({
      url: '/info/loan',
      method: 'put',
      data: loanApply //参数
    });
  },
  saveLoanApply(loanApply){
    if(loanApply.id==null && loanApply.id == undefined){
      return this.addLoanApply(loanApply);
    }
    return this.updateLoanApply(loanApply);
  },
  deleteLoanApplyById(id){
    return request({
      url: `/info/loan/${id}`,
      method: 'delete'
    });
  },
}