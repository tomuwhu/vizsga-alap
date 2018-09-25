<template>
  <v-app id="app">
      <h1>.... nyilvántartás</h1>
      <div class="c1" v-if="view=='list'">
        <table class="table" v-if="t.length">
          <tr>
            <th v-for="elem in Object.keys(t[0])">
              <span v-if="elem!='_id'">{{elem}}</span>
              <span v-else>#</span>
            </th>
          </tr>
          <tr v-for="sor in t">
            <td v-for="(elem,key) in Object.entries(sor)">
              <span v-if="elem[0]==='_id'">
                {{key+1}}
              </span>
              <span v-else-if="elem[0]==='irsz'">
                {{elem[1] + ' - ' + idx(elem[1])}}
              </span>
              <span v-else>
                {{elem[1]}}
              </span>
            </td>
            <td>
              <v-btn small class="green--text">
              <i class="material-icons">
              edit
              </i>
              </v-btn>
              <v-btn small class="red--text">
              <i class="material-icons">
              delete
              </i>
              </v-btn>
            </td>
          </tr>
        </table>
        <hr>
        <v-btn @click="view='form',o={}">Új elem</v-btn>
      </div>
      <div class="c1" v-if="view=='form'">
          <!-- Példa form -->
          <v-text-field
            class="i1"
            label="Irányítószám"
            counter = "4"
            mask = "####"
            v-model="o.irsz"
          />
          <br>
          <h2 class="i1">{{varos}}</h2>
          <br>
          <v-text-field
            class="i1"
            label="Telefonszám"
            counter = "9"
            mask = "(##) ###-##-##"
            v-model="o.tel"
          />
          <v-btn @click="view='list'">Mégse</v-btn>
            &nbsp;
          <v-btn @click="ment">Ment</v-btn>
          <!-- példa vége -->
      </div>
  </v-app>
</template>

<script>
const logger = false
export default {
  props: ['idx'],
  data: () => ({
    o: {},
    t: [],
    view: 'list'
  }),
  methods: {
    ment() {
      this
        .axios
        .post(
          'http://localhost:3000/save',
           this.o
        )
        .then( v => {
          if (logger) console.log(v.data)
          if (v.data._id) this.t.push(v.data)
        } )
    }
  },
  computed: {
    varos() {
      return this.idx(this.o.irsz)
    }
  },
  mounted() {
    this
      .axios
      .get(
        'http://localhost:3000/list'
      )
      .then( v => {
        if (logger) console.log(v.data)
        if (v.data.length) this.t = v.data
      } )
  }
}
</script>

<style>
.table {
  width: 100%;
}
td {
  font-size: 16px;
}
.i1 {
  width:200px;
  margin: 0 auto;
}
.c1 {
  text-align: center;
  box-shadow: 1px 1px 4px;
  border-radius: 12px;
  padding:20px;
  background-color: #efedde;
}
h1 {
  box-shadow: 1px 1px 4px;
  border-radius: 12px;
  padding:20px;
  margin-bottom: 23px;
  background-color: #dfedde;
}
#app {
  margin: 20px;
  text-align: center;
  height:90%;
  background-color: white;
}
</style>
