const app = (express = require('express'))()
app.use(require('body-parser').json())
app.use(require('cors')())
require('colors')
var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('x.db')

const static_folder = 'root'
const vue_folder = 'front-end/dist'
const logger = false

app.get(/list/, (req, res) => {
    let t = []
    let o = {}
    db.each(
        `SELECT * FROM data`,
        (err, row) => {
            o = JSON.parse(row.json)
            o._id= row.id
            t.push(o)
        },
        (err, n) => {
            res.send(t)
            logger ? console.log(t) : false
        }
    )
} )

app.post(/save/, (req, res) => {
     logger ? console.log(req.body) : 1
     if (req.body._id) {
        db.run(`UPDATE data SET json = '${ JSON.stringify(req.body) }' WHERE id = ${ req.body._id }`)
        res.send({n:1})
     } else {
        let id = Math.random()
        db.run(`INSERT INTO data VALUES ( ${ id }, '${ JSON.stringify(req.body) }' )`, err => {
            if (!err) {
                req.body._id = id
                res.send(req.body)
            } else res.send({err: -1})
        } ) 
        
     }
})

app.get(/del/, (req, res) => {
    db.run(
        `DELETE FROM data`, 
        (err,n) => err ? res.send( {err} ) : res.send({err})
    )
})

app.post(/del/, (req, res) => {
    logger ? console.log(req.body) : 1
    db.run(
        `DELETE FROM data WHERE id = ${ req.body._id } `, 
        (err,n) => err ? res.send( {err} ) : res.send( { n: 1 } ) 
    )
    
})

app.use('/', express.static(static_folder))
app.use('/vue', express.static(vue_folder))
app.listen(3000)
