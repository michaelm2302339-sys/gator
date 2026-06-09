type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;
type CommandRegistry = Record<string, CommandHandler>;

function registerCommand(
  registry: CommandRegistry,
  cmdName: string,
  handler: CommandHandler,
) {
  registry[cmdName] = handler;
}

async function runCommand(
  registry: CommandRegistry,
  cmdName: string,
  ...args: string[]
) {
  const handler = registry[cmdName];
  await handler(cmdName, ...args);
}

export type { CommandHandler, CommandRegistry };
export { registerCommand, runCommand };
