import { pool, } from "../database";
import { queries, } from "../config/database-config";

class UsersController {
    async queryDatabase( ctx, query, params, single = false ) {
        try {
            let conn = await pool();
            let result = await conn.query( query, params );
            if ( single && result[ 0 ] ) {
                ctx.body = result[ 0 ];
            }
            else {
                ctx.body = result;
            }
            // console.debug( result );
        } catch ( error ) {
            console.error( error );
            ctx.throw( 400, "INVALID_DATA" );
        }
    }

    async index( ctx ) {
        // const query = "SELECT * FROM users";
        const query = queries.getUsersPrivileges;
        await this.queryDatabase( ctx, query );
    }

    async create( ctx ) {
        const request = ctx.request.body;
        if ( !request.name || !request.desc ) { ctx.throw( 400, "INVALID_DATA" ); }

        const query = "INSERT INTO users (name, description) VALUES ?";
        const values = [ [ request.name, request.desc, ], ];
        await this.queryDatabase( ctx, query, [ values, ] );
    }

    async read( ctx ) {
        const params = ctx.params;
        console.debug( params );
        if ( !params.id ) { ctx.throw( 400, "INVALID_DATA" ); }

        let query = "SELECT * FROM users WHERE id = ?";
        if ( parseInt( params.privileges ) ) {
            query = [
                "SELECT U.id, U.name, GROUP_CONCAT(P.privilege) privileges, U.description",
                "FROM users U, privileges P, users_privileges inter",
                "WHERE U.id = ? AND U.id = inter.user_id AND P.id = inter.privilege_id",
                "GROUP BY U.id, U.name, U.description",
            ].join( " " );
        }
        await this.queryDatabase( ctx, query, [ params.id, ], true );
    }

    async update( ctx ) {
        const params = ctx.params;
        const request = ctx.request.body;
        // console.debug( ctx.request.body );

        if ( !params.id || ( !request.desc && !request.name ) ) {
            ctx.throw( 400, "INVALID_DATA" );
        }
        const updateClause = [];
        const updateValues = [];
        if ( request.description ) {
            updateClause.push( "description = ?" );
            updateValues.push( request.description );
        }
        if ( request.name ) {
            if ( updateClause.length > 0 ) { updateClause.push( "," ); }
            updateClause.push( "name = ?" );
            updateValues.push( request.name );
        }
        updateValues.push( params.id );
        const query = `UPDATE users SET ${ updateClause.join( " " ) } WHERE id = ?`;
        console.info( query );
        console.info( updateValues );
        await this.queryDatabase( ctx, query, updateValues );
    }

    async delete( ctx, table, id ) {
        const tableName = table || "users";
        const idColumn = id || "id";
        const params = ctx.params;
        if ( !params.id ) { ctx.throw( 400, "INVALID_DATA" ); }

        const query = `DELETE FROM ${ tableName } WHERE ${ idColumn } = ?`;
        await this.queryDatabase( ctx, query, [ params.id, ] );
    }

    async updatePrivileges( ctx ) {
        const params = ctx.params;
        const request = ctx.request.body;
        if ( !params.id ) { ctx.throw( 400, "INVALID_DATA" ); }
        if ( !Array.isArray( request.priv ) ) {
            ctx.throw( 400, "INVALID_DATA: Privileges should be an Array" );
        }

        await this.delete( ctx, "users_privileges", "user_id" );

        const insertQuery = "INSERT INTO users_privileges (user_id, privilege_id) VALUES ?";
        const values = [ request.priv.map( privId => [ params.id, privId, ] ), ];
        await this.queryDatabase( ctx, insertQuery, values );
    }
}

export default UsersController;