const config = {
    host: "localhost",
    user: "koa",
    password: "skeleton",
    database: "koa_skeleton",
};

const queries = {
    dropDatabase: `DROP DATABASE ${ config.database }`,
    createDatabase: `CREATE DATABASE ${ config.database }`,
    createPrivilegesTable: [
        "CREATE TABLE IF NOT EXISTS privileges",
        "(id INT AUTO_INCREMENT PRIMARY KEY,",
        "privilege VARCHAR(255) UNIQUE)",
    ].join(" "),
    createUsersTable: [
        "CREATE TABLE IF NOT EXISTS users",
        "(id INT AUTO_INCREMENT PRIMARY KEY,",
        "name VARCHAR(255) UNIQUE, description VARCHAR(255))",
    ].join(" "),
    createUsersPrivilegesTable: [
        "CREATE TABLE IF NOT EXISTS users_privileges",
        "(user_id INT NOT NULL,",
        "privilege_id INT NOT NULL,",
        "FOREIGN KEY (user_id) REFERENCES users(id)",
        "ON DELETE CASCADE ON UPDATE CASCADE,",
        "FOREIGN KEY (privilege_id) REFERENCES privileges(id)",
        "ON DELETE CASCADE ON UPDATE CASCADE)",
    ].join(" "),
    populatePrivileges: "INSERT INTO privileges (privilege) VALUES ?",
    populateUsers: "INSERT INTO users (name, description) VALUES ?",
    addPrivileges: "INSERT INTO users_privileges (user_id, privilege_id) VALUES ?",
    getUsersPrivileges: [
        "SELECT U.id, U.name, GROUP_CONCAT(P.privilege) privileges, U.description",
        "FROM users U, privileges P, users_privileges inter",
        "WHERE U.id = inter.user_id AND P.id = inter.privilege_id",
        "GROUP BY U.id, U.name, U.description",
    ].join(" "),
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
    usersPrivileges: [
        [ 1, 7, ],
        [ 2, 1, ], [ 2, 2, ], [ 2, 4, ],
        [ 3, 1, ], [ 3, 2, ], [ 3, 4, ],
        [ 4, 1, ], [ 4, 2, ], [ 4, 4, ],
        [ 5, 4, ], [ 5, 5, ],
        [ 6, 1, ],
        [ 7, 2, ], [ 7, 3, ],
    ],
};
export default config;

module.exports = {
    config: config,
    queries: queries,
    defaultValues: defaultValues,
};