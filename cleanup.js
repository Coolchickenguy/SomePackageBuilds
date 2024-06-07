import { removeMatches } from "./lib/gitignore-executer";
import fix from "./lib/es_patches.js";
fix(import.meta);
removeMatches(__dirname,"./cleanup.gitignore","./");