import request from '@/utils/request'

export default{
  getCardList(searchModel){
    return request({
      url: '/info/card/list',
      method: 'get',
      params:{
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        id: searchModel.id,
        type: searchModel.type
      }
    });
  },
  addCard(card){
    return request({
      url: '/info/card',
      method: 'post',
      data: card //参数
    });
  },
  getCardById(id){
    return request({
      url: `/info/card/${id}`,
      method: 'get'
    });
  },
  updateCard(card){
    return request({
      url: '/info/card',
      method: 'put',
      data: card //参数
    });
  },
  saveCard(card){
    if(card.id==null && card.id == undefined){
      return this.addCard(card);
    }
    return this.updateCard(card);
  },
  deleteCardById(id){
    return request({
      url: `/info/card/${id}`,
      method: 'delete'
    });
  },
}