import Koa from "koa";
import logger from "koa-logger";
import bodyParser from "koa-body";
import cors from "@koa/cors";

// Local Imports
import basicRouter from "./routes/basic-routes";
import usersRouter from "./routes/users-routes";
import privilegesRouter from "./routes/privileges-routes";

// Initialize app
const app = new Koa();
app.use( logger() );
app.use( bodyParser() );
app.use( cors() );

// Initialize Routes
app.use( basicRouter.routes() );
app.use( basicRouter.allowedMethods() );
app.use( usersRouter.routes() );
app.use( usersRouter.allowedMethods() );
app.use( privilegesRouter.routes() );
app.use( privilegesRouter.allowedMethods() );

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