const classifier = require('../lib/classifier.js')

async function get_classifications(config,client){
    if(!client || client === undefined){
        throw 'client required'
    }

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
    const result = await client.query(tables_query + ' ' + where_condition)
    const rows = result.rows
    config.classification = new Map()
    rows.forEach( r => {
        config.classification.set(r.sig_id,r)
    })
    return config
}

async function get_coarse_classifications(config,client){
    if(!client || client === undefined){
        throw 'client required'
    }

    const task = await get_classifications(config,client)
    // now process classifications into heavy heavy, not, vehicicle

    // create a new map
    const all_classes = task.classification
    const limited_classes = new Map()
    all_classes.forEach( (v,k)=>{
        // console.log(v)
        let calvad_class = classifier(v)
        v.calvad_class = calvad_class
        // limited_classes.set(k,revised_v)
        return null
    })
    // config.classification = limited_classes
    return config
}

exports.get_classifications = get_classifications
exports.get_coarse_classifications = get_coarse_classifications
