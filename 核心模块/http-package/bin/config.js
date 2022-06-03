module.exports = {
  port: {
    option: "-p --port <number>",
    description: "server port number",
    default: 8000,
    usage: "server --port <number>",
  },
  directory: {
    option: "-d --directory <name>",
    description: "server directory",
    default: process.cwd(),
    usage: "server -d d:",
  },
};
