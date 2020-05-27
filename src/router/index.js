import Vue from 'vue';
import Router from 'vue-router';
/* layout */
import Layout from '../views/layout/Layout';

/*
in development env not use Lazy Loading,
because Lazy Loading large page will cause webpack hot update too slow.
so only in production use Lazy Loading
*/
const _import = require('./_import_' + process.env.NODE_ENV);

Vue.use(Router);

/**
 * icon : the icon show in the sidebar
 * hidden : if `hidden:true` will not show in the sidebar
 * redirect : if `redirect:noredirect` will no redirct in the levelbar
 * noDropdown : if `noDropdown:true` will has no submenu
 * meta : { role: ['admin'] }  will control the page role
 **/
export const constRouterMap = [{
    path: '/login',
    component: _import('auth/login'),
    hidden: true
}, {
    path: '/logout',
    component: _import('auth/logout'),
    hidden: true
}, {
    path: '/signin',
    component: _import('auth/signin'),
    hidden: true
}, {
    path: '/404',
    component: _import('error/404'),
    hidden: true
}, {
    path: '/401',
    component: _import('error/401'),
    hidden: true
}, {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    children: [{
        path: 'dashboard',
        component: _import('dashboard/index')
    }]
}, {
    path: '/about',
    component: Layout,
    redirect: '/about',
    icon: 'form',
    noDropdown: true,
    children: [{
        path: 'index',
        component: _import('about/index'),
        name: '简述'
    }]
}]

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({
        y: 0
    }),
    routes: constRouterMap
});

export const asyncRouterMap = [
    {
        path: '/system',
        component: Layout,
        name: '系统管理*',
        icon: 'setting',
        code: 'system',
        children: [{
            path: 'user',
            icon: 'fa-user',
            component: _import('system/user/index'),
            name: '用户管理*',
            code: 'system-user'
        }, {
            path: 'role',
            icon: 'fa-users',
            component: _import('system/role/index'),
            name: '角色管理*',
            code: 'system-role'
        }, {
            path: 'menu',
            icon: 'group_fill',
            component: _import('system/menu/index'),
            name: '菜单管理*',
            code: 'system-menu'
        }
        // , {
        //     path: 'dictionary',
        //     icon: 'fa-users',
        //     component: _import('system/dictionary/index'),
        //     name: '字典表数据管理*',
        //     code: 'system-dictionary'
        // }
        ]
    },
    {
        path: '/CargoNo',
        component: Layout,
        name: '单证中心*',
        icon: 'setting',
        code: 'CargoNo',
        children: [{
                path: 'pd',
                icon: 'fa-user',
                component: _import('CargoNo/pd/index'),
                name: 'pd*',
                code: 'CargoNo-pd'
            }, {
                path: 'vip',
                icon: 'fa-users',
                component: _import('CargoNo/vip/index'),
                name: 'vip*',
                code: 'CargoNo-vip'
            },{
                path: 'viplist',
                icon: 'fa-users',
                component: _import('CargoNo/viplist/index'),
                name: 'vip列表*',
                code: 'CargoNo-viplist'
            },{
                path: 'awbInfo',
                icon: 'fa-users',
                component: _import('CargoNo/awbInfo/index'),
                name: '运单信息*',
                code: 'CargoNo-awbInfo'
            }
        ]
    },
    {
        path: '/security',
        component: Layout,
        name: '安保操作*',
        icon: 'setting',
        code: 'security',
        children: [{
            path: 'cargoList',
            icon: 'fa-user',
            component: _import('security/cargoList/index'),
            name: '清单列表*',
            code: 'security-cargoList'
        }]
    },{
        path: '/statistics',
        component: Layout,
        name: '统计*',
        icon: 'setting',
        code: 'statistics',
        children: [{
            path: 'cargoList',
            icon: 'fa-user',
            component: _import('statistics/cargoList/index'),
            name: '载货清单*',
            code: 'statistics-cargoList'
        },{
            path: 'current',
            icon: 'fa-user',
            component: _import('statistics/current/index'),
            name: '统计信息*',
            code: 'statistics-current'
        }]
    },{
        path: '/park',
        component: Layout,
        name: '西区停车场*',
        icon: 'setting',
        code: 'park',
        children: [{
            path: 'truckList',
            icon: 'fa-user',
            component: _import('park/truckList/index'),
            name: '载货清单*',
            code: 'park-truckList'
        }]
    }
];
