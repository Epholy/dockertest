'use strict'

/**
 * 替换多行空格以及列表序号
 * @param {Object} data
 */
function format(data) {
  if (!data.responsibilities) {
    return;
  }
  data.responsibilities = data.responsibilities.trim()
    .replace(/\n{2,}/g, '\n')
    .replace(/\d+[.、\s]+/g, '')

  if (!data.requirements) {
    return;
  }
  data.requirements = data.requirements.trim()
    .replace(/\n{2,}/g, '\n')
    .replace(/\d+[.、\s]+/g, '')
}

module.exports = {
  beforeCreate(event) {
    const { data } = event.params;
    format(data);
  },

  beforeUpdate(event) {
    const { data } = event.params;
    format(data);
  }
}
