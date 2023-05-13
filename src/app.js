const express = require( "express" );

const bcrypt = require( "bcryptjs" );

const app = express();

const path = require( "path" );

const hbs = require( "hbs" );

require( "./db/conn.js" );

const Register = require( "./models/registers.js" );

const port = process.env.PORT || 3000;

const static_path = path.join( __dirname, "../public" );
const template_path = path.join( __dirname, "../templates/views" );
const partials_path = path.join( __dirname, "../templates/partials" );

app.use( express.json() );
app.use( express.urlencoded( { extended: false } ) );

app.use( express.static( static_path ) );

app.set( "view engine", "hbs" );

app.set( "views", template_path );

hbs.registerPartials( partials_path );


app.get( "/", ( req, res ) =>
{
    res.render( "index" )
} );

app.get( "/register", ( req, res ) =>
{
    res.render( "register" );
} );


app.post( "/register", async ( req, res ) =>
{
    try
    {

        const password = req.body.password;

        const cpassword = req.body.confirmpassword;

        if ( password === cpassword )
        {
            const registerEmployee = new Register( {

                fullname: req.body.fullname,
                username: req.body.username,
                email: req.body.email,
                gender: req.body.gender,
                phonenumber: req.body.phonenumber,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword
            } )




            const registered = await registerEmployee.save();

            res.status( 201 ).render( "login" );

        } else
        {
            res.send( "Passwords are not matching" )
        }


    } catch ( error )
    {

        res.status( 400 ).send( error );

    }
} );

app.get( "/login", ( req, res ) =>
{
    res.render( "login" );
} )




app.post( "/login", async ( req, res ) =>
{

    try
    {
        const email = req.body.email;
        const password = req.body.password;



        const useremail = await Register.findOne( { email: email } );


        const isMatch = bcrypt.compare( password, useremail.password );

        if ( isMatch )
        {
            res.status( 201 ).render( "personelhome" );
        } else
        {
            res.send( "Invalid login details " );
        }


    } catch ( error )
    {
        res.status( 400 ).send( "Invalid Email" )
    }
} )

app.listen( port, () =>
{
    console.log( `server is running on port ${ port }` )
} );