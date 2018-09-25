# Vizsga-alap
- ###### Vue-CLI + Vuetify + Axios
- ###### Express + Body-parser + Cors
- ###### MongoDB

### Telepítés
- repository klónozása
- .../> ```cd vizsga-alap```
.../vizsga-alap> ```npm i```
.../vizsga-alap/front-end> ```npm i```

### MongoDB futtatása
- ```mongod```

### Back-end futtatása
- .../vizsga-alap> ```npm test```
- Böngészőben: http://localhost:3000

### Front-end futtatása
- .../vizsga-alap/front-end> ```npm run serve```
- Böngészőben: http://localhost:8080

### Front-end fordítása
- .../vizsga-alap/front-end> ```npm run build```
- Böngészőben: http://localhost:3000/vue

<hr>

### Példák a használathoz
###### .../vizsga-alap/front-end/src/App.vue

#### Axios - Adatok lekérése:
```javascript
mounted() {
  ...
  this
    .axios
    .get('http://localhost:3000/get')
    .then( v => {
      this.t = v.data
    })
  ...  
}  
```

#### Adatok megjelenítése:
```HTML
<template>
  <v-app>
    <v-container>
    ...
      <v-layout row
                v-for="row in t">
        <v-flex :class="'xs'+Math.round(12/Object.keys(row).length)"
                v-for="cell in row">
          {{ cell }}
        </v-flex>
      </v-layout>
    ...
    </v-container>
  </v-app>
</template>
```
#### Axios - Adatok mentése:
```javascript
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
}
```

#### Adatok törlése:
```javascript
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
```
