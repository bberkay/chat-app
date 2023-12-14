import { Mongo } from "$lib/classes/Mongo";
import { Global } from "$lib/classes/Global";

/**
 * Connect to the database.
 */
const db = new Mongo();
db.connect();

/**
 * Create a new instance of the static Global class for
 * creating global variables.
 */
await Global.initialize();