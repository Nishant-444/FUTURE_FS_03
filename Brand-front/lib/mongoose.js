import mongoose from "mongoose";

// A global object to cache the connection promise
let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

export async function mongooseConnect() {
	// If we have a cached connection, return it
	if (cached.conn) {
		return cached.conn;
	}

	// If there's no cached promise, create a new one
	if (!cached.promise) {
		const MONGODB_URI = process.env.MONGODB_URI;
		if (!MONGODB_URI) {
			throw new Error(
				"Please define the MONGODB_URI environment variable inside .env.local"
			);
		}

		// Cache the promise of the connection. This prevents race conditions.
		cached.promise = mongoose
			.connect(MONGODB_URI, {
				bufferCommands: false, // Recommended option
			})
			.then((mongoose) => {
				return mongoose;
			});
	}

	// Wait for the connection promise to resolve and cache the connection
	cached.conn = await cached.promise;
	return cached.conn;
}
