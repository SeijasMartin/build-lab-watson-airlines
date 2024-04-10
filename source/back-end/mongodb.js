const fs = require('fs');

const IbmCloudSecretsManagerApiV2 =  require('@ibm-cloud/secrets-manager/secrets-manager/v2');
const { IamAuthenticator } = require('@ibm-cloud/secrets-manager/auth');

const mongoose = require('mongoose');

// Mongoose configuration
mongoose.set('strictQuery', false);
mongoose.set('bufferCommands', false);

/**
 * Create connection to the database
 */
const create_connection = async () => {
    try {
        // Create a Secrets Manager client instance
        const secretsManagerService = new IbmCloudSecretsManagerApiV2({
        authenticator: new IamAuthenticator({
            apikey: process.env.SECRET_MANAGER_APIKEY,
        }),
        serviceUrl: process.env.SECRET_MANAGER_URL,
        });

        // Get the mongodb certificate from Secrets Manager Service
        let cert = await secretsManagerService.getSecret({
            id: process.env.SECRET_MANAGER_CERT_ID,
        });
        
        // Create an auxiliary certificate file for the mongoose connection
        const cert_name = './certificate.pem';
        fs.writeFileSync(cert_name, cert.result.certificate, (err) => {if (err) throw err;});
        
        // Connect to the mongodb database
        await mongoose.connect(
            uri = process.env.MONGO_DB_URI, 
            options = {
                ssl: true,
                sslValidate: false,
                sslCA: cert_name,
            }
        );
        
        // Store connection
        let db = mongoose.connection;

        // Check connection status
        // Values are: 
        //  0: disconnected
        //  1: connected
        //  2: connecting
        //  3: disconnecting

        if (db.readyState == 1){
            console.log("MongoDB connection successful.");    
        }
        else{
            console.error.bind(console, "connection error: ");
        }
        
        // Delete temporary certificate file
        fs.unlinkSync(cert_name);

        // Return connection
        return db;
    } catch (e) {
        return e.status;
    }
}

/**
 * Disconnect the database
 */
const close_connection = async () => {
    try {
        //Disconnect the mongodb database
        mongoose.connection.close();
    }catch(e){
        //console.error(e)
        next(e);

    }
}

module.exports = {
    create_connection,
    close_connection,
};