import request from '@/utils/request'

export default{
  getMemberList(searchModel){
    return request({
      url: '/info/member/list',
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
  addMember(member){
    return request({
      url: '/info/member',
      method: 'post',
      data: member //参数
    });
  },
  getMemberById(id){
    return request({
      url: `/info/member/${id}`,
      method: 'get'
    });
  },
  updateMember(member){
    return request({
      url: '/info/member',
      method: 'put',
      data: member //参数
    });
  },
  saveMember(member){
    if(member.id==null && member.id == undefined){
      return this.addMember(member);
    }
    return this.updateMember(member);
  },
  deleteMemberById(id){
    return request({
      url: `/info/member/${id}`,
      method: 'delete'
    });
  },
}