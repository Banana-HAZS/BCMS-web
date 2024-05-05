import request from '@/utils/request'

export default{
  getCustomerList(searchModel){ //括号是接收前端的参数，params和data是传给后端的入参和Json参数
    return request({
      url: '/info/customer/list',
      method: 'get',
      params:{
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        idCard: searchModel.idCard,
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
  getCustomerByIdCard(idCard){
    return request({
      url: `/info/customer/idCard/${idCard}`,
      method: 'get'
    });
  },
}