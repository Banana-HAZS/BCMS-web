import request from '@/utils/request'

export default{
  getCourseList(searchModel){
    return request({
      url: '/info/course/list',
      method: 'get',
      params:{
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        id: searchModel.id,
        name: searchModel.name,
        trainers: searchModel.trainers
      }
    });
  },
  addCourse(course){
    return request({
      url: '/info/course',
      method: 'post',
      data: course //参数
    });
  },
  getCourseById(id){
    return request({
      url: `/info/course/${id}`,
      method: 'get'
    });
  },
  updateCourse(course){
    return request({
      url: '/info/course',
      method: 'put',
      data: course //参数
    });
  },
  saveCourse(course){
    if(course.id==null && course.id == undefined){
      return this.addCourse(course);
    }
    return this.updateCourse(course);
  },
  deleteCourseById(id){
    return request({
      url: `/info/course/${id}`,
      method: 'delete'
    });
  },
}