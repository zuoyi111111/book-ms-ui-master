<template>
    <div>
        <!--工具栏-->
        <el-form :inline="true" :model="formInline" size="mini" class="toolbar">
            <el-form-item label="关键字" >
                <el-input v-model="formInline.bookName" placeholder="书籍名称"></el-input>
            </el-form-item>
           <el-form-item label="分类" prop="bookType">
                <el-select v-model="formInline.bookType" clearable placeholder="请选择" style="width:120px">
                    <el-option v-for="item in categoryOptions" :key="item.typeId" :label="item.typeName" :value="item.typeId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="频道" prop="dicChannel">
                <el-select v-model="formInline.dicChannel" clearable placeholder="请选择" style="width:120px">
                    <el-option v-for="item in channelOptions" :key="item.id" :label="item.typeName" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSearch">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="gotoAdd" >新增</el-button>
            </el-form-item>
        </el-form>
        <!--表格区-->
        <el-table :data="tableData" border style="width: 100%;" size="small">
            <template slot="empty">
                还没有数据呢~ (⊙︿⊙)
            </template>
            <el-table-column label="封面" width="74" align="center">
                <template slot-scope="scope" >
                    <el-image style="height: 66px" :src="scope.row.bookPic" fit="fill"></el-image>
                </template>
            </el-table-column>
            <el-table-column prop="bookId" label="图书ID" width="100">
            </el-table-column>
            <el-table-column prop="bookName" label="图书名称" >
            </el-table-column>
            <el-table-column prop="bookAuthor" label="作者" width="100" >
            </el-table-column>
            <el-table-column label="简介" >
                <template slot-scope="scope" >
                   <p>{{scope.row.bookIntroduction?scope.row.bookIntroduction.substring(0,50)+"...":''}}</p>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="240">
            <template slot-scope="scope" >
                <!-- <el-button size="mini" type="success" plain 
                @click="handleChapter(scope.row.id)">章节</el-button> -->
                <el-button size="mini" type="primary" plain 
                @click="handleEdit(scope.row.id)">编辑</el-button>
                <el-button size="mini" type="danger"  plain 
                @click="handleDelete(scope.row.bookId)">删除</el-button>
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
        handleEdit(id) {
            this.$router.push('/book/book-edit/'+id);
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
                bookType:this.formInline.bookType,
                // dicChannel:this.formInline.dicChannel,
                bookName:this.formInline.bookName
            }
            this.postRequest('/bookInfo/getBookInfo.json', form).then(resp => {
                if (resp.code == "200") {
                    this.tableData = []
                    this.tableData = resp.data.pageData;
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