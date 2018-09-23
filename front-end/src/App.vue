<template>
  <v-app>
    <v-container>
      <v-spacer/>
      <v-layout row>
        <v-flex v-for="(elem,key) in t[0]">{{key}}</v-flex>
      </v-layout>
      <v-layout row v-for="row in t">
        <v-flex v-for="(elem,key) in row">{{elem}}</v-flex>
      </v-layout>
      <v-spacer/>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    t: []
  }),
  mounted() {
    this
      .axios
      .get('http://localhost:3000/get')
      .then( v => {
        this.t = v.data
      })
  }
}
</script>

<style>

</style>
