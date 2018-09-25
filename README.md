# Vizsga-alap
- ###### Vue-CLI + Vuetify + Axios
- ###### Express + Body-parser + Cors
- ###### MongoDB

### Telepítés
- repository klónozása
- .../> ```cd vizsga-alap```
.../vizsga-alap> ```npm i```
.../vizsga-alap/front-end> ```npm i```

### Back-end futtatása
- .../vizsga-alap> ```npm test```

### Front-end futtatása
- .../vizsga-alap/front-end> ```npm run serve```

### Front-end fordítása
- .../vizsga-alap/front-end> ```npm run build```

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
</template>```
