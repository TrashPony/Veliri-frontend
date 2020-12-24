<template>
  <div>
    <app-in-base v-if="$route.path === '/lobby'"/>
    <app-in-world v-if="$route.path === '/global'"/>
  </div>
</template>

<script>

  import InBase from './InBase'
  import InWorld from './InWorld'

  export default {
    name: "Department",
    components: {
      AppInBase: InBase,
      AppInWorld: InWorld,
    }
  }
</script>

<style>

</style>
