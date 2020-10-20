<template>
  <van-cell class="article-item">
    <div slot="title">{{article.title}}</div>
    <div slot="label">
      <div class="cover-wrap" v-if="article.cover.type === 3">
        <div class="cover-wrap-item">
          <van-image
            width="116"
            height="73"
            fit="cover"
            v-for="(img,index) in article.cover.images"
            :src="img" :key="index" />
        </div>
      </div>
      <div class="lable-wrap">
        <span>{{ article.aut_name }}</span>
        <span>{{ article.comm_count}}</span>
        <span>{{ article.pubdate }}</span>
      </div>
    </div>
      <!--   默认插槽名字叫default  可以省略   -->
      <van-image
        v-if="article.cover.type === 1"
        width="116"
        height="73"
        fit="cover"
        :src="article.cover.images[0]" />

  </van-cell>
</template>

<script>
export default {
  name: 'ArticleItem',
  props: {
    article: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>

</style>
