import request from '@/utils/request'

export default{
    getRepayRecordsList(searchModel){ //括号是接收前端的参数，params和data是传给后端的入参和Json参数
        return request({
          url: '/info/repayRecords/list',
          method: 'post',
          data: searchModel
        });
      },
}