<template>
  <v-app>
    <v-container>
      <v-spacer/>
      <v-layout row>
        <v-flex xs2 class="cell">Adatok:</v-flex>
        <v-flex xs10 class="cell">
          {{t}}</v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    t: []
  }),
  methods: {

  },
  computed: {

  },
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
.cell {
  text-align: center;
  margin:3px;
  padding:3px;
  box-shadow: 1px 1px 4px;
}
</style>
