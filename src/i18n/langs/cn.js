import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
const cn = {
  ...elementZhLocale,
  message: {
    hello: '你好，世界',
    route:{
      homePage:'首页',
      //系统管理模块
      system:'系统管理',
      'system-user':'用户管理',
      'system-role':'角色管理',
      'system-menu':'菜单管理',
      'system-supplier':'供应商管理',
      'system-barch':'供应商管理',
      'system-department':'部门管理',
      'system-dictionary':'字典表数据管理',
      'system-merchant':'商户管理',
      //短信中心管理模块
      sms:'短信中心管理',
      'sms-account':'三方账户配置'
    },
    system:{
      user:{
        system_user_btn_create_name: '新增'
      },
      role:{
        system_role_btn_create_name:'角色添加'
      },
    }
  }
}

export default cn
