<template>
  <v-app>
    <v-container>
      <v-spacer/>
      <v-layout row>
        <v-flex xs3
          v-for="(elem,key) in t[0]"
          class="cell b">{{key}}</v-flex>
      </v-layout>
      <v-layout
          row
          v-for="row in t" >
        <v-flex xs3
          v-for="(elem,key) in row"
          class="cell">{{elem}}
        </v-flex>
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
.b {
  font-weight: bold;
}
.cell {
  text-align: center;
  margin:3px;
  padding:3px;
  box-shadow: 1px 1px 4px;
}
</style>
