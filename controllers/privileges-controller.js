import { pool, } from "../database";

class PrivilegesController {
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
        const query = "SELECT * FROM privileges";
        await this.queryDatabase( ctx, query );
    }

    async create( ctx ) {
        const request = ctx.request.body;
        if ( !request.name || !request.desc ) { ctx.throw( 400, "INVALID_DATA" ); }

        const query = "INSERT INTO privileges (privilege) VALUES ?";
        const values = [ [ request.name, request.desc, ], ];
        await this.queryDatabase( ctx, query, [ values, ] );
    }

    async read( ctx ) {
        const params = ctx.params;
        if ( !params.id ) { ctx.throw( 400, "INVALID_DATA" ); }

        const query = "SELECT * FROM privileges WHERE privilege = ?";
        await this.queryDatabase( ctx, query, [ params.id, ] );
    }

    async update( ctx ) {
        const params = ctx.params;
        const request = ctx.request.body;
        console.debug( ctx.request.body );

        //Make sure they've specified a username
        if ( !params.id || !request.priv ) { ctx.throw( 400, "INVALID_DATA" ); }

        const query = "UPDATE privileges SET privilege = ? WHERE privilege = ?";
        const privilege = request.priv;
        await this.queryDatabase( ctx, query, [ privilege, params.id, ] );
    }

    async delete( ctx ) {
        const params = ctx.params;
        if ( !params.id ) { ctx.throw( 400, "INVALID_DATA" ); }

        const query = "DELETE FROM privileges WHERE privilege = ?";
        await this.queryDatabase( ctx, query, [ params.id, ] );
    }
}

export default PrivilegesController;