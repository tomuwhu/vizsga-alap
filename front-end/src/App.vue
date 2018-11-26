<template>
  <v-app id="app">
      <h1>{{kiiras}}</h1>
      <div class="c1" v-if="view=='reszl'">
        <v-layout row v-for="elem in listview">
          <v-flex
             v-if     = "elem.type==='rating'">
          <v-rating
             v-model  = "o[elem.key]"
             color    = "red darken-3"
             half-increments
             readonly
             />
          </v-flex>
          <v-layout row v-else>
            <v-flex text-xs-right xs6 reszl>
              <b>{{elem.mn}}:</b>
            </v-flex>
            <v-flex  text-xs-left xs6>
              &nbsp;
              <span v-if="elem.type==='address'">
                {{o[elem.key+'_irsz']}}, {{idx(o[elem.key+'_irsz'])}}, {{o[elem.key+'_cimsor']}}
              </span>
              <i v-else>{{ mask( o[elem.key], elem.mask ) }}</i>
            </v-flex>
          </v-layout>
        </v-layout>
        <br>
        <hr>
        <v-btn @click = "view='form'" class="white--text pink">Szerkeszt</v-btn>
        <v-btn @click="view='list'" class="white--text blue">Bezár</v-btn>
      </div>
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
        <div xs-text-center>
        <table class="table" v-if="t.length" style="margin:0 auto;">
          <tr>
            <th>#</th>
            <th v-for="elem in listv2" :style="'text-align: '+elem.align">
              <span v-if="elem.type==='rating'">
                <i class="material-icons">star_half</i>
              </span>
              <span v-else class="fejrow">{{elem.mn}}</span>
            </th>
            <th>
              <span class="fejrow">Műveletek</span>
            </th>
          </tr>
          <tr v-for="(sor, key) in lista" :class="'row'+(key%2)">
            <th>
              {{key+1}}
            </th>
            <td v-for="elem in listv2" :style="'text-align: '+elem.align">
              <span v-if="elem.type==='address'">
                {{sor[elem.key+'_irsz']}}, {{idx(sor[elem.key+'_irsz'])}}, {{sor[elem.key+'_cimsor']}}
              </span>
              <span v-else>
                {{ mask( sor[elem.key], elem.mask ) }}
              </span>
            </td>
            <td>
              <span
                 small
                 v-if  = "hkb"
                @click = "o = sor, view='reszl'"
                 class = "g orange--text">
              <i class = "material-icons"
                 title = "Részletek megjelenítése">
                 dvr
              </i>
              </span>
              <span
                 small
                @click = "o = sor, view='form'"
                 class = "g green--text">
              <i class = "material-icons"
                 title = "Szerkesztés, módosítás">
                 {{editic}}
              </i>
              </span>
              <span
                 small
                 class = "g red--text"
                @click = "töröl(sor)">
              <i class = "material-icons"
                 title = "Törlés">
                 {{deleteic}}
              </i>
              </span>
            </td>
          </tr>
        </table>
        <br>
        </div>
        <hr>
        <v-btn @click="view='form',o={}"
               fab dark small
               color="red">
            <v-icon
               dark>add</v-icon>
        </v-btn>
      </div>
      <div class="c1" v-if="view=='form'">
          <div v-for="elem in listview">
          <v-rating
            v-if     = "elem.type==='rating'"
            v-model  = "o[elem.key]"
            half-increments
            hover />
          <table class = "i1" v-else-if= "elem.type==='address'">
            <tr>
              <td style="width:20%; test-align:left;">
                {{elem.mn}}
              </td>
              <td style="width:40%;">
                <v-text-field
                  class    = "ihalf"
                  label   = "Irányítószám"
                  mask    = "####"
                  v-model  = "o[elem.key+'_irsz']"
                />
              </td>
              <td style="width:40%;">
                {{idx(o[elem.key+'_irsz'])}}
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <v-text-field
                  class    = "i1"
                  label   = "Utca / házszám / (emelet / ajtó)"
                  v-model  = "o[elem.key+'_cimsor']"
                />
              </td>
            </tr>
          </table>
          <v-select
            v-else-if= "elem.items"
            class    = "i1"
            :items   = "elem.items"
            :label   = "elem.mn"
            v-model  = "o[elem.key]"
            :multiple= "elem.type"
          />
          <v-text-field
            v-else-if= "elem.type!=='rating'"
            class    = "i1"
            :label   = "elem.mn"
            :counter = "elem.counter"
            :mask    = "elem.mask"
            v-model  = "o[elem.key]"
          />
          </div>
          <v-btn @click="view='list'" class="white--text orange">Mégse</v-btn>
            &nbsp;
          <v-btn @click="ment" class="white--text green">Ment</v-btn>
      </div>
      <div class="devtool">Adatbázis ürítése
        <v-btn @click="deleteall"
             title="adatbázis ürítése"
             fab dark small
             color="red">
          <v-icon
             rounded>pan_tool</v-icon>
        </v-btn> &nbsp; 
        <span class="fft" >
          &nbsp; Adatbázis feltöltése fájlból &nbsp; 
          <input type='file' ref="fu" @change="foo()">
        </span>
      </div>
  </v-app>
