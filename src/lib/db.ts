import mongoose, { Connection } from 'mongoose';
declare global {
  var cachedConnection: Connection | null;
}

export default async function connecttoMongodb() {
  try {
    if (global.cachedConnection) {
      console.log('using cached connection for db..');
      return global.cachedConnection;
    } else {
      if (!process.env.MONGO_URL) throw new Error('MONGO_URL is not defined');
      const cnx = await mongoose.connect(process.env.MONGO_URL);
      global.cachedConnection = cnx.connection;
      console.log('db connection established...');
      return global.cachedConnection;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
