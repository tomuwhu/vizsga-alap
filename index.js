var app = ( express = require( 'express' ) )( )
    app . use( require( 'body-parser' ).json( ) )
var mdb = require( 'mongodb' ).MongoClient
var ObjectId = require('mongodb').ObjectID
const database_name = "ujcica"
const collection_name = "mammals"
const static_folder = "dist"
mdb.connect( 'mongodb://localhost:27017',
              { useNewUrlParser: true },
              ( err, client ) => err
                  ? ( console.log('MongoDB hiba!') )
                  : ( db = client.db(database_name),
                      console.log('MongoDB OKÉ') )
)
app.use( (req, res, next) => {
    res.header(
        'Access-Control-Allow-Origin',
        '*'
    )
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    next()
} )
app.get( /get/, ( req, res ) =>
              db  ? db.collection( collection_name )
                      .find()
                      .toArray( ( err, result ) => err
                          ? res.send(err)
                          : res.send(result)
                      )
                  : res.send( { error: -1 } )
)
app.post( /post/, ( req, res ) => {
              console.log(req.body._id)
              if (req.body._id) {
                let ezt = req.body._id
                delete req.body._id
                db  ? db .collection( collection_name  )
                         .updateOne(
                           { "_id" : ObjectId(ezt) },
                           { $set: req.body }
                         )
                         .then( (v,err) => {
                           res.send( v )
                         } )
                    : res.send( { error: -1 } )
              } else {
                  db  ? db .collection( collection_name  )
                           .insertOne( req.body )
                           .then( res.send( req.body ) )
                      : res.send( { error: -1 } )
              }
} )
app.post( /del/, ( req, res ) => {
              db  ? db .collection( collection_name  )
                       .deleteOne( { "_id" : ObjectId(req.body.ezt) } )
                       .then( v=>
                         res.send(v)
                       )
                  : res.send( { error: -1 } )
} )
app.use( '/', express.static( static_folder ) )
app.listen( 3000 )
