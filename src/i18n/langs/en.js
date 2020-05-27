import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
const en = {
  ...elementEnLocale,
  message: {
    hello: 'hello，world',
    route:{
      homePage:'home Page',
      system:'system manage',
      'system-user':'user manage',
      sms:'SMS center management',
      'sms-account':'Third-party account configuration'
    },
    system:{
      user:{
        system_user_btn_create_name: 'add'
      },
      role:{
        system_role_btn_create_name:'roleadd'
      }
    }
  }
}

export default en
