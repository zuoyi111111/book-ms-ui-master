<template>
    <div>
        <!--工具栏-->
        <el-form :inline="true" :model="formInline" size="mini" class="toolbar">
            <el-form-item label="关键字" >
                <el-input v-model="formInline.bookName" placeholder="书籍名称"></el-input>
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
            <el-table-column prop="commentType" label="用户名" width="100">
                   <template  slot-scope="scope" >
                    <i>{{scope.row.comment?"":"匿名用户"}}</i>
                </template>
            </el-table-column>
            <el-table-column prop="commentContent" label="评价内容" >
            </el-table-column>
            <el-table-column label="评价" width="100" >
                 <template  slot-scope="scope" >
                    <i>{{handleType(scope.row.commentType)}}</i>
                </template>
            </el-table-column>
             <el-table-column prop="gmtCreate" label="评价时间" width="200" >
            </el-table-column>
        </el-table>
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
            formInline:{
                bookName:'',
                bookType:''
            }
        }
    },
    created(){
        console.log(11)
        this.getListData();
        this.getDictionaryOptions("category");
        // this.getDictionaryOptions("channel");
    },
    methods:{
        handleChapter(id){
            this.$router.push('/book/chapter-list/'+id);
        },
        handleCheck(id) {     
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
        handleDelete(id) {
            this.$confirm('确定要删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.getRequest('/bookInfo/deleteBook.json',{id:id}).then(resp => {
                    if (resp.code == 200) {
                        this.getListData();
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });
            });
            
        },
        getDictionaryOptions(type){
            // 字典数据源
            this.postRequest('/bookType/getBookTypeInfo.json', {pageNo:1, pageSize:100}).then(resp => {
                if (resp.code == 200) {
                    this.categoryOptions = resp.data.pageData;
                }
            })
        },
        getListData(){
            let form = {
                pageNo:this.currentPage,
                pageSize:this.limit,
               // bookType:this.formInline.bookType,
                // dicChannel:this.formInline.dicChannel,
                //bookName:this.formInline.bookName
            }
            this.getRequest('/component/list', form).then(resp => {
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
        }
    }
  };
</script>

<style scoped>
    .toolbar{
        height: 40px;
    }
</style>