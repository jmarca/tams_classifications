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

// console.log(config_file)

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

function write_data(detectorid,value,dumpArray){
    return new Promise( (resolve,reject) => {
        const filename = output_path+'/'+ detectorid+'_'+value.mintime+'_'+value.maxtime+'.csv'
        rw.writeFile(filename
                     ,d3csv.csvFormatRows(dumpArray)
                     ,function(e){
                         if(e){
                             console.log(e)
                             return reject(e)
                         }
                         return resolve(filename)
                     }
                    )
    })
}

async function inner_loop(value,key,detectorid,config){
    const qclient = await pool.connect()
    console.log(Date.now()+': got client for table: '+key+', detector id: '+detectorid)

    const cf = Object.assign({},config)
    cf.signaturearchives={'archive_table':key}
    // ,'starttime':value.mintime
    // ,'endtime':value.maxtime}
    cf.detstaid = detectorid
    const r = await get_coarse_classifications(cf,qclient)
    qclient.release()
    console.log(Date.now()+': done query for table: '+key+', detector id: '+detectorid)
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
    //console.log('dumparray is ',dumpArray)

    const filename = await write_data(detectorid,value,dumpArray)
    return filename
}

async function loop (tables_map, detectorid, config){
    // console.log(tables_map.size)
    const jobs = []


    for (const key of tables_map.keys()) {
        const value = tables_map.get(key)

        const blah = await inner_loop(value,key,detectorid,config)
        jobs.push(blah)
    }

    return jobs


}

config_okay(config_file)

    .then( async (config) => {
        // add the database name for pool
        config.postgresql.db = config.postgresql.signatures_db
        // console.log(config)
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
            await client.release()
            const test_promises = []
            console.log('looping'+new Date())


            for (const detectorid of task.signaturearchives.keys()) {
                const tables_map = task.signaturearchives.get(detectorid)

                console.log('outer loop, ',detectorid)
                const blarg = await loop(tables_map,detectorid,config)
                console.log( blarg, 'outer loop is done for ',detectorid)
            }
            // await Promise.all(test_promises)
            console.log('done')

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
