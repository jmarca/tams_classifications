var exec = require('child_process').exec
const datafile_dir = process.cwd()+'/sql/'
const classifications_file = datafile_dir+'classifications_signatures.sql'
const body_class_file = datafile_dir+'lookups.vds_body_class_lookup_data.sql'



function cleanup_db(config){
    const psql_opts = config.postgresql
    const host = psql_opts.host
    const user = psql_opts.username
    // const pass = psql_opts.password
    const port = psql_opts.port
    const db   = psql_opts.db
    const cleanups = [
        "'drop schema if exists archive cascade;'"
        ,"'create schema archive;'"
        ,"'drop table if exists public.vds_body_classification_predictions;'"
        ,"'drop table if exists lookups.vds_body_class_lookup;'"
    ]
    const commandlines = cleanups.map( s =>{
        ["/usr/bin/psql",
         "-d", db,
         "-U", user,
         "-h", host,
         "-p", port,
         "-c", s].join(' ')
    })
    return Promise.all(commandlines.map(c =>{
        console.log(c)
        return new Promise((resolve, reject)=>{
            exec(c,function(e,stdout,stderr){
                if(e){
                    reject(e)
                }
                resolve([stdout,stderr])
                return null
            })
            return null
        })
    }))

}

function exec_create_archive_table(tablename,file,config){
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
    return new Promise(function (resolve, reject) {
        let commandline = ["/usr/bin/psql",
          "-d", db,
          "-U", user,
          "-h", host,
          "-p", port,
          "-c", create_statement]
        // console.log(commandline)

        exec(commandline.join(' '),function(e,out,err){
            //console.log('done create statement',out,err)
            if(e !== null){
                reject(e)
            }
            resolve(tablename)
        })
        return null
    }).then(function(t){
        //console.log('done creating with ',t)
        return new Promise(function(resolve,reject){
            let commandline = ["/usr/bin/psql",
          "-d", db,
          "-U", user,
          "-h", host,
          "-p", port,
          "-c", populate_statement]
            // console.log(commandline)

            exec(commandline.join(' '),function(e,out,err){
                //console.log('done populate statement')
                if(e !== null){
                    reject(e)
                }
                resolve(tablename)
            })
            return null
        })
    }).catch( e =>{
        console.log('oops',e)
        throw e
    })

}


function create_archive_tables(config){
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



function exec_lookups_body_class_table(config){
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

function exec_create_tables(config){
    const psql_opts = config.postgresql
    const host = psql_opts.host
    const user = psql_opts.username
    // const pass = psql_opts.password
    const port = psql_opts.port
    const db   = psql_opts.db

    const archives_creation = create_archive_tables(config)
    const lookups_creation = exec_lookups_body_class_table(config)

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
    //console.log(populate_statement)
    const commandline = ["/usr/bin/psql",
                                "-d", db,
                                "-U", user,
                                "-h", host,
                         "-p", port]
    const create_commandline = commandline.join(' ')+" -c "+ create_statement
    const popu_commandline = commandline.join(' ')+" -c "+ populate_statement

    const classifications_creation =
          new Promise(function (resolve, reject) {
              // console.log('creating',create_commandline)
              exec(create_commandline,function(e,out,err){
                  // console.log('done creating')
                  if(e !== null){
                      reject(e)
                  }
                  resolve('create classif')
              })
              return null
          }).then(function(t){
              return new Promise(function(resolve,reject){
                  // console.log('created, now populating',popu_commandline)
                  exec(popu_commandline,function(e,out,err){
                      // console.log('done populating')
                      if(e !== null){
                          reject(e)
                      }
                      resolve('populate classif')
                  })
                  return null
              })
          }).catch( e =>{
              console.log('oops',e)
              throw e
          })
    return Promise.all([classifications_creation,
                        lookups_creation,
                        archives_creation])
        .then(r =>{
            //console.log('done create, populate')
        })

}

function drop_tables(client){
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


function clean_then_create(config){
    return cleanup_db(config)
        .then(function(r){
            //console.log('I cleaned',r)
            return exec_create_tables(config)
        })
        .catch(function(e){
            if(e) console.log(e)
        })
}

exports.exec_create_tables = clean_then_create
exports.drop_tables = drop_tables
