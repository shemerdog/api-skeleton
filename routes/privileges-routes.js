import Router from "koa-router";

import PrivilegesController from "../controllers/privileges-controller";

const router = new Router();

const privilegesController = new PrivilegesController();

router.get( "/api/privileges", async ctx => {
    await privilegesController.index( ctx );
} );

router.post( "/api/privileges", async ctx => {
    await privilegesController.create( ctx );
} );

router.get( "/api/privileges/:id", async ctx => {
    await privilegesController.read( ctx );
} );

router.put( "/api/privileges/:id", async ctx => {
    await privilegesController.update( ctx );
} );

router.delete( "/api/privileges/:id", async ctx => {
    await privilegesController.delete( ctx );
} );

export default router;