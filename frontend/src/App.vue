<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useSiteConfigStore } from '@/stores/siteConfig'

const store = useSiteConfigStore()
onMounted(() => store.loadAll())
</script>
