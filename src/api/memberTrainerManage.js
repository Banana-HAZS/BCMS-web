import request from '@/utils/request'

export default{
  getMemberTrainerList(searchModel){ //括号是接收前端的参数，params和data是传给后端的入参和Json参数
    return request({
      url: '/consumption/memberTrainer/list',
      method: 'get',
      params:{
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        memberId: searchModel.memberId,
        memberName: searchModel.memberName,
        trainerName: searchModel.trainerName
      }
    });
  },
  addMemberTrainer(memberTrainer){
    return request({
      url: '/consumption/memberTrainer',
      method: 'post',
      data: memberTrainer //参数
    });
  },
  getMemberTrainerById(memberId){
    return request({
      url: `/consumption/memberTrainer/${memberId}`,
      method: 'get'
    });
  },
  updateMemberTrainer(memberTrainer){
    return request({
      url: '/consumption/memberTrainer',
      method: 'put',
      data: memberTrainer //参数
    });
  },
  saveMemberTrainer(memberTrainer, isAdd){
    if(isAdd == 1){
      return this.addMemberTrainer(memberTrainer);
    }else{
      return this.updateMemberTrainer(memberTrainer);
    }
  },
  deleteMemberTrainerById(memberId){
    return request({
      url: `/consumption/memberTrainer/${memberId}`,
      method: 'delete'
    });
  },
  refund(memberTrainer){
    return request({
      url: `/consumption/memberTrainer/refund`,
      method: 'put',
      data: memberTrainer //参数
    });
  },
  expiredOrNot(){
    return request({
      url: '/consumption/memberTrainer/expiredOrNot',
      method: 'put',
    });
  }
}