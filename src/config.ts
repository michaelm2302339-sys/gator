import os from "node:os";
import path from "node:path";
import fs from "node:fs";

type Config = {
  dbUrl: string;
  currentUserName: string;
};

/**
 * updates the currentUserName in the config file
 * @param username
 */
function setUser(username: string) {
  const configFromFile = readConfig();
  configFromFile.currentUserName = username;
  writeConfig(configFromFile);
}

/**
 * reads and returns the contents of a config file. Uses the validateConfig
 * to make sure a type Config is returned otherwisw throws an error
 * @returns object of type Config
 */
function readConfig(): Config {
  const filePath = getConfigFilePath();
  const fileContent = JSON.parse(
    fs.readFileSync(filePath, { encoding: "utf-8" }),
  );
  return validateConfig(fileContent);
}

/**
 * gets the path to the config file (.gatorconfig.json). OS agnostic
 * @returns path to config file
 */
function getConfigFilePath(): string {
  return path.join(os.homedir(), ".gatorconfig.json");
}

/**
 * writes a config object, Config to ~/.gatorconfig.json file
 * @param cfg configuration object
 */
function writeConfig(cfg: Config): void {
  const filePath = getConfigFilePath();
  const configFileFormat = {
    db_url: cfg.dbUrl,
    current_user_name: cfg.currentUserName,
  };
  fs.writeFileSync(filePath, JSON.stringify(configFileFormat));
}

/**
 * validates a config to make sure that it is of type Config
 * @param rawConfig - config to be validated
 * @returns an object of type Config otherwise throws error
 */
function validateConfig(rawConfig: any): Config {
  if (!rawConfig["db_url"]) {
    throw new Error("Config: Missing db_url in config");
  }

  return {
    dbUrl: rawConfig["db_url"],
    currentUserName: rawConfig["current_user_name"] || "",
  };
}

export type { Config };
export { setUser, readConfig };
