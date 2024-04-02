import request from '@/utils/request'

export default{
  getRoleList(param){ //括号是接收前端的参数，params和data是传给后端的入参和Json参数
    return request({
      url: '/info/role/list',
      method: 'post',
      data: param
    });
  },
  getRoleById(id){
    return request({
      url: `/info/role/${id}`,
      method: 'get'
    });
  },
  updateRole(role){
    return request({
      url: '/info/role',
      method: 'put',
      data: role //参数
    });
  }
}