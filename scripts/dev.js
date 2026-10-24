/* eslint-disable @typescript-eslint/no-require-imports */
const path = require("node:path");
const { spawn } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const children = [];
let shuttingDown = false;

function start(label, command, args) {
  const child = spawn(command, args, {
    cwd: root,
    env: process.env,
    stdio: "inherit",
  });
  children.push({ label, child });

  child.on("error", (error) => {
    console.error(`${label} failed to start: ${error.message}`);
    shutdown(1);
  });

  child.on("exit", (code, signal) => {
    if (!shuttingDown) {
      console.error(`${label} exited${signal ? ` after ${signal}` : ` with code ${code}`}. Stopping the other service.`);
      shutdown(code || 1);
    }
  });

  return child;
}

function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  const active = children.filter(({ child }) => child.exitCode === null && !child.killed);
  if (active.length === 0) {
    process.exit(exitCode);
  }

  let remaining = active.length;
  const finish = () => {
    remaining -= 1;
    if (remaining === 0) process.exit(exitCode);
  };

  for (const { child } of active) {
    child.once("exit", finish);
    child.kill("SIGINT");
  }

  setTimeout(() => process.exit(exitCode), 5000).unref();
}

process.on("SIGINT", () => shutdown(130));
process.on("SIGTERM", () => shutdown(143));

console.log("Starting Spotwise frontend and backend…");
start("Backend", process.execPath, [path.join(root, "server", "index.js")]);
start("Frontend", process.execPath, [
  path.join(root, "node_modules", "next", "dist", "bin", "next"),
  "dev",
  ...process.argv.slice(2),
]);
