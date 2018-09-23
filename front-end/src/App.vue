<template>
  <v-app>
    <v-container>
      <v-spacer/>
      <v-layout row
                v-for="row in t">
        <v-flex class="cell"
                v-for="cell in row">
          {{ cell }}
        </v-flex>
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
  padding:8px;
  box-shadow: 1px 1px 4px;
}
</style>