</template>

<script>

/// - Szerkeszthető rész kezdete
const config = {
  // Oldal címsor
  kiírás: 'Példa nyilvántartás',
  // Adatstruktúra és beviteli maszkők - kötelező kitölteni!
  // A megadottak csak mnták, a nem szükségeseket törölni kell.
  /* mask (maszk) jelölések:
      #: szám
      a: kis betű
      A: nagy betű
      a többi karakter a maszk része
  */
  adatstuktúra: [
    { key:    'nev',
      mn :    'Név',
      align:  'left',
      counter: 30
    },
    { key:    'szakma',
      mn :    'Szakma',
      align:  'left',
      type:   'multiple',
      items: [
              'Ács',
              'Asztalos',
              'Burkoló',
              'Kőműves',
              'Villanyszerelő',
              'Vízvezetékszerelő'
      ]
    },
    { key:    'tel',
      mn :    'Telefonszám',
      mask:   '(##) ###-##-##',
      counter: 9
    },
    { key:    'ert',
      type:   'rating',
    },
    { key:    'szig',
      mn :    'Személyi igazolvány száma',
      mask:   '######AA',
      counter: 8
    },
    { key:    'cim',
      mn :    'Cím',
      type:   'address'
    }

  ],

  // rejtett mezők - lista nézetben nem látszanak
  hidedkeys: ['szig'],

  // Szűrés - rendezés beállítása, első mező szerint rendez, mindegyik felsoroltban keres
  szuresrendez: [
    'nev',
    'szakma',
    '_cim'
  ],

  editicon: 3,      //1..3

  deleteicon: 3,     //1..5

  logger: false     //debugoláshoz érdemes true-ra állítani
}
/// - Szerkeszthető rész vége

const read = (s, sep2 = ';', sl1=0, hl=false, sl0=0, sep1 = 'auto', cs='UTF-8') => {
  if (sep1==='auto') {
    if (s.includes('\r\n')) sep1 = '\r\n'
    else sep1 = '\n'
  }
  let rows=s.split(sep1)
  let keys=[], ot=[], q, o
  var inc=1
  if (!hl) rows[0].split(sep2).forEach(v=>keys.push(v.replace(/\s/g,'_')))
  else {
      keys=hl
      inc=0
  }
  sl0+=inc
  if (sl1>0) sl1 =- sl1
  if (sl1<0) q=rows.slice(sl0,sl1)
  else {
    if (sl0) q=rows.slice(sl0)
    else q=rows
  }
  q.map( row => {
    o = {}
    row.split(sep2).forEach( (v,k) => {
        o[keys[k]] = v.replace("'","´")
    } )
    ot.push(o)
  })
  return ot
}

