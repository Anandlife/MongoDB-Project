const mongoose = require( "mongoose" );

const bcrypt = require( "bcryptjs" );

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
    }

} );


employeeSchema.pre( "save", async function ( next )
{

    // const passwordHash = await bcrypt.hash( password, 10 );

    if ( this.isModified( "password" ) )
    {
        this.password = await bcrypt.hash( this.password, 10 );

        this.confirmpassword = undefined;
    }
    next();
} )


const Resister = new mongoose.model( "Register", employeeSchema );

module.exports = Resister;
