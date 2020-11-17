import Vue from 'vue'
import Router from 'vue-router'
import db from "../utils/sessionStorage"
import {getRequest} from "../utils/request"
Vue.use(Router)

// 静态路由
const login = r => require.ensure([], () => r(require('@/pages/login')), 'login');
const register = r => require.ensure([], () => r(require('@/pages/register')), 'register');
const home = r => require.ensure([], () => r(require('@/pages/home')), 'home');
const userinfo = r => require.ensure([], () => r(require('@/pages/user/info')), 'userinfo');
const pwd = r => require.ensure([], () => r(require('@/pages/user/password')), 'pwd');
const bookDetail = r => require.ensure([], () => r(require('@/pages/book/book-details')), 'book-detail');
const bookList = r => require.ensure([], () => r(require('@/pages/book/book-list')), 'book-list');
const bookAdd = r => require.ensure([], () => r(require('@/pages/book/book-add')), 'book-add');
const categoryList = r => require.ensure([], () => r(require('@/pages/book/category-list')), 'category-list');
const categoryDetail = r => require.ensure([], () => r(require('@/pages/book/category-details')), 'category-detail');
const categoryAdd = r => require.ensure([], () => r(require('@/pages/book/category-add')), 'category-add');
const categoryEdit = r => require.ensure([], () => r(require('@/pages/book/category-edit')), 'category-edit');
const donateList = r => require.ensure([], () => r(require('@/pages/donate/donate-list')), 'donate-list');
const personalDonate = r => require.ensure([], () => r(require('@/pages/donate/personal-donate')), 'personal-donate');
const needList = r => require.ensure([], () => r(require('@/pages/donate/need-list')), 'need-list');
const releaseDonate = r => require.ensure([], () => r(require('@/pages/donate/release-donate')), 'release-donate');
const commentList = r => require.ensure([], () => r(require('@/pages/comments/list')), 'comments-list');
const error = r => require.ensure([], () => r(require('@/pages/example/error')), 'error');
const userList = r => require.ensure([], () => r(require('@/pages/user/user-list')), 'user-list');
const roleList = r => require.ensure([], () => r(require('@/pages/user/role-list')), 'role-list');
const newsInfo = r => require.ensure([], () => r(require('@/pages/news')), 'news-info');
const newsHome = r => require.ensure([], () => r(require('@/pages/home/NewsHome')), 'news-home');

const constRouter = [
	{
		path: '/',
		name: '登录页',
		component: login,
		hidden: true
	},

	{
		path: '/register',
		name: '注册页',
		component: register,
		//hidden: true
	},
	{
		path: '/home',
		name: '主页',
		component: home,
		hidden: true,
		children:[
			{
				path: '/userinfo',
				name: '个人中心',
				component: userinfo,
				hidden: false ,
				meta:[
					{"name":"个人中心","path":""}
				]
			},
			{
				path: '/pwd',
				name: '修改密码',
				component: pwd,
				hidden: false ,
				meta:[
					{"name":"个人中心","path":"/userinfo"},{"name":"修改密码","path":""}
				]
			},
			{
				path: '/book-detail',
				name: '图书详情',
				component: bookDetail,
				hidden: false 
			},
			{
				path: '/book-list',
				name: '图书列表',
				component: bookList,
				hidden: false 
			},
			{
				path: '/book-add',
				name: '增加图书',
				component: bookAdd,
				hidden: false 
			},
			{
				path: '/category-list',
				name: '分类列表',
				component: categoryList,
				hidden: false 
			},
			{
				path: '/category-detail',
				name: '分类详情',
				component: categoryDetail,
				hidden: false 
			},
			{
				path: '/category-add',
				name: '增加分类',
				component: categoryAdd,
				hidden: false 
			},
			{
				path: '/category-edit',
				name: '修改分类',
				component: categoryEdit,
				hidden: false 
			},
			{
				path: '/donate-list',
				name: '捐赠列表',
				component: donateList,
				hidden: false 
			},
			{
				path: '/personal-donate',
				name: '个人捐赠',
				component: personalDonate,
				hidden: false 
			},
			{
				path: '/need-list',
				name: '需求列表',
				component: needList,
				hidden: false 
			},
			{
				path: '/release-donate',
				name: '发起众筹',
				component: releaseDonate,
				hidden: false 
			},
			{
				path: '/comments-list',
				name: '评论列表',
				component: commentList,
				hidden: false 
			},
			{
				path: '/error',
				name: '错误页面',
				component: error,
				hidden: false 
			},
			{
				path: '/user-list',
				name: '用户列表',
				component: userList,
				hidden: false 
			},
			{
				path: '/role-list',
				name: '角色列表',
				component: roleList,
				hidden: false 
			},
			{
				path: '/news-info',
				name: '公益捐赠',
				component: newsInfo,
				hidden: false 
			},
			{
				path: '/news-home',
				name: '新闻首页',
				component: newsHome,
				hidden: false 
			   },
			
		]
	},
	
]

// 动态路由主页
const dynamicRouter = [
	{
		path: '/home',
		name: '主页',
		component: home,
		hidden: true,
		children:[
			{
				path: '/userinfo',
				name: '个人中心',
				component: userinfo,
				hidden: false ,
				meta:[
					{"name":"个人中心","path":""}
				]
			},
			{
				path: '/pwd',
				name: '修改密码',
				component: pwd,
				hidden: false ,
				meta:[
					{"name":"个人中心","path":"/userinfo"},{"name":"修改密码","path":""}
				]
			}
		]
	}
]

let router = new Router({
	routes: constRouter
})

// 导航守卫，处理动态路由
let asyncRouter
router.beforeEach((to, from, next) => {
	let user = db.get("USER")
	let userRouter = db.get('USER_ROUTER')
	
	if(user && user.userId){
		if (!asyncRouter || asyncRouter=='') {
			if (!userRouter || userRouter=='' || userRouter==null) {
				getRequest('/system/org/permission/get-user-router', {}).then(resp => {
					if (resp.code == 200) {
						asyncRouter = resp.data
						if(resp.data.length>0){
							db.save('USER_ROUTER', resp.data)
							loadAsyncRouter(to, next)
						}
					}
				})
			} else {
				asyncRouter = userRouter
				loadAsyncRouter(to, next)
			}
		} else {
			next()
		}
	} else {
		next()
	}
})

// 载入异步路由
function loadAsyncRouter (to, next) {
	if(asyncRouter.length > 0){
		asyncRouter = filterAsyncRouter(asyncRouter)
		dynamicRouter.find(v => v.path === '/home').children.push(...asyncRouter)
		router.addRoutes(dynamicRouter)
	}
	next({...to, replace: true})
}

// 过滤路由
function filterAsyncRouter(routes){
	return routes.filter((route) => {
		route.component = resolveComponent(route.component)
		return true
	})
}

// 解析组件
function resolveComponent (path) {
	return function (resolve) {
		import(`@/pages/${path}.vue`).then(mod => {
			resolve(mod)
		})
	}
}

export default router