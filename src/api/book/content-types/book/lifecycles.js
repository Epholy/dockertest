'use strict';

const { loadImage, Canvas } = require('canvas');
const KMC = require('pickerkmc');
const Color = require('ac-colors');

/**
 * 根据图片的主要颜色生成对应的背景颜色。背景颜色通过lch(ab)色彩空间进行色调统一化处理
 * @param {Object} data 向集合类型中插入的数据（应包含有cover字段）
 * @param {Number} id 当前book的id（仅当beforeUpdate）
 */
async function genarateBackgroundColor(data, id) {
  if (!data.cover) {
    return;
  }

  // 获取图片的信息
  const imgInfo = await strapi.db.query('plugin::upload.file').findOne({
    select: ['id', 'url', 'provider', 'hash'],
    where: { id: data.cover },
  });
  if (id) {
    // 获取修改前的图片的信息
    const { cover: oldImgInfo } = await strapi.db
      .query('api::book.book')
      .findOne({
        select: ['id'],
        where: { id: id },
        populate: {
          cover: {
            select: ['id', 'hash'],
          },
        },
      });
    // 图片未修改时不做进一步运算
    if (imgInfo.hash === oldImgInfo.hash) {
      return;
    }
  }

  const url =
    imgInfo.provider === 'local'
      ? `http://localhost:1337${imgInfo.url}`
      : imgInfo.url;

  await loadImage(url)
    .then((image) => {
      let canvas = new Canvas(image.width, image.width);
      let ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0);
      let imageData = ctx.getImageData(0, 0, image.width, image.height);
      return imageData;
    })
    .then((imageData) => {
      const kmc = new KMC();
      const swtach = kmc.censusColors(imageData);
      return [swtach.mc[0].r, swtach.mc[0].g, swtach.mc[0].b];
    })
    .then((rgb) => {
      let bg_color = new Color({ color: rgb });
      bg_color.lchab = [70.4, 42.87].concat(bg_color.lchab[2]);
      let rgbString = bg_color.rgbString.toLowerCase();
      bg_color.lchab = [63.4, 62.46].concat(bg_color.lchab[2]);
      let rgbLightString = bg_color.rgbString.toLowerCase();
      bg_color.lchab = [42.43, 87.03].concat(bg_color.lchab[2]);
      let rgbDarkString = bg_color.rgbString.toLowerCase();
      bg_color.hsl = [].concat(bg_color.hsl[0], [82, 93]);
      let rgbLightestString = bg_color.rgbString.toLowerCase();
      data.bg_color = {
        rgbString,
        rgbLightString,
        rgbLightestString,
        rgbDarkString,
      };
    });
}

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    await genarateBackgroundColor(data);
  },
  async beforeUpdate(event) {
    const { data, where: { id: id } } = event.params;
    await genarateBackgroundColor(data, id);
  },
};
