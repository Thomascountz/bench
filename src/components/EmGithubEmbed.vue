<template>
  <div ref="container"></div>
</template>

<script>
import GithubTokenModel from '@/models/GithubTokenModel';

export default {
  props: {
    target: String,
    style: {
      type: String,
      default: 'default',
    },
    type: {
      type: String,
      default: 'code',
    },
    showBorder: {
      type: String,
      default: 'on',
    },
    showLineNumbers: {
      type: String,
      default: 'on',
    },
    showFileMeta: {
      type: String,
      default: 'on',
    },
    showFullPath: {
      type: String,
      default: 'on',
    },
    showCopy: {
      type: String,
      default: 'on',
    },
    fetchFromJsDelivr: {
      type: String,
      default: 'on',
    },
  },
  mounted() {
    this.createScript();
  },
  methods: {
    async createScript() {
      const token = await GithubTokenModel.getToken();
      const script = document.createElement('script');
      const publicPath = import.meta.env.BASE_URL || '/';
      script.src = `${publicPath}scripts/emgithub/embed-v2.js?target=${encodeURIComponent(
        this.target
      )}&style=${this.style}&type=${this.type}&showBorder=${this.showBorder}&showLineNumbers=${this.showLineNumbers}&showFileMeta=${this.showFileMeta}&showFullPath=${this.showFullPath}&showCopy=${this.showCopy}&fetchFromJsDelivr=${this.fetchFromJsDelivr}}&token=${token || ''}`;
      this.$refs.container.appendChild(script);
    },
  },
};
</script>
