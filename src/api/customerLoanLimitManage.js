import request from '@/utils/request'

export default{
  getCustomerLoanLimitList(param){
    return request({
      url: '/info/customerLoanLimit/list',
      method: 'post',
      data: param //参数
    });
  },
  addCustomerLoanLimit(param){
    return request({
      url: '/info/customerLoanLimit/add',
      method: 'post',
      data: param //参数
    });
  },
  getLoanLimitById(param){
    return request({
      url: '/info/customerLoanLimit/getLoanLimitById',
      method: 'post',
      data: param //参数
    });
  },
  getLoanLimitByCustomer(param){
    return request({
      url: '/info/customerLoanLimit/getLoanLimitByCustomer',
      method: 'post',
      data: param //参数
    });
  },
  updateCustomerLoanLimit(param){
    return request({
      url: '/info/customerLoanLimit/update',
      method: 'post',
      data: param //参数
    });
  },
  evaluateCustomerLoanLimit(param){
    return request({
      url: '/info/customerLoanLimit/evaluate',
      method: 'post',
      data: param //参数
    });
  },
  operateCustomerLoanLimit(evaluateForm){
    if(evaluateForm.id==null && evaluateForm.id == undefined){
      return this.addCustomerLoanLimit(evaluateForm);
    }
    else if(evaluateForm.loanLimitLevel==null && evaluateForm.loanLimitLevel == undefined){
      return this.updateCustomerLoanLimit(evaluateForm);
    }
    else{
      return this.evaluateCustomerLoanLimit(evaluateForm);
    }
  }
}