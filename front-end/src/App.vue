<template>
  <v-app id="app">
      <h1>Intézmény nyilvántartás</h1>
      <div class="c1" v-if="view=='list'">
        <v-layout row>
          <v-text-field
              label="Keresés / Szűrés"
              v-model="szuro"/>
          <v-btn
             v-if="szuro"
             small
            @click="szuro=''"
             class="red--text">
          <i class="material-icons">
          clear
          </i>
          </v-btn>
        </v-layout>
        <table class="table" v-if="t.length">
          <tr>
            <th>#</th>
            <th v-for="elem in listview">
              <span>{{elem.mn}}</span>
            </th>
          </tr>
          <tr v-for="(sor, key) in lista">
            <th>
              {{key+1}}
            </th>
            <td v-for="elem in listview">
              <span>
                {{sor[elem.key]}}
              </span>
            </td>
            <td>
              <v-btn
                 small
                @click="o = sor, view='form'"
                 class="green--text">
              <i class="material-icons">
              edit
              </i>
              </v-btn>
              <v-btn
                 small
                 class = "red--text"
                @click = "töröl(sor)">
              <i class = "material-icons">
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
            v-for="elem in listview"
            :label="elem.mn"
            :counter = "elem.counter"
            :mask = "elem.mask"
            v-model="o[elem.key]"
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
const backend = 'http://localhost:3000/'
export default {
  props: ['idx'],
  data: () => ({
    szuro: '',
    o: {},
    t: [],
    view: 'list',
    listview: [
/*
Intézmény név, Intézmény típusa, Nyilvántartási szám, Képviseli, Levelezési cím, Központi telefonszám,
*/
      { key: 'inev', mn : 'Intézménynév', counter:30 },
      { key: 'itip', mn : 'Intézménytípus', counter:30 },
      { key: 'nytsz', mn : 'Nyílvántartási szám', counter:30 },
      { key: 'kepv', mn : 'Képviseli', counter:30 },
      { key: 'levcir', mn : 'Levelezési cím - Irányítószám', counter:30 },
      { key: 'varos', mn : 'Levelezési cím - Város', counter:30 },
      { key: 'cimsor', mn : 'Levelezési cím -Utca / házszám', counter:30 },
      { key: 'tel', mn : 'Telefonszám', mask:'(##) ###-##-##', counter:9 }
    ],
    szures: 'itip'
  }),
  methods: {
    ment() {
      this
        .axios
        .post( backend + 'save', this.o )
        .then( v => {
          if (logger) console.log(v.data)
          if (v.data._id) {
            this.t.push(v.data)
            this.view = 'list'
            this.o = {}
          }
          if (v.data.n) {
            this.view = 'list'
            this.o = {}
          }
        } )
    },
    töröl(ezt) {
      this
        .axios
        .post( backend + 'del', ezt )
        .then( v => {
          if (logger) console.log(v.data)
          if (v.data.n) {
            this.t = this.t.filter( v =>
              v._id != ezt._id
            )
          }
        } )
    }
  },
  computed: {
    varos() {
      return this.idx(this.o.irsz)
    },
    lista() {
      return this
              .t
              .filter( v =>
                new RegExp(this.szuro,'i').test( v[this.szures] )
              )
              .sort( (a,b) => a[this.szures].localeCompare(b[this.szures]) )
              .slice(0,10)
    }
  },
  mounted() {
    this
      .axios
      .get( backend + 'list' )
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
  background-color: #efcdde;
}
h1 {
  box-shadow: 1px 1px 4px;
  border-radius: 12px;
  padding:20px;
  margin-bottom: 23px;
  background-color: #cfedde;
}
#app {
  margin: 20px;
  text-align: center;
  height:90%;
  background-color: white;
}
</style>
