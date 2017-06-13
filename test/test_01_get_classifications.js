const get_classifications = require('../lib/get_classifications').get_classifications
const get_pool = require('psql_pooler').get_pool

const tap = require('tap')

const path    = require('path')
const rootdir = path.normalize(__dirname)

const config_file = rootdir+'/../test.config.json'
const config_okay = require('config_okay')

const utils =  require('./utils.js')
const create_tables =utils.exec_create_tables
const drop_tables = utils.drop_tables


tap.plan(3)

tap.test('get_trip_request function exists',function (t) {
    t.plan(1)
    t.ok(get_classifications,'get classifications fn exists')
    t.end()
})

const test_query = async (_config,pool) => {


    await tap.test('run query without client',async function(t) {
        let config = Object.assign({},_config)
        t.plan(1)
        try{
            await get_classifications(config)
            t.fail('should not succeed without client')
            t.end()
        }catch (query_error){
            t.match(query_error,/client required/,'should fail query without client passed in')
            t.end()
        }
    })

    let client = await pool.connect()
    await client.query("BEGIN;")
    try {
        await tap.test('run with client',async function(t){
            let config = Object.assign({},_config)
            let planned_tests = 4
            t.plan(planned_tests)
            const task = await get_classifications(config,client)
            t.ok(task.classifications,'there is a classifications object')
            t.is(task.classifications.size,300
                 ,'got expected number of map entries')

            const classifications_map = task.classifications
            classifications_map.forEach( (value,sig_id) => {
                let value_keys = Object.keys(value)

                t.same(['sig_id','detstaid','lane','lane_dir','timestamp_full','vehicle_count','bc_name','bc_id','bc_group','bcg_id'],value_keys
                       ,'map has expected entries')
                return null
            })
            t.end()

            return null
        })
    }catch (e){
        throw (e)
    }finally{
        await client.query("ROLLBACK;")
        await client.release()
    }
    return null
}

let pool

config_okay(config_file)

    .then( async (config) => {
        // add the database name for pool
        config.postgresql.db = config.postgresql.signatures_db
        try {
            pool = await get_pool(config)

            const tables = await create_tables(config)
            // console.log('tables are ', tables)

            // await test_query(config,pool)

            const client = await pool.connect()
            try{
                await drop_tables(client)
            }catch(e){
                console.log('drop failed',e)
                throw e
            }finally{
                client.release()
            }

        }catch(e){
            console.log('handling error',e)
        }finally{
            await pool.end()
            tap.end()
        }
    })
    .catch(async (err) =>{
        console.log('external catch statement triggered')
        console.log(err)
        throw new Error(err)
    })
