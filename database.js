import mysql from "promise-mysql";

import { config, queries, defaultValues, } from "./config/database-config";

let connectionPool;
async function pool() {
    if ( !connectionPool ) {
        connectionPool = await mysql.createPool( config );
    }
    return connectionPool;
}

let queryDatabase = async ( conn, query, params ) => {
    try {
        let result = await conn.query( query, [ params, ] );
        // console.debug( result);
        return result;
    } catch ( error ) {
        console.error( `Couldn't execute query: ${ error.sql }` );
        console.error( `Got this message from the DB: ${ error.sqlMessage }` );
    }
};

let populateTables = async ( conn ) => {
    await Promise.all( [
        queryDatabase( conn, queries.populatePrivileges, defaultValues.privileges ),
        queryDatabase( conn, queries.populateUsers, defaultValues.users ),
    ] );
    console.info( "Users and Privileges tables now populated with defaults" );

    await queryDatabase( conn, queries.addPrivileges, defaultValues.usersPrivileges );
    console.info( "Privileges-Users relations table populated with defaults" );
};

let createTables = async conn => {
    await Promise.all( [
        queryDatabase( conn, queries.createPrivilegesTable ),
        queryDatabase( conn, queries.createUsersTable ),
    ] );
    console.info( "Users and Privileges tables created" );

    await queryDatabase( conn, queries.createUsersPrivilegesTable );
    console.info( "Privileges-Users relations table created" );
};

let dropAndRecreateDatabase = async ( conn ) => {
    await queryDatabase( conn, queries.dropDatabase );
    console.info( `${ config.database } database dropped` );
    await queryDatabase( conn, queries.createDatabase );
    console.info( `${ config.database } database created` );
    // await conn.query( `USE ${ config.database }` );
};

let initializeTables = async () => {
    let conn = await pool();
    await createTables( conn );
    populateTables( conn );
};

let initializeDatabase = async () => {
    let databaseConfig = {
        host: config.host,
        user: config.user,
        password: config.password,
    };
    let conn = await mysql.createConnection( databaseConfig );
    await dropAndRecreateDatabase( conn );
    conn.end();

    conn = await pool();
    initializeTables( conn );
};

initializeDatabase();

module.exports = {
    initializeDatabase: initializeDatabase,
    pool: pool,
};