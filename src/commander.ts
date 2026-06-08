import { handlerLogin } from "./handlers";

type CommandHandler = (cmdName: string, ...args: string[]) => void;
type CommandRegistry = Record<string, CommandHandler>;

function registerCommand(
  registry: CommandRegistry,
  cmdName: string,
  handler: CommandHandler,
) {
  registry[cmdName] = handler;
}

function runCommand(
  registry: CommandRegistry,
  cmdName: string,
  ...args: string[]
) {
  const handler = registry[cmdName];
  handler(cmdName, ...args);
}

export type { CommandHandler, CommandRegistry };
export { registerCommand, runCommand, handlerLogin };
