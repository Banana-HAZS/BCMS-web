<template>
  <div>
    <!-- 搜索栏 -->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <el-input v-model="searchModel.id" placeholder="id" clearable></el-input>
          <el-input v-model="searchModel.type" placeholder="类型" clearable></el-input>
          <el-button @click="getCardList" type="primary" round icon="el-icon-search">查询</el-button>
        </el-col>
        <el-col :span="4" align="right">
          <el-button @click="openEditUI(null)" type="primary" round icon="el-icon-plus" circle></el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 结果列表 -->
    <el-card>
      <el-table :data="cardList" stripe style="width: 100%">
        <el-table-column label="#" width="100">
          <template slot-scope="scope">
            {{ (searchModel.pageNo - 1) * searchModel.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID" width="180">
        </el-table-column>
        <el-table-column prop="type" label="类型" width="120">
        </el-table-column>
        <el-table-column prop="fee" label="费用" width="100">
        </el-table-column>
        <el-table-column prop="description" label="描述">
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button @click="openEditUI(scope.row.id)" type="primary" icon="el-icon-edit" circle size="mini"></el-button>
            <el-button @click="deleteCard(scope.row)" type="danger" icon="el-icon-delete" circle size="mini"></el-button>
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
      <el-form :model="cardForm" ref="cardFormRef" :rules="rules">
        <el-form-item label="类型" prop="type" :label-width="formLabelWidth">
          <el-input v-model="cardForm.type" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="费用" prop="fee" :label-width="formLabelWidth">
          <el-input v-model="cardForm.fee" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input v-model="cardForm.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveCard">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import cardApi from '@/api/cardManage' //导入Api
import moment from 'moment' //导入日期处理包
export default {
  data() { //数据处理
    return { //简单变量
      formLabelWidth: '130px',
      cardForm: {

      },
      dialogFormVisible: false,
      title: "",
      total: 0,
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      cardList: [],
      rules: {
        type: [
          { required: true, message: '请输入会员卡类型', trigger: 'blur' }
        ],
        fee: [
          { required: true, message: '请输入会员卡定价', trigger: 'blur' }
        ]
      }
    }
  },
  methods: { //定义方法
    deleteCard(card){
      this.$confirm(`您确认删除会员卡 ${card.type} ?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          cardApi.deleteCardById(card.id).then(response=>{
            this.$message({
            type: 'success',
            message: response.message
          });
          this.getCardList();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    saveCard() {
      //触发表单验证
      this.$refs.cardFormRef.validate((valid) => {//valid就是验证结果
        if (valid) {
          //提交请求给后台
          cardApi.saveCard(this.cardForm).then(response => {
            //已经提交成功，then里面是提交之后要做的处理,response是后端返回的内容
            //成功提示
            this.$message({
              message: response.message,
              type: 'success'
            });
            //关闭对话框
            this.dialogFormVisible = false;
            //刷新展示表格
            this.getCardList();
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    clearForm() {
      this.cardForm = {};
      this.$refs.cardFormRef.clearValidate();
    },
    openEditUI(id) {
      if(id==null){
        this.title = '新增会员卡';
      }else{
        this.title = '修会员卡信息';
        //根据id查询会员卡数据
        cardApi.getCardById(id).then(response =>{
          this.cardForm=response.data;
        });
      }
      this.dialogFormVisible = true;
    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize;
      this.getCardList();
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo;
      this.getCardList();
    },
    getCardList() {
      cardApi.getCardList(this.searchModel).then(response => {
        this.cardList = response.data.rows;
        this.total = response.data.total;
      });
    }
  },
  created() {
    this.getCardList();
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