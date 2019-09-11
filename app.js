// app.js
const Koa = require( "koa" );
const Router = require( "koa-router" );
const logger = require( "koa-logger" );

const app = new Koa();
app.use( logger() );

const router = new Router();
router.get( "/", async ctx => {
    ctx.body = "Hello World";
} );
router.get( "/someErrorOnTheServer", async ctx => {
    ctx.body = "Hello World";
    throw SyntaxError( "There is something wrong with your syntax" );
} );

app.use( router.routes() );
app.use( router.allowedMethods() );

app.use( async ( ctx, next ) => {
    try {
        await next();
    } catch ( err ) {
        ctx.status = err.status || 500;
        ctx.body = err.message;
        ctx.app.emit( "error", err, ctx );
    }
} );

const server = app.listen( 3000 );

module.exports = server;