import request from '@/utils/request'

export default{
  getEmployeeList(searchModel){ //括号是接收前端的参数，params和data是传给后端的入参和Json参数
    return request({
      url: '/info/employee/list',
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
  addEmployee(employee){
    return request({
      url: '/info/employee',
      method: 'post',
      data: employee //参数
    });
  },
  getEmployeeById(id){
    return request({
      url: `/info/employee/${id}`,
      method: 'get'
    });
  },
  updateEmployee(employee){
    return request({
      url: '/info/employee',
      method: 'put',
      data: employee //参数
    });
  },
  saveEmployee(employee){
    if(employee.id==null && employee.id == undefined){
      return this.addEmployee(employee);
    }
    return this.updateEmployee(employee);
  },
  deleteEmployeeById(id){
    return request({
      url: `/info/employee/${id}`,
      method: 'delete'
    });
  },
}