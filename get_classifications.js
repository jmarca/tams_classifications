const mylib = require('.')
const pipe_coarse_classifications = mylib.pipe_coarse_classifications
const classifier = require('./lib/classifier.js')
const get_pool = require('psql_pooler').get_pool

const stringify = require('csv-stringify')
const JSONStream = require('JSONStream')

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
const fs = require('fs')
// const readFile = denodeify(fs.readFile);
// const writeFile = denodeify(fs.readFile);

const config_file = rootdir+'/'+commander.config
const config_okay = require('config_okay')
const output_path = rootdir+'/'+commander.directory

// console.log(config_file)

let pool
const through = require('through2')


async function inner_loop(value,key,detectorid,config){
    console.log(Date.now()+': got client for table: '+key+', detector id: '+detectorid)

    const cf = Object.assign({},config)
    cf.signaturearchives={'archive_table':key}
    // ,'starttime':value.mintime
    // ,'endtime':value.maxtime}
    cf.detstaid = detectorid
    const filename = output_path+'/'
          + detectorid
          +'_'+value.mintime
          +'_'+value.maxtime
          +'.csv'
    const qclient = await pool.connect()
    const output = fs.createWriteStream(filename)
    return new Promise(function(resolve,reject){
        var stream = pipe_coarse_classifications(cf,qclient)
        stream.on('end', ()=>{
            console.log('end stream')
            qclient.release()
            })
                .pipe(through.obj(function(chunk,enc,cb){
                    const dump = d3csv.csvFormatRows([chunk]) + '\n'
                    cb(null,dump)
                }))
                .pipe(output)
                .on('finish',()=>{
                    console.log('finish stream, '+Date.now()+': done query for table: '+key+', detector id: '+detectorid)
                    resolve(filename)
                })

    })
}

async function loop (tables_map, detectorid, config){
    // console.log(tables_map.size)
    const jobs = []


    try{
        for (const key of tables_map.keys()) {
        const value = tables_map.get(key)

        const blah = await inner_loop(value,key,detectorid,config)
        jobs.push(blah)
        }

    }catch(e){
        console.log('caught')
        throw e
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
