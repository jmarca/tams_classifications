const exec = require('child_process').exec
const datafile_dir = process.cwd()+'/sql/'
const classifications_file = datafile_dir+'classifications_signatures.sql'
const body_class_file = datafile_dir+'lookups.vds_body_class_lookup_data.sql'


async function command(c,config){
    const psql_opts = config.postgresql
    const host = psql_opts.host
    const user = psql_opts.username
    // const pass = psql_opts.password
    const port = psql_opts.port
    const db   = psql_opts.db
    return new Promise((resolve, reject)=>{
        const commandline =  ["/usr/bin/psql",
                              "-d", db,
                              "-U", user,
                              "-h", host,
                              "-p", port,
                              "-c", c ].join(' ')
        exec(commandline,function(e,stdout,stderr){
            if(e){
                reject(e)
            }
            resolve([stdout,stderr])
            return null
        })
        return null
    })

}

async function cleanup_db(config){
    await command("'drop schema if exists archive cascade;'",config)
    await command("'create schema archive;'",config)
    await command("'drop table if exists public.vds_body_classification_predictions;'",config)
    await command("'drop table if exists lookups.vds_body_class_lookup;'",config)

    return null
}

async function exec_create_archive_table(tablename,file,config){
    const psql_opts = config.postgresql
    const host = psql_opts.host
    const user = psql_opts.username
    // const pass = psql_opts.password
    const port = psql_opts.port
    const db   = psql_opts.db


    const create_statement = `\
    'CREATE TABLE archive.${tablename} (  \
       id integer NOT NULL,\
       detstaid integer NOT NULL,\
       dettype smallint,\
       lane smallint NOT NULL,\
       lane_dir smallint NOT NULL,\
       "timestamp" integer,\
       timestamp_sys integer,\
       timestamp_full timestamp without time zone NOT NULL,\
       samples smallint,\
       vehicle_count integer,\
       duration double precision,\
       reserved smallint,\
       psr double precision[],\
       interpsig integer[],\
       rawsig integer[],\
       n_sample_count bigint[],\
       PRIMARY KEY (id, detstaid, lane_dir, lane, timestamp_full)\
    );'`
    const populate_statement = "'\\\copy archive."+tablename+" from '"+file+"';'"
    // console.log(populate_statement)
    const create_s = await command(create_statement,config)
    const pop_s = await command(populate_statement,config)

    return tablename
}


async function create_archive_tables(config){
    let names = ['signaturearchive_1'
                 ,'signaturearchive_2'
                 ,'signaturearchive_3'
                 ,'signaturearchive_4'
                ]
    return Promise.all(names.map( (name) =>{
        let filename = datafile_dir+name+'.sql'
        return exec_create_archive_table(name,filename,config)
    })
                      )
}



async function exec_lookups_body_class_table(config){
    const psql_opts = config.postgresql
    const host = psql_opts.host
    const user = psql_opts.username
    // const pass = psql_opts.password
    const port = psql_opts.port
    const db   = psql_opts.db
    const commandline = ["/usr/bin/psql",
                       "-d", db,
                       "-U", user,
                       "-h", host,
                       "-p", port,
                       "-f", body_class_file]
    return new Promise(function (resolve, reject) {
        exec(commandline.join(' '),function(e,out,err){
            //console.log('done create statement',out,err)
            if(e !== null){
                reject(e)
            }
            resolve('body_class_file')
        })
        return null
    })
}

async function exec_create_tables(config){

    const archives_creation = await create_archive_tables(config)
    const lookups_creation = await exec_lookups_body_class_table(config)

    const create_statement = `\
    'CREATE TABLE public.vds_body_classification_predictions (\
       sig_id integer NOT NULL,\
       final_prediction integer,\
       model1 integer,\
       model2 integer,\
       model3 integer,\
       model4 integer,\
       model5 integer,\
       PRIMARY KEY (sig_id)\
    );'`

    const populate_statement = "'\\\copy public.vds_body_classification_predictions from '"+classifications_file+"';'"

    const create_commandline = await command(create_statement,config)
    const popu_commandline = await command(populate_statement,config)

    return null

}

async function drop_tables(client){
    const tables = ['archive.signaturearchive_1'
                    ,'archive.signaturearchive_2'
                    ,'archive.signaturearchive_3'
                    ,'archive.signaturearchive_4'
                    ,'public.vds_body_classification_predictions'
                    ,'lookups.vds_body_class_lookup'
                   ]
    return Promise.all(tables.map(table =>{
        return client.query('drop table '+table+' cascade;')
    })
                      )
        //.then(results =>{console.log('done dropping')})
        .catch( e =>{
            console.log('error deleting tables',e)
            throw e
        })
}


async function clean_then_create(config){
    await cleanup_db(config)
    return exec_create_tables(config)

        .catch(function(e){
            if(e) console.log(e)
        })
}

exports.exec_create_tables = clean_then_create
exports.drop_tables = drop_tables
