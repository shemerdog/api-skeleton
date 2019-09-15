import mysql from "promise-mysql";

import { config, queries, defaultValues, } from "./config/database-config";

let connectionPool;
async function pool() {
    if ( !connectionPool ) {
        connectionPool = await mysql.createPool( config );
    }
    return connectionPool;
}

let queryDatabase = async ( query, params ) => {
    try {
        let conn = await pool();
        await conn.query( query, params );
        let result = await conn.query( query, params );
        // console.debug( result);
        return result;
    } catch ( error ) {
        console.error( `Couldn't execute query: ${ error.sql }` );
        console.error( `Got this message from the DB: ${ error.sqlMessage }` );
    }
};

let populateTable = async ( query, values ) => {
    try {
        let result = await queryDatabase( query, [ values, ] );
        console.info( `Table populated. ${ result.affectedRows } records inserted` );
    } catch ( error ) {
        console.error( `Error: ${ error }` );
    }
};

let createAndPopulateTables = async () => {
    if ( await queryDatabase( queries.createPrivilegesTable ) ) {
        console.info( "Privileges table created" );
    }
    
    if ( await queryDatabase( queries.createUsersTable ) ) {
        console.info( "Users table created" );
    }
    populateTable( queries.populatePrivileges, defaultValues.privileges );
    populateTable( queries.populateUsers, defaultValues.users );
};

let initializeDatabase = async () => {
    let databaseName = config.database;
    delete config.database;
    let conn = await mysql.createConnection( config );
    try {
        await conn.query( queries.dropDatabase );
        console.info( `${ databaseName } database dropped` );

    } catch ( error ) {
        console.error( `Couldn't execute query: ${ error.sql }` );
        console.error( `Got this message from the DB: ${ error.sqlMessage }` );
    }
    await conn.query( queries.createDatabase );
    console.info( `${ databaseName } database created` );

    config.database = databaseName;
    await conn.query( `USE ${ config.database }` );
    await createAndPopulateTables();

};

module.exports = {
    initializeDatabase: initializeDatabase,
    pool: pool,
};