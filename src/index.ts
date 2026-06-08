import type { CommandRegistry } from "./commander.js";
import { handlerLogin, registerCommand, runCommand } from "./commander.js";

const commandRegister: CommandRegistry = {};
registerCommand(commandRegister, "login", handlerLogin);

function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log("ERROR: gator requires atleast 1 positional argument");
    process.exit(1);
  }
  const [commandName, ...arr] = args;
  try {
    runCommand(commandRegister, commandName, ...arr);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      process.exit(1);
    } else {
      console.log("unknown error", error);
    }
  }
}

main();
