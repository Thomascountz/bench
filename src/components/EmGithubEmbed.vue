<template>
    <div ref="container"></div>
</template>
  
<script>
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
    },
    mounted() {
        this.createScript();
    },
    methods: {
        createScript() {
            const script = document.createElement('script');
            script.src = `https://emgithub.com/embed-v2.js?target=${encodeURIComponent(
                this.target
            )}&style=${this.style}&type=${this.type}&showBorder=${this.showBorder}&showLineNumbers=${this.showLineNumbers}&showFileMeta=${this.showFileMeta}&showFullPath=${this.showFullPath}&showCopy=${this.showCopy}`;
            this.$refs.container.appendChild(script);
        },
    },
};
</script>
  