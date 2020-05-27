import Vue from 'vue'
import locale from 'element-ui/lib/locale';
import Cookies from 'js-cookie'
import VueI18n from 'vue-i18n'
import messages from './langs'

Vue.use(VueI18n)
export function getLanguage() {
  const chooseLanguage = Cookies.get('language')
  if (chooseLanguage) return chooseLanguage

  // if has not choose language
  const language = (navigator.language || navigator.browserLanguage).toLowerCase()
  const locales = Object.keys(messages)
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale
    }
  }
  return 'zh'
}
const i18n = new VueI18n({
  // locale: localStorage.lang || 'cn',
  // messages
  // set locale
  // options: en | zh | es
  locale: getLanguage(),
  // set locale messages
  messages
})

locale.i18n((key, value) => i18n.t(key, value)) //为了实现element插件的多语言切换

export default i18n
