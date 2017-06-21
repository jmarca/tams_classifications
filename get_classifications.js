const mylib = require('.')
const get_coarse_classifications = mylib.get_coarse_classifications
const get_pool = require('psql_pooler').get_pool
const archive_tables = require('tams_archive_tables')
const get_tables = archive_tables.get_tables
const get_tables_for_detector = archive_tables.get_tables_for_detector

const rw = require("rw").dash
const commander = require("commander")
const d3csv = require('d3-dsv')
const csvFormat = d3csv.csvFormat
const csvFormatRows = d3csv.csvFormatRows

const path    = require('path')
const rootdir = path.normalize(__dirname)


commander
    .version(require("./package.json").version)
    .usage("[options] [file]")
    .option("-o, --out <file>", "output file name; defaults to “-” for stdout", "-")
    .option("--input-encoding <encoding>", "input character encoding; defaults to “utf8”", "utf8")
    .option("--output-encoding <encoding>", "output character encoding; defaults to “utf8”", "utf8")
    .option("--config <file>","configuration file to use; defaults to config.json")
    .option("--directory <dir>","output directory for files, defaults to data","data")
    .parse(process.argv);


// const denodeify = require('denodeify')
// const fs = require('fs')
// const readFile = denodeify(fs.readFile);
// const writeFile = denodeify(fs.readFile);

const config_file = rootdir+'/'+commander.config
const config_okay = require('config_okay')
const output_path = rootdir+'/'+commander.directory

let pool
const keys = [
    'sig_id'
    ,'detstaid'
    ,'lane'
    ,'lane_dir'
    ,'timestamp_full'
    ,'vehicle_count'
    ,'bc_name'
    ,'bc_id'
    ,'bc_group'
    ,'bcg_id'
    ,'calvad_class'
]

config_okay(config_file)

    .then( async (config) => {
        // add the database name for pool
        config.postgresql.db = config.postgresql.signatures_db

        try {
            pool = await get_pool(config)

            const client = await pool.connect()
            let task
            if(config.detstaid !== undefined){
                task = await get_tables_for_detector(config,client)
            }else{
                task = await get_tables(config,client)
            }
            // console.log(task)
            client.release()
            const test_promises = []
            task.signaturearchives.forEach( (tables_map,detectorid)=>{
                tables_map.forEach( async (value,key)=>{
                    const qclient = await pool.connect()

                    const cf = Object.assign({},config)
                    cf.signaturearchives={'archive_table':key
                                          ,'starttime':value.mintime
                                          ,'endtime':value.maxtime}
                    cf.detstaid = detectorid
                    const r = await get_coarse_classifications(cf,qclient)
                    qclient.release()
                    // console.log(r)
                    const classification = r.classification
                    var dumpArray = [keys]

                    classification.forEach( (v,k) =>{

                        const recArray = keys.map(function(key,i) {
                            //console.log(key,v[key])
                            return v[key]
                        })
                        dumpArray = dumpArray.concat([recArray])
                        return null
                    })
                    // console.log('dumparray is ',dumpArray)
                    test_promises.push(
                        new Promise( (resolve,reject) => {
                            rw.writeFile(output_path+'/'+ detectorid+'_'+value.mintime+'_'+value.maxtime+'.json'
                                         ,d3csv.csvFormatRows(dumpArray)
                                         ,function(e){
                                             if(e) return reject(e)
                                             return resolve()
                                         }
                                        )
                        }).catch( async (e) => {
                            console.log('caught promise error?',e)
                            await pool.end()
                            throw (e)
                        })
                    )
                    return null
                })
                return null
            })


            Promise.all(test_promises)
                .then( r => {
                    // console.log('done writing')
                    return null
                })
                .catch( e => {
                    console.log('error writing')
                    console.log(e)
                })

        }catch(e){
            console.log('handling error',e)
        }finally{
            await pool.end()
        }
        return null
    })
    .catch( (err) =>{
        console.log('external catch statement triggered')
        console.log(err)
        throw new Error(err)
    })
