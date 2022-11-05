<script lang="ts">
  import { ContentLoader } from "vue-content-loader"

  export default {
    name: 'CounterLoader',
    components: { ContentLoader }
  }
</script>

<template>
  <content-loader
    viewBox="0 0 600 400"
    :speed="1"
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
    :style="{ marginTop: '50px' }"
  >
    <circle cx="420" cy="180" r="170" /> 
    <rect x="20" y="60" rx="3" ry="3" width="180" height="15" /> 
    <rect x="20" y="90" rx="3" ry="3" width="180" height="15" /> 
    <rect x="20" y="120" rx="3" ry="3" width="180" height="15" /> 
    <rect x="20" y="150" rx="3" ry="3" width="180" height="15" /> 
    <rect x="20" y="180" rx="3" ry="3" width="180" height="15" /> 
    <rect x="20" y="210" rx="3" ry="3" width="180" height="15" /> 
    <rect x="20" y="240" rx="3" ry="3" width="180" height="15" />
    <rect x="20" y="270" rx="3" ry="3" width="180" height="15" />
    <rect x="20" y="300" rx="3" ry="3" width="180" height="15" />
  </content-loader>
</template>
