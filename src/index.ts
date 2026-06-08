import { readConfig, setUser } from "./config";

function main() {
  setUser("Chimobi");
  const config = readConfig();
  console.log(config);
}

main();
