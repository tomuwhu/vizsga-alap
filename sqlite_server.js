const app = (express = require('express'))()
app.use(require('body-parser').json())
app.use(require('cors')())
require('colors')
var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('x.db')

const static_folder = 'root'
const vue_folder = 'front-end/dist'
const logger = true

/*
db.serialize( () => {
    db.run(`CREATE TABLE data (id PRIMARY KEY, json TEXT)`)
    db.run(`DELETE FROM data`)
    db.run(`INSERT INTO data VALUES (${ Math.random() }, 'cucc')`)
    db.each(`SELECT * FROM data`, (err, row) => {
        console.log(row)
    })
})
*/

app.get(/list/, (req, res) => {
    let t = []
    db.each(`SELECT * FROM data`, (err, row) => {
        console.log(row)
        t.push(row)
    })
    setTimeout( () => res.send(t), 100 )
} )

app.post(/save/, (req, res) => {
     logger ? console.log(req.body) : 1
     if (req.body._id) {

     } else {
        let id = Math.random()
        db.run(`INSERT INTO data VALUES (${ id }, '${ JSON.stringify(req.body) }' )`)
        req.body._id=id
        res.send(req.body)
     }
})

app.get(/del/, (req, res) => {
    db.run(`DELETE FROM data`)
    res.send('Minden törölve')
})
/*
app.post(/del/, (req, res) => {
    logger ? console.log(req.body) : 1
    db ? db.collection(collection_name)
        .deleteOne({
            "_id": ObjectId(req.body._id)
        })
        .then(v =>
            res.send(v)
        ) :
        res.send({
            error: -1
        })
})
*/
app.use('/', express.static(static_folder))
app.use('/vue', express.static(vue_folder))
app.listen(3000)
