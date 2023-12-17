import { Mongo } from "$lib/classes/Mongo";
import { Global } from "$lib/classes/Global";

// Connect to the database.
Mongo.connect();


/**
 * Create a new instance of the static Global class for
 * creating global variables.
 */
await Global.initialize();