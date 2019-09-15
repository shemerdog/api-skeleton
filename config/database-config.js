// const HOST = "localhost";
// const USER = "koa";
// const PASS = "skeleton";
// const DB_NAME = "koa_skeleton";
// let db;

// async function connectToDatabase() {
//     db = await mysql.createPool( {
//         host: HOST,
//         user: USER,
//         password: PASS,
//         database: DB_NAME,
//     } );
//     console.info( "Database Connected!" );
// }

// module.exports = {
//     connectToDatabase: connectToDatabase,
//     db: db,
// };
const config = {
    host: "localhost",
    user: "koa",
    password: "skeleton",
    database: "koa_skeleton",
};

const queries = {
    dropDatabase: `DROP DATABASE ${ config.database }`,
    createDatabase: `CREATE DATABASE ${ config.database }`,
    createPrivilegesTable: "CREATE TABLE IF NOT EXISTS privileges (id INT AUTO_INCREMENT PRIMARY KEY, privilege VARCHAR(255) UNIQUE)",
    createUsersTable: "CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) UNIQUE, description VARCHAR(255))",
    populatePrivileges: "INSERT INTO privileges (privilege) VALUES ?",
    populateUsers: "INSERT INTO users (name, description) VALUES ?",
};

const defaultValues = {
    privileges: [
        [ "ViewData", ],
        [ "ViewUsers", ],
        [ "ManageUsers", ],
        [ "ViewRoles", ],
        [ "ManageRoles", ],
        [ "ConfigureSystem", ],
        [ "ViewConfigureSystem", ],
    ],
    users: [
        [ "Admin", "SysAdmin", ],
        [ "Viewer1", "Read only", ],
        [ "Viewer2", "Read only", ],
        [ "Viewer3", "", ],
        [ "RolesHandler", "Limited to roles", ],
        [ "DataObserver", "", ],
        [ "SuperUser", "", ],
    ],
};
export default config;

module.exports = {
    config: config,
    queries: queries,
    defaultValues: defaultValues,
};