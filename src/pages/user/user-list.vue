<template>
    <div>
        <!--工具栏-->
        <el-form :inline="true" :model="formInline" size="mini" class="toolbar">
            <el-form-item label="关键字" >
                <el-input v-model="formInline.bookName" placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSearch">查询</el-button>
            </el-form-item>
        </el-form>
        <!--表格区-->
         <el-table :data="tableData" border style="width: 100%;" size="small">
            <template slot="empty">
                还没有数据呢~ (⊙︿⊙)
            </template>
            <el-table-column prop="userName" label="用户名" >
            </el-table-column>
            <el-table-column prop="roleName" label="角色名称" >
            </el-table-column>
            <el-table-column prop="phone" label="电话号码" >
            </el-table-column>
             <el-table-column prop="email" label="电子邮件" width="200" >
             </el-table-column>
             <el-table-column align="center" label="操作" width="180">
                <template slot-scope="scope" >
                    <el-button size="mini" type="primary" plain 
                    @click="open(scope.row.id)">分配角色</el-button>
                </template>
             </el-table-column>
        </el-table>
           <el-dialog
            title="分配角色"
            :visible.sync="roleVisible"
            width="30%"
            >
            <el-form  :model="roleForm" :rules="roleRules" ref="roleForm">
            <el-form-item label="角色名称" prop="roleId">
                 <el-select v-model="roleForm.roleId" placeholder="请选择角色">
                    <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.roleName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="roleVisible = false">取 消</el-button>
                <el-button type="primary" @click="role('roleForm')">确 定</el-button>
            </span>
        </el-dialog>

        <!--分页区-->
        <div class="Pagination" style="text-align: left; margin-top: 10px;">
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="limit"
                layout="total, prev, pager, next"
                :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
  export default {
    data() {
        return {
            categoryOptions:[],
            channelOptions:[],
            tableData: [],
            limit: 10,
            total: 0,
            currentPage: 1,
            roleForm: {},
            roleRules: {
                roleId: [
                    { required: true, message: '请输入选择角色', trigger: 'blur' }
                ],
            },
            roleVisible: false,
            formInline:{},
            options: [],
            adminId: 0
        }
    },
    created(){
        this.getListData();
        this.getSelect();
    },
    methods:{
        open(id){
           this.roleVisible = true
           this.adminId = id
        },
        getSelect() {
              let form = {
                pageNo:this.currentPage,
                pageSize:this.limit,
               // bookType:this.formInline.bookType,
                // dicChannel:this.formInline.dicChannel,
                //bookName:this.formInline.bookName
            }
            this.getRequest('/queryRoleList', form).then(resp => {
                if (resp.code == "200") {
                    this.options = resp.data
                }
            })
        },
        handleRole(id) {     
            this.postRequest('/bookDonate/donationBookCheck',{id:id, approveStatus: 0}).then(resp => {
                if (resp.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '审核成功'
                    });
                    this.getListData();
                } else {
                    this.$message({
                        type: 'error',
                        message: '审核失败'
                    });
                }
            }) 
           // this.$router.push('/book/book-edit/'+id);
        },
        handleType(type) {
            let status = ""
            switch(type) {
                case 0: status = "好评"; break;
                case 1: status =  "差评" ; break;
                case 2: status =  "中评" ; break;
            }
            return status;
        },
        getListData(){
            let form = {
                pageNo:this.currentPage,
                pageSize:this.limit,
               // bookType:this.formInline.bookType,
                // dicChannel:this.formInline.dicChannel,
                //bookName:this.formInline.bookName
            }
            this.getRequest('/queryUserList', form).then(resp => {
                if (resp.code == "200") {
                    this.tableData = resp.data
                    // this.tableData = resp.data.pageData;
                    this.total = resp.data.length
                }
            })
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getListData();
        },
        onSearch(){
            this.getListData();
        },
        gotoAdd(){
            this.$router.push("/book-add");
        },
        role(dataForm) {
            this.$refs[dataForm].validate((valid) => {
            let param = {
                id: this.adminId,
                roleId: this.roleForm.roleId,
            }
            if (valid) {
                this.getRequest('/assigningRoles', param).then(resp => {
                    if (resp.success) {
                        this.$message({
                            type: 'success',
                            message: '分配成功！！'
                        });
                    } else {
                        this.$message({
                            type: 'error',
                            message: '分配失败！！'
                        });
                    }
                    this.roleVisible = false
                })
            }
            })
        }
    }
  };
</script>

<style scoped>
    .toolbar{
        height: 40px;
    }
</style>