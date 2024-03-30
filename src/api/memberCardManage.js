import request from '@/utils/request'

export default {
  getMemberCardList(searchModel) {
    return request({
      url: '/consumption/memberCard/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        memberId: searchModel.memberId,
        memberName: searchModel.memberName,
        cardType: searchModel.cardType
      }
    });
  },
  addMemberCard(memberCard) {
    return request({
      url: '/consumption/memberCard',
      method: 'post',
      data: memberCard //参数
    });
  },
  getMemberCardById(memberId) {
    return request({
      url: `/consumption/memberCard/${memberId}`,
      method: 'get'
    });
  },
  updateMemberCard(memberCard) {
    return request({
      url: '/consumption/memberCard',
      method: 'put',
      data: memberCard //参数
    });
  },
  saveMemberCard(memberCard, isAdd) {
    if (isAdd == 1) {
      return this.addMemberCard(memberCard);
    }else{
      return this.updateMemberCard(memberCard);
    }
  },
  deleteMemberCardById(memberId) {
    return request({
      url: `/consumption/memberCard/${memberId}`,
      method: 'delete'
    });
  },
  refund(memberCard) {
    return request({
      url: `/consumption/memberCard/refund`,
      method: 'put',
      data: memberCard //参数
    });
  },
  expiredOrNot() {
    return request({
      url: '/consumption/memberCard/expiredOrNot',
      method: 'put',
    });
  }
}
