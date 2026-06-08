import { setUser } from "./config.js";

function handlerLogin(cmdName: string, ...args: string[]): void {
  if (args.length != 1) {
    throw new Error(
      `${cmdName} handler expects a single arg but got ${args.length}`,
    );
  }

  const [username] = args;
  setUser(username);
  console.log(`Welcome Back, ${username}!`);
}

export { handlerLogin };
