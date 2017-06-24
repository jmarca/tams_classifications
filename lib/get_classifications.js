const classifier = require('../lib/classifier.js')
const QueryStream = require('pg-query-stream')
const d3csv = require('d3-dsv')
const csvFormat = d3csv.csvFormat
const csvFormatRows = d3csv.csvFormatRows
const through = require('through2')


function query_gen(config){
    const tables_query =
          `select a.id as sig_id,detstaid,lane,lane_dir,
               timestamp_full::text as timestamp_full,vehicle_count,
               bcl.body_class_name as bc_name,
               bcl.body_class_id as bc_id,
               bcl.body_class_group as bc_group,
               bcl.body_class_group_id as bcg_id
           from archive.${config.signaturearchives.archive_table} a
           left outer join public.vds_body_classification_predictions p on (a.id=p.sig_id)
           left outer join lookups.vds_body_class_lookup bcl on (p.final_prediction=bcl.body_class_id) `
    let where_condition = ` where a.detstaid = ${config.detstaid}`

    if(config.signaturearchives.starttime !== undefined){
        where_condition =
            "where a.timestamp_full >= '"+config.signaturearchives.starttime
            + "'::timestamp without time zone "
            + " and a.timestamp_full <= '"+config.signaturearchives.endtime
            + "'::timestamp without time zone "
            + " and a.detstaid = "+config.detstaid
    }
    // console.log('querying with: '+(tables_query + ' '+ where_condition))
    return tables_query + ' ' + where_condition
}

async function get_classifications(config,client){
    if(!client || client === undefined){
        throw 'client required'
    }
    const tables_query = query_gen(config)
    const result = await client.query(tables_query)
    return result.rows
}

async function get_coarse_classifications(config,client){
    if(!client || client === undefined){
        throw 'client required'
    }

    const rows = await get_classifications(config,client)
    // now process classifications into heavy heavy, not, vehicicle

    rows.forEach( (r) => {
        r.calvad_class = classifier(r)
    })

    return rows
}


// pipe version


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

function pipe_coarse_classifications(config,client){

    const tables_query = query_gen(config)
    let query = new QueryStream(tables_query)
    //console.log(query)
    let stream = client.query(query)
    return stream.pipe(through.obj(function (chunk, enc, cb) {
        chunk.calvad_class = classifier(chunk)
        const arr = keys.map(function(key,i) {
            return chunk[key]
        })
        //const dump = d3csv.csvFormatRows(arr) + '\n'
        //console.log(arr)
        cb(null,arr)
    }))


}

exports.get_classifications = get_classifications
exports.get_coarse_classifications = get_coarse_classifications
exports.pipe_coarse_classifications = pipe_coarse_classifications
