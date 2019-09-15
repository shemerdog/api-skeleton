import { pool, } from "../database";

class UsersController {
    async queryDatabase( ctx, query, params ) {
        try {
            console.debug( pool );
            let conn = await pool();
            let result = await conn.query( query, params );
            ctx.body = result;
        } catch ( error ) {
            console.error( error );
            ctx.throw( 400, "INVALID_DATA" );
        }
    }

    async index( ctx ) {
        const query = "SELECT * FROM users";
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
        if ( !params.id ) { ctx.throw( 400, "INVALID_DATA" ); }

        const query = "SELECT * FROM users WHERE name = ?";
        await this.queryDatabase( ctx, query, [ params.id, ] );
    }

    async update( ctx ) {
        const params = ctx.params;
        const request = ctx.request.body;
        console.debug( ctx.request.body );

        //Make sure they've specified a username
        if ( !params.id || !request.desc ) { ctx.throw( 400, "INVALID_DATA" ); }

        const query = "UPDATE users SET description = ? WHERE name = ?";
        const description = request.desc;
        await this.queryDatabase( ctx, query, [ description, params.id, ] );
    }

    async delete( ctx ) {
        const params = ctx.params;
        if ( !params.id ) { ctx.throw( 400, "INVALID_DATA" ); }

        const query = "DELETE FROM users WHERE name = ?";
        await this.queryDatabase( ctx, query, [ params.id, ] );
    }
}

export default UsersController;