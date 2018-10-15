cc = require('exam-cc')
let t = cc.read('rovidprogram.csv',';',1)
/*cc.initsql('mai', t, 'rovidprogram')
let u= cc.read('donto.csv',';',1)
cc.initsql('mai', u, 'donto')*/
cc.initsql('mai')
console.log('A rövidprogramban elindult versenyzők száma: '+t.length);
let f1 = cc.query(`
    SELECT *
    FROM mai.donto
    WHERE Ország = 'HUN'
`)
console.log(f1[0].Név);
Osszpontszam = (nev) => {
  let x = cc.query(`
    SELECT  rovidprogram.Technikai
    		+rovidprogram.Komponens
            -rovidprogram.Levonás
    		Rövid,
            +donto.Technikai
            +donto.Komponens
            -donto.Levonás
            Döntő
    FROM rovidprogram
    LEFT JOIN donto ON rovidprogram.Név = donto.Név
    WHERE rovidprogram.Név = "${nev}"
  `)[0]
  let z = x?(x.Döntő?x.Rövid+x.Döntő:x.Rövid).toFixed(2):null
  return x?{
    Rövid: x.Rövid.toFixed(2),
    Döntő: x.Döntő.toFixed(2),
    Össz:  z ,
    Kiír:  'A versenyző összpontszáma: '+z
  }:{Kiír: 'Ilyen nevű felhasználó nem volt'}
}
console.log(Osszpontszam(cc.input('')).Kiír)
let mondjuk = cc.query(`
  SELECT  Ország, COUNT(__id) db
  FROM donto
  GROUP BY Ország
  HAVING db > 1
  `)
console.log(mondjuk.map(
  v=>`${v.Ország}: ${v.db} versenyző\n`
).join(''))

let például = cc.query(`
  SELECT  rovidprogram.Név, rovidprogram.Ország,
  			IF(donto.Technikai,
              donto.Technikai
              +donto.Komponens
              -donto.Levonás
              +rovidprogram.Technikai
      		+rovidprogram.Komponens
              -rovidprogram.Levonás,

  			rovidprogram.Technikai
      		+rovidprogram.Komponens
              -rovidprogram.Levonás


              ) összpontszám
  FROM rovidprogram
  LEFT JOIN donto ON rovidprogram.Név = donto.Név
  ORDER BY összpontszám DESC

  `)
  .map((v,k) => {
    v.helyezés = k+1
    return v
  })
  console.log (például)
  cc.write(`vegeredmeny.csv`, például)
