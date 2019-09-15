import Router from "koa-router";

const router = new Router();

router.get( "/", async ctx => {
    ctx.body = "Hello World";
} );

router.get( "/someErrorOnTheServer", async ctx => {
    ctx.body = "Going to throw an error";
    throw SyntaxError( "There is something wrong with your syntax" );
} );

export default router;