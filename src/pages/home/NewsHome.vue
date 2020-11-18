<!--  -->
<template>
    <div class="swipe">
      <swiper :options="swiperOption">
        <swiper-slide class="swiper-slide" v-for="(item,index) in slide" :key="index">
          <img :src="item" />
        </swiper-slide>
        <div class="swiper-pagination"  slot="pagination"></div>   <!-- 分页 -->
        <div class="swiper-button-prev" slot="button-prev"></div>  <!-- 箭头左 --> 
        <div class="swiper-button-next" slot="button-next"></div>  <!-- 箭头右 -->
      </swiper>
      <div style="margin-top: 20px; display: flex;">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>近期公益事迹描述</span>
                <el-button style="float: right; padding: 3px 0" type="text">相关公益</el-button>
            </div>
            <div v-for="o in event" :key="o" class="text item">
                {{ o }}
            </div>
         </el-card>
         <div class="info-title">
             <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>用户须知</span>
                <el-button style="float: right; padding: 3px 0" type="text">用户</el-button>
            </div>
            <div v-for="(o, i) in needRead" :key="o" :class="{ 'marginTop': i%2 !==0, 'text':true, 'item':true }">
                {{ o }}
            </div>
         </el-card>
         </div>
     
      </div>
     
    </div>
</template>

<script>
export default {
    data() {
        return {
             slide: [ 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1605666728650&di=393eef8fcf554b95c6247c77aecc9636&imgtype=0&src=http%3A%2F%2Fwww.gdzhixinghui.com%2FUploadfiles%2F20160913183501076.jpg', 
                 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1605666544549&di=739d44007ac1b0615a89e845664a71ca&imgtype=0&src=http%3A%2F%2Fwww.ynyx.gov.cn%2Fyxrmzf%2Fzwdt78%2Fjryx%2F272326%2F2019030717480938278.jpg',
              'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1605666685947&di=a6782eb070e946bd9322264c3976d544&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fq_70%2Cc_zoom%2Cw_640%2Fimages%2F20181129%2Fea32ce8ef84743f998c1b9e7481a897b.jpeg', 
              'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1605666709585&di=ec33c4d286a9d1e469ab6a60eaab9f22&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180417%2F109becafc0474c4f8e9cf777af451b07.jpeg', 
              'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1605666804662&di=2067c31dd990f5ad40946ca57feda76d&imgtype=0&src=http%3A%2F%2Fimages.haiwainet.cn%2F20180524%2F1527124799666343.jpeg'],
             swiperOption: {
             //显示分页
             pagination: {
                el: '.swiper-pagination',
                clickable: true //允许分页点击跳转
                },
                //设置点击箭头
                navigation: {
                nextEl: '.swiper-button-next', 
                prevEl: '.swiper-button-prev'
                },
                //自动轮播
                autoplay: {
                delay: 4000
                },
                //开启循环模式
                loop: true,
                //开启鼠标滚轮控制Swiper切换
                mousewheel: true
             },
             event: [
                 '发挥互助作用，心系小区群众XXXXXXXXXXXXXXX',
                 '他人事就是自己事，热心肠助人为乐XXXXXXXXXXXXXXXX',
                 '小区生活无小事，全心全意为名办实事XXXXXXXXXXXXXXX',
                 '乐善好施，群众心中的指明灯XXXXXXXXXXXXXXX',
                 '2012年，XX经常在外出差，乐善好施CCCCCCXXXXXXXX',
                 '2012年，XX经常在外出差，乐善好施CCCCCCXXXXXXXX'
             ],
             needRead: [
                 '统一捐赠地址为：',
                 '江苏省南京市雨花楼666号，爱心书屋',
                 '合作商家：',
                 '拼夕夕集团、阿里吗吗公司',
                 '招募志愿者：',
                 '请联系我们：hxsw666@163.com'
             ]
        }
    },
    //生命周期 - 创建完成（访问当前this实例）
    created() {

    },
    //生命周期 - 挂载完成（访问DOM元素）
    mounted() {

    }
}
</script>
<style scoped>
/* @import url(); 引入css类 */
.swiper-slide {
  width: 100%;
  height: 300px;
  line-height:300px;
}
img{
    width: 100%;
    height: 100%;
}
 .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 600px;
  }
  .info-title{
      /* width: 50%; */
      margin-left:20px;
  }
  .marginTop{
      margin-left: 60px;
  }
  
</style>