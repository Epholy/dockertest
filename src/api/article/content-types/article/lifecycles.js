function generateDefaultSummary(data) {
  if (data.content) {
    if (data.summary) {
      return;
    }

    data.summary = data.content.match(/<p[\w\s=\-'"<>\(\)\\\/:;,.]*([^<]*)/)[1].slice(0, 100)
  }
}

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    await generateDefaultSummary(data);
  },
  async beforeUpdate(event) {
    const { data } = event.params;
    await generateDefaultSummary(data);
  },
}
