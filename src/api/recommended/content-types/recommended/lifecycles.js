'use strict'

async function fillTitle(relatedBook) {
  for(const relatedBookInterCode of relatedBook) {
    const entry = await strapi.entityService.findOne('related-book.关联图书', relatedBookInterCode.id, { populate: '*' });
    // 给组件的title字段赋值为关联图书字段的title的值
    if(entry.title !== entry.book.title) {
      await strapi.entityService.update('related-book.关联图书', relatedBookInterCode.id, { data: { title: entry.book.title } })
    }
  }
}

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    await fillTitle(data.relatedBook);
  },
  async beforeUpdate(event) {
    const { data } = event.params;
    await fillTitle(data.relatedBook);
  }
}
