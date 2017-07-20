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

const through = require('through2')

const done_detectors = [

  7005
,  27
,  4001
,  2
,  109
,  7010
,  10001
,  10007
,  1001
,  107
,  11005
,  11009
,  11011
,  12003
,  12004
,  12006
,  3001
,  3003
,  3006
,  3007
,  3008
,  3009
,  36
,  38
,  40
,  6002
,  4002
,  4003
,  4004
,  7011
,  4005
,  4006
,  4008
,  4009
,  4010
,  4011
,  46
,  50
,  5001
,  5002
,  7014
,  5003
,  5004
,  5005
,  5006
,  6005
,  6007
,  63
,  10003
,  7006
,  7007
,  7009
,  10005
,  10002
,  7012
,  11001
,  7013
,  11002
,  10006
,  7015
,  11003
,  11010
,  11007
,  7016
,  12002
,  7018
,  71
,  75
,  8001
,  8002
,  8003
,  8004
,  8005
,  8006
,  86
,  98
,  61
,  30
,  4007
,  3002
,  6001
,  6003
,  6004
,  10004
,  11006
,  7004
,  5
,  7
,  106
,  37
,  6006
,  12001
,  7001
,  113
,  62
,  112
,  454
,  7003
,  7002
,  7008
,  11004
,  6008
,  12005
,  11008
,  3004
,  3005
,  12007
,  7017
,  101
,  26070
,  30370
,  10734
,  25334
,  24934
,  29670
,  999

]
async function inner_loop(value,key,detectorid,config){
    console.log(Date.now()+': got client for table: '+key+', detector id: '+detectorid)

    if (done_detectors.indexOf(detectorid) > -1){
        return null
    }
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

    output.write(d3csv.csvFormatRows([keys])+'\n','utf8')
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

                console.log('outer loop, ',detectorid)
                if (done_detectors.indexOf(detectorid)===-1){


                    const tables_map = task.signaturearchives.get(detectorid)

                    const blarg = await loop(tables_map,detectorid,config)
                    console.log( blarg, 'outer loop is done for ',detectorid)
                }
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
