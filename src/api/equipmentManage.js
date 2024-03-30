import request from '@/utils/request'

export default{
  getEquipmentList(searchModel){
    return request({
      url: '/info/equipment/list',
      method: 'get',
      params:{
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        id: searchModel.id,
        name: searchModel.name,
        purchaseDate: searchModel.purchaseDate
      }
    });
  },
  addEquipment(equipment){
    return request({
      url: '/info/equipment',
      method: 'post',
      data: equipment //参数
    });
  },
  getEquipmentById(id){
    return request({
      url: `/info/equipment/${id}`,
      method: 'get'
    });
  },
  updateEquipment(equipment){
    return request({
      url: '/info/equipment',
      method: 'put',
      data: equipment //参数
    });
  },
  saveEquipment(equipment){
    if(equipment.id==null && equipment.id == undefined){
      return this.addEquipment(equipment);
    }
    return this.updateEquipment(equipment);
  },
  deleteEquipmentById(id){
    return request({
      url: `/info/equipment/${id}`,
      method: 'delete'
    });
  },
}