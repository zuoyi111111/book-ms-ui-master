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
            <el-table-column prop="needBookName" label="众筹图书名称" width="100">
            </el-table-column>
            <el-table-column prop="haveNum" label="拥有数量" width="100">
            </el-table-column>
            <el-table-column label="捐赠类型" width="100" >
                 <template  slot-scope="scope" >
                    <i>{{scope.row.donationType==1?"个人捐赠":"众筹捐赠"}}</i>
                </template>
            </el-table-column>
             <el-table-column prop="needArea" label="需要地区" width="100" >
            </el-table-column>
             <el-table-column prop="needBookNum" label="需要数量" width="100" >
            </el-table-column>
              <el-table-column prop="needUserName" label="需要人姓名" width="100" >
            </el-table-column>
              <el-table-column prop="needDesc" label="描述" >
            </el-table-column>
            <el-table-column prop="statusDesc" label="状态" width="100" >
            </el-table-column>
            <el-table-column align="center" label="操作" width="240">
            <template slot-scope="scope" >
                <!-- <el-button size="mini" type="success" plain 
                @click="handleChapter(scope.row.id)">章节</el-button> -->
                <el-button size="mini" type="primary" plain 
                @click="handleDonate(scope.row)">捐赠</el-button>
            </template>
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
        handleDonate(book) {
            //this.$router.push('/book/book-edit/'+id);
            this.$prompt('请输入捐入数量', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^[+]{0,1}(\d+)$/,
            inputErrorMessage: '数字格式不正确'
            }).then(({ value }) => {
                if(value > book.haveNum){
                    this.$message({
                        type: 'error',
                        message: '最多捐出'+book.haveNum+'本书'
                    });
                } else {
                     this.postRequest('/bookDonate/crowdFundingDonate', {crowdFundingId:book.id, donationBookNum:Number(value)}).then(resp => {
                        if (resp.code == 200) {
                            this.$message({
                                type: 'success',
                                message: value+'本书捐赠成功！'
                            });
                        } else {
                            this.$message({
                                type: 'error',
                                message: value+'本书捐赠失败！'
                            });
                        }
                    })
                }
       
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '取消输入'
            });       
            });
        },
        handleType(type) {
            let status = ""
            switch(type) {
                case 0: status = "待审批"; break;
                case 1: status =  "通过" ; break;
                case 2: status =  "拒绝" ; break;
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
            this.postRequest('/bookDonate/crowdFundingDonateList', form).then(resp => {
                if (resp.code == "200") {
                    this.tableData = resp.data.pageData
                    // this.tableData = resp.data.pageData;
                    this.total = resp.data.totalCount
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