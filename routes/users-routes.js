import Router from "koa-router";

import UsersController from "../controllers/users-controller";

const router = new Router();

const usersController = new UsersController();

router.get( "/api/users", async ctx => {
    await usersController.index( ctx );
} );

router.post( "/api/users", async ctx => {
    await usersController.create( ctx );
} );

router.get( "/api/users/:id", async ctx => {
    await usersController.read( ctx );
} );

router.put( "/api/users/:id", async ctx => {
    await usersController.update( ctx );
} );

router.delete( "/api/users/:id", async ctx => {
    await usersController.delete( ctx );
} );

router.post( "/api/users/priv/:id", async ctx => {
    await usersController.updatePrivileges( ctx );
} );

export default router;