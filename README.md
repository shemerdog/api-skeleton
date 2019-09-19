# api-skeleton
Web API Server skeleton using Koa

This branch is implementing MySql database (needed for some full-stack exercise project I was assigned)

Currently implementing 2 API paths - users & privileges
Both following the CRUD guiding.


* Koa was chosen for this project since I wanted to experience async\await and the Koa project intrigued my curiousity.
* For the same reasons I chose to use new import\export style using babel (which was required anyway for async\await)
* In many projects I'm using both jshint and jslint since each is giving different options for code design.
* Mocha was chosen for no particular reason and has only very basic implementation on simple routes at the moment.

The database is initialized and populated using the database.js file in the root directory - for easier development.
This is the db scheme:
* users
    * id (used as foreign key in users_privileges)
    * name
    * description

* privileges
    * id (used as foreign key in users_privileges)
    * privilege


* users_privileges
    * user_id -> fk from users table
    * privilege_id -> fk from privileges table


Simple read using the API retrieves the users table joined by translated privileges list using the many-to-many intermediate 'users_privileges' table.

Single Read, Update and Delete API calls requires ID as a parameter passed through query string - as a route

There are 2 different user Update functions - simply updating the users table, and updating privileges


Next tasks:
1. Adding tests
2. Improving and uniting user\privileges update
3. Editing CORS options to allow 'production' build
4. Making the database files more dynamic allowing easy db replacment