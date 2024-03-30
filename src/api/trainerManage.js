import request from '@/utils/request'

export default{
  getTrainerList(searchModel){
    return request({
      url: '/info/trainer/list',
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
  addTrainer(trainer){
    return request({
      url: '/info/trainer',
      method: 'post',
      data: trainer //参数
    });
  },
  getTrainerById(id){
    return request({
      url: `/info/trainer/${id}`,
      method: 'get'
    });
  },
  updateTrainer(trainer){
    return request({
      url: '/info/trainer',
      method: 'put',
      data: trainer //参数
    });
  },
  saveTrainer(trainer){
    if(trainer.id==null && trainer.id == undefined){
      return this.addTrainer(trainer);
    }
    return this.updateTrainer(trainer);
  },
  deleteTrainerById(id){
    return request({
      url: `/info/trainer/${id}`,
      method: 'delete'
    });
  },
}