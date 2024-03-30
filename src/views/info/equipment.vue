<template>
  <div>
    <!-- 搜索栏 -->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input v-model="searchModel.id" placeholder="设备号" clearable></el-input>
          <el-input v-model="searchModel.name" placeholder="设备名称" clearable></el-input>
          <el-input v-model="searchModel.purchaseDate" placeholder="购入日期(yyyy-mm-dd)" clearable></el-input>
          <el-button @click="getEquipmentList" type="primary" round icon="el-icon-search">查询</el-button>
        </el-col>
        <el-col :span="4" align="right">
          <el-button @click="openEditUI(null)" type="primary" round icon="el-icon-plus" circle></el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 结果列表 -->
    <el-card>
      <el-table :data="equipmentList" stripe style="width: 100%">
        <el-table-column label="#" width="100">
          <template slot-scope="scope">
            {{ (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="id" label="设备号" width="100">
        </el-table-column>
        <el-table-column prop="name" label="设备名称" width="120">
        </el-table-column>
        <el-table-column prop="fee" label="费用" width="100">
        </el-table-column>
        <el-table-column prop="purchaseDate" label="购入日期" width="180" :formatter="dateFormat">
        </el-table-column>
        <el-table-column prop="warranty" label="保修时间" width="100">
        </el-table-column>
        <el-table-column prop="description" label="描述">
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button @click="openEditUI(scope.row.id)" type="primary" icon="el-icon-edit" circle size="mini"></el-button>
            <el-button @click="deleteEquipment(scope.row)" type="danger" icon="el-icon-delete" circle size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分页组件 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="searchModel.pageNo" :page-sizes="[5, 10, 20, 50]" :page-size="searchModel.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!-- 用户信息编辑对话框 -->
    <el-dialog @close="clearForm" :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="equipmentForm" ref="equipmentFormRef" :rules="rules">
        <el-form-item label="设备名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="equipmentForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="费用"  prop="fee" :label-width="formLabelWidth">
          <el-input v-model="equipmentForm.fee" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="保修时间" :label-width="formLabelWidth">
          <el-input v-model="equipmentForm.warranty" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="equipmentForm.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEquipment">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import equipmentApi from '@/api/equipmentManage' //导入Api
import moment from 'moment' //导入日期处理包
export default {
  data() { //数据处理
    return { //简单变量
      formLabelWidth: '130px',
      equipmentForm: {

      },
      dialogFormVisible: false,
      title: "",
      total: 0,
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      equipmentList: [],
      rules: {
        name: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        fee: [
          { required: true, message: '请输入设备购买费用', trigger: 'blur' }
        ]
      }
    }
  },
  methods: { //定义方法
    deleteEquipment(equipment){
      this.$confirm(`您确认删除这条设备记录 ${equipment.name} ?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          equipmentApi.deleteEquipmentById(equipment.id).then(response=>{
            this.$message({
            type: 'success',
            message: response.message
          });
          this.getEquipmentList();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 编写日期格式化方法
    dateFormat: function (row, column) {
      console.log(row, column)
      const date = row[column.property]
      if (date === undefined) {
        return ''
      }
      // 这里的格式根据需求修改
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    saveEquipment() {
      //触发表单验证
      this.$refs.equipmentFormRef.validate((valid) => {//valid就是验证结果
        if (valid) {
          //提交请求给后台
          equipmentApi.saveEquipment(this.equipmentForm).then(response => {
            //已经提交成功，then里面是提交之后要做的处理,response是后端返回的内容
            //成功提示
            this.$message({
              message: response.message,
              type: 'success'
            });
            //关闭对话框
            this.dialogFormVisible = false;
            //刷新展示表格
            this.getEquipmentList();
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    clearForm() {
      this.equipmentForm = {};
      this.$refs.equipmentFormRef.clearValidate();
    },
    openEditUI(id) {
      if(id==null){
        this.title = '新增设备';
      }else{
        this.title = '修改设备信息';
        //根据id查询用户数据
        equipmentApi.getEquipmentById(id).then(response =>{
          this.equipmentForm=response.data;
        });
      }
      this.dialogFormVisible = true;
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize;
      this.getEquipmentList();
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo;
      this.getEquipmentList();
    },
    getEquipmentList() {
      equipmentApi.getEquipmentList(this.searchModel).then(response => {
        this.equipmentList = response.data.rows;
        this.total = response.data.total;
      });
    }
  },
  created() {
    this.getEquipmentList();
  }
}
</script>

<style>
#search .el-input {
  width: 250px;
  margin-right: 10px;
}

.el-dialog .el-input {
  width: 85%;
}
</style>