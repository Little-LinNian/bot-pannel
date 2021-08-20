import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const children: Array<RouteConfig> = [
	{
		path: 'dashboard',
		name: 'dashboard',
		component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard.vue'),
		meta: {
			title: '控制面板'
		}
	},
	{
		path: 'modules',
		name: 'modules',
		component: () => import(/* webpackChunkName: "plugins" */ '@/views/modules.vue'),
		meta: {
			title: 'Saya Modules'
		}
	},
	{
		path: 'log',
		name: 'log',
		component: () => import(/* webpackChunkName: "message" */ '@/views/log.vue'),
		meta: {
			title: '实时日志'
		}
	},

]

const routes: Array<RouteConfig> = [
	{
		path: '/',
		redirect: 'dashboard',
		component: () => import('@/layouts/default.vue'),
		meta: { auth: true },
		children: [...children]
	}
]

const router = new VueRouter({
	mode: 'hash',
	base: process.env.BASE_URL,
	routes
})

export default router
