import mongoose from 'mongoose';

mongoose.set('strictQuery', false); // strictQuery: false: Mongoose will allow query filters to use fields that are not defined in the schema. 
export const connectToDb = async ()=>{
    try{
        const {connection} = await mongoose.connect(process.env.MONGO_URI); //The method mongoose.connect() returns a promise that resolves to a Mongoose object, which contains several properties, one of which is connection. The connection property represents the instance of the database connection.Destructuring { connection } from the returned object means you're extracting the connection property from the returned object and assigning it to a constant named connection.
        // console.log("abhishek",connection);
        if(connection){
             console.log(`Connected to MongoDB:${connection.host}`);
        }
        // process.exit(0);

    }
    catch(e){
        console.log(e);
        process.exit(1);// exit code 1 : indicate process ended due to an error and Exit Code 0:indicate process completed successfully without any errors.
    }
}







// Note - Example Without Destructuring
// const mongooseConnectionObject = await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
// const connection = mongooseConnectionObject.connection;
