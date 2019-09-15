const chai = require( "chai" );
const chaiHttp = require( "chai-http" );
const server = require( "../app" );
const expect = chai.expect;

chai.use( chaiHttp );

describe( "Basic routes", () => {
    after( () => {
        server.close();
    } );

    it( "should get HOME", done => {
        chai
            .request( server )
            .get( "/" )
            .end( ( err, res ) => {
                expect( res ).to.have.status( 200 );
                expect( res.text ).equal( "Hello World" );
                done();
            } );
    } );

    it( "should fail with error 404 - page not found", done => {
        chai
            .request( server )
            .get( "/someNonExistentPage" )
            .end( ( err, res ) => {
                expect( res ).to.have.status( 404 );
                done();
            } );
    } );

    it( "should fail with error 500", done => {
        chai
            .request( server )
            .get( "/someErrorOnTheServer" )
            .end( ( err, res ) => {
                expect( res ).to.have.status( 500 );
                done();
            } );
    } );
} );