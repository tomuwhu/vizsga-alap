<template>
  <v-app id="app">
      <h1>.... nyilvántartás</h1>
      <div class="c1">
        <v-text-field
          label="Irányítószám"
          v-model="o.irsz"
          @keyup="f()"
        />
        <h2>{{varos}}</h2>
      </div>
  </v-app>
</template>

<script>
export default {
  props: ['idb','idx'],
  data: () => ({
    o: {},
    varos:''
  }),
  methods: {
    f() {

      if ( !Number(this.o.irsz) ||
            Number(this.o.irsz) >  9999
      ) this.o.irsz = this.o.irsz.slice(0,-1)

      this.varos = this.idx(this.o.irsz)

    }
  },
  computed: {

  },
  mounted() {

  }
}
</script>

<style>
.c1 {
  box-shadow: 1px 1px 4px;
  border-radius: 12px;
  padding:20px;
  height:80%;
  background-color: #efedde;
}
h1 {
  box-shadow: 1px 1px 4px;
  border-radius: 12px;
  padding:20px;
  margin-bottom:23px;
  background-color: #dfedde;
}
#app {
  margin: 20px;
  text-align: center;
  height:90%;
  background-color: white;
}
</style>
