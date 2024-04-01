import request from '@/utils/request'

export default{
  getCustomerList(searchModel){
    return request({
      url: '/info/customer/list',
      method: 'get',
      params:{
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        id: searchModel.id,
        name: searchModel.name,
        phone: searchModel.phone
      }
    });
  },
  addCustomer(customer){
    return request({
      url: '/info/customer',
      method: 'post',
      data: customer //参数
    });
  },
  getCustomerById(id){
    return request({
      url: `/info/customer/${id}`,
      method: 'get'
    });
  },
  updateCustomer(customer){
    return request({
      url: '/info/customer',
      method: 'put',
      data: customer //参数
    });
  },
  saveCustomer(customer){
    if(customer.id==null && customer.id == undefined){
      return this.addCustomer(customer);
    }
    return this.updateCustomer(customer);
  },
  deleteCustomerById(id){
    return request({
      url: `/info/customer/${id}`,
      method: 'delete'
    });
  },
}