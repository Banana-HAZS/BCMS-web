import request from '@/utils/request'

export default{
  getMemberCourseList(searchModel){
    return request({
      url: '/consumption/memberCourse/list',
      method: 'get',
      params:{
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        memberId: searchModel.memberId,
        memberName: searchModel.memberName,
        courseName: searchModel.courseName
      }
    });
  },
  addMemberCourse(memberCourse){
    return request({
      url: '/consumption/memberCourse',
      method: 'post',
      data: memberCourse //参数
    });
  },
  getMemberCourseById(memberId){
    return request({
      url: `/consumption/memberCourse/${memberId}`,
      method: 'get'
    });
  },
  updateMemberCourse(memberCourse){
    return request({
      url: '/consumption/memberCourse',
      method: 'put',
      data: memberCourse //参数
    });
  },
  saveMemberCourse(memberCourse, isAdd){
    if(isAdd == 1){
      return this.addMemberCourse(memberCourse);
    }else{
      return this.updateMemberCourse(memberCourse);
    }
  },
  deleteMemberCourseById(memberId){
    return request({
      url: `/consumption/memberCourse/${memberId}`,
      method: 'delete'
    });
  },
  refund(memberCourse){
    return request({
      url: `/consumption/memberCourse/refund`,
      method: 'put',
      data: memberCourse //参数
    });
  },
}