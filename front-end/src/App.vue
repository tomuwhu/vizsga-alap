<template>
  <v-app id="app">
      <h1>Példa nyilvántartás</h1>
      <div class="c1" v-if="view=='list'">
        <v-text-field
            label="Keresés / Szűrés"
            v-model="szuro"/>
        <table class="table" v-if="t.length">
          <tr>
            <th v-for="elem in Object.keys(t[0])">
              <span v-if="elem!='_id'">{{elem}}</span>
              <span v-else>#</span>
            </th>
          </tr>
          <tr v-for="(sor, key) in lista">
            <td v-for="elem in Object.entries(sor)">
              <span v-if="elem[0]==='_id'">
                {{key+1}}
              </span>
              <span v-else-if="elem[0]==='irsz'">
                {{elem[1] + ' - ' + idx(elem[1])}}
              </span>
              <span v-else-if="elem[0]==='tel'">
                {{
                    '+36 (' +
                    elem[1].slice(0,2) +
                    ') ' +
                    elem[1].slice(2,5) + '-' +
                    elem[1].slice(5,7) + '-' +
                    elem[1].slice(7,9)
                }}
              </span>
              <span v-else>
                {{elem[1]}}
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
const logger = true
export default {
  props: ['idx'],
  data: () => ({
    szuro: '',
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
          if (v.data._id) {
            this.t.push(v.data)
            this.view = 'list'
            this.o = {}
          }
          if (v.data.nModified) {
            this.view = 'list'
            this.o = {}
          }
        } )
    },
    töröl(ezt) {
      this
        .axios
        .post(
          'http://localhost:3000/del',
           ezt
        )
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
                new RegExp(this.szuro,'i').test( this.idx(v.irsz) )
              )
              .sort( (a,b) => this.idx(a.irsz).localeCompare(this.idx(b.irsz)) )
              .slice(0,10)
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