const logger = config.logger
const editiconlist = ['edit', 'build', 'update']
const deleteiconlist = ['delete', 'backspace', 'delete_sweep', 'remove', 'remove_circle', 'cancel']
const backend = 'http://localhost:3000/'
export default {
  props: ['idx'], //idx a public method
  data: () => ({
    szuro: '',
    o: {},
    t: [],
    view: 'list',
    listview: config.adatstuktúra,
    szures:   config.szuresrendez,
    kiiras:   config.kiírás,
    editic:   editiconlist[config.editicon-1],
    deleteic: deleteiconlist[config.deleteicon-1],
    hkb:      config.hidedkeys.length
  }),
  methods: {
    foo() {   
      var f = new FileReader
      f.onload = x => {
        this.t = read(x.target.result,';',1)
        this.t.forEach( v => {
          console.log(v)  
          this
            .axios
            .post( backend + 'save', v )
        } )
      }
      f.readAsText( this.$refs.fu.files[0] )
    },
    mask( a, m ) {
      if (!a) return '-'
      if (m) {
        let s = '', i = 0
        m.split('').forEach(v => {
          if ( '#AanNX'.includes(v) ) {
            s += a[i++]
          } else s += v
        })
        return s
      } else if ( Array.isArray(a) ) {
        return a.join(', ')
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
    },
    deleteall() {
      this
        .axios
        .get( backend + 'del' )
        .then( v => {
          if (v.data.n) {
            this.t = []
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
                  if ( Array.isArray(szuro) ) {
                    szuro.forEach( szuro => {
                      if (new RegExp(this.szuro,'i').test( v[szuro] )) q = true
                    } )
                  }
                  else if (szuro[0]==='_') {
                    if (new RegExp(this.szuro,'i').test( v[szuro.slice(1)+'_cimsor'] )) q = true
                    if (new RegExp(this.szuro,'i').test( this.idx(v[szuro.slice(1)+'_irsz']) )) q = true
                  }
                  else {
                    if (new RegExp(this.szuro,'i').test( v[szuro] )) q = true
                  }
                })
                return q
              } )
              .sort( (a,b) => a[this.szures[0]] ? a[this.szures[0]].localeCompare(b[this.szures[0]]) : 1 )
              .slice(0,10)
    },
    listv2() {
      return this.listview.filter( v => !config.hidedkeys.includes(v.key) )
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

/* - Szerkeszthető rész kezdete */
.fejrow {
  font-size:16px;
  color: #154741;
  text-shadow: 1px 1px 4px #aaa;
}
.reszl {
  font-size: 15px;
}
span.g {
  margin-right:   4px;
  margin-left:    4px;
  cursor:         pointer;
  text-shadow: 1px 1px 4px #aaa;
}
span.g:hover {
  text-shadow: 1px 1px 1px black;
}
tr.row0 {
  background-color: rgba(180, 220, 220, 0.3);
  border-radius: 5px;
  box-shadow: 1px 1px 2px gray;
}
tr.row1 {
  background-color: rgba(220, 180, 220, 0.3);
  border-radius: 5px;
  box-shadow: 1px 1px 2px gray;
}
td,th {
  font-size: 13px;
  padding-left:10px;
  padding-right:10px;
  color: #256761;
}
.i1 {
  width:400px;
  margin: 0 auto;
}
.ihalf {
  width:100px;
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
.devtool {
  /* visibility: hidden; /* set visibility to visible to show dev tools */
  text-align:center;
  color:red;
  box-shadow: 1px 1px 4px gray;
  border-radius: 12px;
  padding:5px;
  margin-top:15px;
  background-color: #efedde;
}
.fft {
  color:blue;
  margin: 2px auto;
  padding: 9px;
  border: solid 1px black;
  box-shadow: 0px 0px 3px black;
  border-radius: 6px;
  background-color: #ecf1f1;
}
/* - Szerkeszthető rész vége */

</style>
