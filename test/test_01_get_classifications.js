const get_classifications = require('../lib/get_classifications').get_classifications
const get_pool = require('psql_pooler').get_pool
const get_tables = require('tams_archive_tables').get_tables

const tap = require('tap')

const path    = require('path')
const rootdir = path.normalize(__dirname)

const config_file = rootdir+'/../test.config.json'
const config_okay = require('config_okay')

const utils =  require('./utils.js')
const create_tables =utils.exec_create_tables
const drop_tables = utils.drop_tables


tap.plan(4)

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
    const task = await get_tables(_config,client)

    try {
        await tap.test('run with client',async function(t){
            // handle the detectors
            let taskarray = Array.from(task.signaturearchives)

            task.signaturearchives.forEach( (tables_map,detectorid)=>{
                // tables_map is a map of tables
                // console.log(detectorid,tables_map)
                //if(detectorid != 6002) return null
                t.test('detector id subtest',async (tt) =>{
                    const test_promises = []
                    tables_map.forEach( (value,key)=>{
                        const cf = Object.assign({},_config)
                        cf.signaturearchives={'archive_table':key
                                              ,'starttime':value.mintime
                                              ,'endtime':value.maxtime}
                        cf.detstaid = detectorid
                        test_promises.push( get_classifications(cf,client) )
                        return null
                    })

                    return Promise.all(test_promises)
                        .then( results =>{
                            let collate = new Map()
                            if(results.length > 1){
                                // concatentate
                                results.forEach( r => {
                                    collate = new Map ( Array.from(collate)
                                                        .concat(Array.from(r.classification)) )
                                    return null
                                })
                            }else{
                                collate = results[0].classification
                            }
                            return collate
                        })
                        .then( collated =>{
                            tt.ok(collated.size > 0,'there is something there')
                            const expected_size = detectorid == 6002 ? 20 : 10
                            tt.is(collated.size,expected_size,'got expected number of classification results')
                            // console.log(collated)
                            return tt.end()
                        })
                        .catch( e =>{
                            console.log('some sort of error ',e)
                            throw e
                        })
                })
                return null

            })
            //console.log('do I need promise.all here?')
            t.end()

            return null
        })
    }catch (e){
        throw (e)
    }finally{
        await client.query("ROLLBACK;")
        await client.release()
    }

    // now just do one detector, 6002
    client = await pool.connect()
    await client.query("BEGIN;")
    // use the same task result from get tables as before

    try {
        await tap.test('just one detector now',async function(t){
            const detstaid = 6002
            const dmap = task.signaturearchives.get(detstaid)
            const test_promises = []
            dmap.forEach( (value,key)=>{
                const cf = Object.assign({},_config)
                // this time do not do starttime, endtime
                cf.signaturearchives={'archive_table':key}
                cf.detstaid = detstaid
                test_promises.push( get_classifications(cf,client) )
                return null
            })
            return Promise.all(test_promises)
                .then( results =>{
                    let collate = new Map()
                    if(results.length > 1){
                        // concatentate
                        results.forEach( r => {
                            collate = new Map ( Array.from(collate)
                                                .concat(Array.from(r.classification)) )
                            return null
                        })
                    }else{
                        collate = results[0].classification
                    }
                    return collate
                })
                .then( collated =>{
                    t.ok(collated.size > 0,'there is something there')
                    const expected_size = 20
                    t.is(collated.size,expected_size,'got expected number of classification results')
                    // console.log(collated)
                    const expected_keys =
                          ['sig_id'
                           ,'detstaid'
                           ,'lane'
                           ,'lane_dir'
                           ,'timestamp_full'
                           ,'vehicle_count'
                           ,'bc_name'
                           ,'bc_id'
                           ,'bc_group'
                           ,'bcg_id'].sort()

                    collated.forEach( (v,k)=>{
                        t.same((Object.keys(v)).sort(),expected_keys
                               ,'got expected keys for entry')
                        return null
                    })
                    t.end()
                })

                .catch( e =>{
                    console.log('some sort of error ',e)
                    throw e
                })
        })
    }
    catch (e){
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
            // console.log('got tables')
            await test_query(config,pool)
            // console.log('moving on')
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
