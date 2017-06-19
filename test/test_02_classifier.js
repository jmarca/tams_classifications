const classifier = require('../lib/classifier.js')

const tap = require('tap')

//tap.plan(6)

tap.test('get_trip_request function exists',function (t) {
    t.plan(1)
    t.ok(classifier,'classifier fn exists')
    t.end()
})

let i
let check
for ( i = 0; i<93; i++ ){
    try {
        check = classifier({'bc_id':i})
        tap.ok(check,'got truty result')
        tap.ok(['HHDT','NHHDT','PC'].indexOf(check)>-1,'result in expected set of values')
    }
    catch(e){
        // should only catch on expected unkown values
        if([0,90].indexOf(i)>-1){
            tap.pass('it is okay for this body class id to fail')
        }else{
            tap.fail('unexpected classification fail for body class id ' + i)
        }
    }
}
tap.end()
