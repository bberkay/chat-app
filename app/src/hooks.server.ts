import { MongoDB } from "$lib/database/mongodb";

const db = new MongoDB();
db.connect();