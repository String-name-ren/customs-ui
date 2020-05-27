
export function generateTitle(title) {
  const translatedTitle = this.$t('message.route.' + title)
  return translatedTitle
}

export function generateInternational(title) {
  const translatedTitle = this.$t(title)
  return translatedTitle
}
