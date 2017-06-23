const  exec = require('child_process').exec
const testprogram = 'get_classifications.js'
const get_pool = require('psql_pooler').get_pool

const tap = require('tap')

const path    = require('path')
const rootdir = path.normalize(__dirname)

const config_file = rootdir+'/../test.config.json'
const config_okay = require('config_okay')

const utils =  require('./utils.js')
const create_tables =utils.exec_create_tables
const drop_tables = utils.drop_tables


//tap.plan(1)


const run_test = async () =>{

    console.log('first test')
    await tap.test('command should work',async function(t){

        return new Promise( function (resolve,reject){

            const commandline =
                  ['node'
                   ,testprogram
                   ,"--config"
                   ,"app1.test.config.json",
                  ].join(' ')
            console.log(commandline)
            try {
                exec(commandline,function(e,stdout,stderr){
                    console.log('the end')
                    console.log(e)
                    console.log(stdout)
                    console.log(stderr)
                    if(e){
                        t.fail(e)
                        return reject(e)
                    }
                    t.pass('test passed with '+stdout+'\n'+stderr)
                    t.end()
                    return resolve(e)
                })
            }catch(e){
                console.log('caught',e)
            }
        })

    })

    await tap.test('command should work',async function(t){

        return new Promise( function (resolve,reject){

            const commandline =
                  ['node'
                   ,testprogram
                   ,"--config"
                   ,"app2.test.config.json",
                   ,"--directory"
                   ,"data2"
                  ].join(' ')

            try {
                exec(commandline,function(e,stdout,stderr){
                    console.log('the end')
                    console.log(e)
                    console.log(stdout)
                    console.log(stderr)
                    if(e){
                        t.fail(e)
                        return reject(e)
                    }
                    t.pass('test passed with '+stdout+'\n'+stderr)
                    t.end()
                    return resolve(e)
                })
            }catch(e){
                console.log('caught',e)
            }
        })

    })

    await tap.test('command should work',async function(t){

        return new Promise( function (resolve,reject){

            const commandline =
                  ['node'
                   ,testprogram
                   ,"--config"
                   ,"app1.test.config.json",
                   ,"--directory"
                   ,"bananas"
                  ].join(' ')

            try {
                exec(commandline,function(e,stdout,stderr){
                    console.log('the end')
                    console.log(e)
                    console.log(stdout)
                    console.log(stderr)
                    if(e){
                        t.fail(e)
                        return reject(e)
                    }
                    t.pass('test passed with '+stdout+'\n'+stderr)
                    t.end()
                    return resolve(e)
                })
            }catch(e){
                console.log('caught',e)
            }
        })

    })

    return null
}

let pool
let _config
config_okay(config_file)

    .then( async (config) => {
        // add the database name for pool
        config.postgresql.db = config.postgresql.signatures_db
        _config = config
        const tables = await create_tables(config)
        console.log('done create tables')
        try {
            await run_test()
        }catch (err){
            console.log(err)
        }
    })
    .then( async (r)=>{
        console.log('in the then with r=',r)
        console.log('done running the test')

        pool = await get_pool(_config)
        const client = await pool.connect()
        try{
            await drop_tables(client)
        }catch(e){
            console.log('drop failed',e)
            throw e
        }finally{
            client.release()
        }

    })
    .catch(async (err) =>{
        console.log('external catch statement triggered')
        console.log(err)
        throw new Error(err)
    })
