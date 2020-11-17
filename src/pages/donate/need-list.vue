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
             <el-table-column label="众筹截止日期" width="100" >
                 <template  slot-scope="scope" >
                    <i>{{dealMonth(scope.row.gmtCreate)}}</i>
                </template>
            </el-table-column>
            <el-table-column prop="statusDesc" label="状态" width="100" >
            </el-table-column>
            <el-table-column align="center" label="操作" width="240">
            <template slot-scope="scope" >
                <!-- <el-button size="mini" type="success" plain 
                @click="handleChapter(scope.row.id)">章节</el-button> -->
                <el-button size="mini" type="primary" plain 
                @click="handleDonate(scope.row)" :disabled="dealToday(dealMonth(scope.row.gmtCreate)) ? true : false">捐赠</el-button>
                 <el-button size="mini" type="warning" plain 
                @click="open(scope.row)">评论</el-button>
                 <el-button size="mini" type="success" plain 
                @click="watchComment(scope.row.id)">查看评论</el-button>
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
        <el-dialog
            title="评论"
            :visible.sync="commentVisible"
            width="30%"
            >
            <el-form :inline="true" :model="commentForm" :rules="commentRules" ref="commentForm">
            <el-form-item label="评论内容" prop="commentContent">
                <el-input v-model="commentForm.commentContent" type="textarea" placeholder="评论"></el-input>
            </el-form-item>
            <el-form-item label="活动区域" prop="commentType">
                <el-radio-group v-model="commentForm.commentType">
                    <el-radio :label="0">好评</el-radio>
                    <el-radio :label="2">中评</el-radio>
                    <el-radio :label="1">差评</el-radio>
                </el-radio-group>
            </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="commentVisible = false">取 消</el-button>
                <el-button type="primary" @click="comment('commentForm')">确 定</el-button>
            </span>
            </el-dialog>

           <el-dialog
            title="查看评论"
            :visible.sync="watchVisible"
            width="30%"
            >
                 <el-table :data="tableData1" border style="width: 100%;" size="small">
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
            <span slot="footer" class="dialog-footer">
                <el-button @click="watchVisible = false">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {addMonths, dateFormat, compareDate} from '../../utils/config'
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
            },
            commentVisible: false,
            commentForm: {
                commentContent: '',
                commentType: 0
            },
            needObject: {},
            commentRules: {
                commentContent: [
                    { required: true, message: '请输入评论', trigger: 'blur' }
                ],
                commentType: [
                    { required: true, message: '请输入评论', trigger: 'blur' }
                ],
            },
            watchVisible: false,
            tableData1: []
        }
    },
    created(){
        console.log(11)
        this.dealToday()
        this.getListData();
        this.getDictionaryOptions("category");
        // this.getDictionaryOptions("channel");
    },
    methods:{
        dealMonth(data) {
           return addMonths(data, 1)
        },
        handleChapter(id){
            this.$router.push('/book/chapter-list/'+id);
        },
        dealToday(create) {
            var date = new Date();
            console.log(dateFormat('YYYY-mm-dd', date))
            const result = compareDate(dateFormat('YYYY-mm-dd', date), create)
            return result
        },
        handleDonate(book) {
            //this.$router.push('/book/book-edit/'+id);
            this.$prompt('请输入捐入数量', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^[+]{0,1}(\d+)$/,
            inputErrorMessage: '数字格式不正确'
            }).then(({ value }) => {
                if(value < 1){
                    this.$message({
                        type: 'error',
                        message: '至少捐出1本书'
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
        },
        open(object) {
            this.commentVisible = true
            this.needObject = object
        },
        comment(dataForm){
              this.$refs[dataForm].validate((valid) => {
                let param = {
                    bookNeedId: this.needObject.id,
                    commentContent: this.commentForm.commentContent,
                    commentType: this.commentForm.commentType
                }
                if (valid) {
                    this.postRequest('/component/add', param).then(resp => {
                        if (resp.success) {
                            this.$message({
                                type: 'success',
                                message: '评论成功！！'
                            });
                        } else {
                            this.$message({
                                type: 'error',
                                message: '评论失败！！'
                            });
                        }
                        this.commentVisible = false
                    })
                }
              })
            // this.commentVisible = false
        },
        watchComment(id) {
            // let form = {

            //     pageNo:this.currentPage,
            //     pageSize:this.limit,
            //    // bookType:this.formInline.bookType,
            //     // dicChannel:this.formInline.dicChannel,
            //     //bookName:this.formInline.bookName
            // }
            this.getRequest('/component/query', {id}).then(resp => {
                if (resp.code == "200") {
                    this.tableData1 = resp.data
                    // this.tableData = resp.data.pageData;
                   // this.total = resp.data.length
                    this.watchVisible = true
                }
            })
        }
    }
}
</script>

<style scoped>
    .toolbar{
        height: 40px;
    }
</style>