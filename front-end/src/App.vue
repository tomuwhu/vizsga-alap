<template>
  <v-app id="app">
      <h1>Példa nyilvántartás</h1>
      <div class="c1" v-if="view=='list'">
        <v-layout row>
          <v-text-field
              label = "Keresés / Szűrés"
              v-model = "szuro"/>
          <v-btn
             v-if  = "szuro"
             small
            @click = "szuro=''"
             class = "red--text">
          <i class = "material-icons">
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
                {{ backmask( sor[elem.key], elem.mask ) }}
              </span>
            </td>
            <td>
              <v-btn
                 small
                @click = "o = sor, view='form'"
                 class = "green--text">
              <i class = "material-icons">
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
          <div v-for="elem in listview">
          <v-select
            v-if     = "elem.items"
            class    = "i1"
            :items   = "elem.items"
            :label   = "elem.mn"
            v-model  = "o[elem.key]"
          />
          <v-text-field
            v-else
            class    = "i1"
            :label   = "elem.mn"
            :counter = "elem.counter"
            :mask    = "elem.mask"
            v-model  = "o[elem.key]"
          />
          </div>
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
      { key: 'nev', mn : 'Név', counter:30 },
      { key: 'szakma', mn : 'Szakma', items: ['Ács', 'Asztalos', 'Burkoló', 'Kőműves', 'Villanyszerelő', 'Vízvezetékszerelő']  },
      { key: 'tel', mn : 'Telefonszám', mask:'(##) ###-##-##', counter:9 }
    ],
    szures: ['nev','szakma']
  }),
  methods: {
    backmask( a, m ) {
      if (m) {
        let s = '', i = 0
        m.split('').forEach(v => {
          if ( '#AanNX'.includes(v) ) {
            s += a[i++]
          } else s += v
        })
        return s
      } else return a

    },
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
              .filter( v => {
                let q = false
                this.szures.forEach( szuro => {
                  if (new RegExp(this.szuro,'i').test( v[szuro] )) q = true
                })
                return q
              } )
              .sort( (a,b) => a[this.szures[0]] ? a[this.szures[0]].localeCompare(b[this.szures[0]]) : 1 )
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
