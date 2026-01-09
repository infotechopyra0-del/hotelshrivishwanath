import mongoose from 'mongoose'

declare global {
  var mongoose: {
    conn: mongoose.Connection | null
    promise: Promise<mongoose.Connection> | null
  }
}

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null }
}

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

interface MongooseCache {
  conn: mongoose.Connection | null
  promise: Promise<mongoose.Connection> | null
}

let cached: MongooseCache = global.mongoose
async function dbConnect(): Promise<mongoose.Connection> {
  if (cached.conn) {
    console.log('🔄 Using existing MongoDB connection')
    return cached.conn
  }
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false, // Disable mongoose buffering
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      retryWrites: true, // Retry failed writes
      w: 'majority', // Write concern
    }

    console.log('🔌 Connecting to MongoDB...')
    
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully')
      
      // Connection event listeners
      mongoose.connection.on('connected', () => {
        console.log('🟢 Mongoose connected to MongoDB')
      })

      mongoose.connection.on('error', (err) => {
        console.error('🔴 Mongoose connection error:', err)
      })

      mongoose.connection.on('disconnected', () => {
        console.log('🟡 Mongoose disconnected from MongoDB')
      })

      // Graceful shutdown
      process.on('SIGINT', async () => {
        await mongoose.connection.close()
        console.log('🔴 Mongoose connection closed due to app termination')
        process.exit(0)
      })

      return mongoose.connection
    }).catch((error) => {
      console.error('❌ MongoDB connection error:', error)
      throw error
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (error) {
    // Reset promise on error so we can retry
    cached.promise = null
    throw error
  }

  return cached.conn
}

/**
 * Disconnect from MongoDB (mainly for testing)
 */
async function dbDisconnect(): Promise<void> {
  if (cached.conn) {
    await mongoose.connection.close()
    cached.conn = null
    cached.promise = null
    console.log('🔌 Disconnected from MongoDB')
  }
}

/**
 * Check database connection status
 */
function isConnected(): boolean {
  return mongoose.connection.readyState === 1
}

/**
 * Get connection status string
 */
function getConnectionStatus(): string {
  switch (mongoose.connection.readyState) {
    case 0:
      return 'Disconnected'
    case 1:
      return 'Connected'
    case 2:
      return 'Connecting'
    case 3:
      return 'Disconnecting'
    default:
      return 'Unknown'
  }
}

/**
 * Database health check
 */
async function healthCheck(): Promise<{
  status: string
  database: string
  host: string
  port: number
  readyState: number
}> {
  try {
    const connection = await dbConnect()
    
    return {
      status: 'Connected',
      database: connection.db?.databaseName || 'Unknown',
      host: connection.host || 'Unknown',
      port: connection.port || 0,
      readyState: connection.readyState
    }
  } catch (error) {
    throw new Error(`Database health check failed: ${error}`)
  }
}

export default dbConnect
export { 
  dbConnect, 
  dbDisconnect, 
  isConnected, 
  getConnectionStatus, 
  healthCheck 
}