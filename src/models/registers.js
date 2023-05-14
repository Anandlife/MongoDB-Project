const mongoose = require( "mongoose" );

const bcrypt = require( "bcryptjs" );

const jwt = require( "jsonwebtoken" );

const employeeSchema = new mongoose.Schema( {

    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phonenumber: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },

    confirmpassword: {
        type: String,
        required: true
    }
    ,
    gender: {
        type: String,
        required: true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]

} );

// generating tokens

employeeSchema.methods.genarateAuthToken = async function ()
{

    try
    {

        const token = jwt.sign( { _id: this._id.toString() }, process.env.SECRET_KEY );

        this.tokens = this.tokens.concat( { token } );

        await this.save();

        return token;

    } catch ( error )
    {
        res.send( error );
        console.log( error );
    }
}

employeeSchema.pre( "save", async function ( next )
{

    // const passwordHash = await bcrypt.hash( password, 10 );

    if ( this.isModified( "password" ) )
    {
        this.password = await bcrypt.hash( this.password, 10 );

        this.confirmpassword = await bcrypt.hash( this.password, 10 );
    }
    next();
} )


const Resister = new mongoose.model( "Register", employeeSchema );

module.exports = Resister;
