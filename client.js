const net = require("net");
const readline = require("readline/promises");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const socket = net.createConnection({ port: 3008, host: "127.0.0.1" });

let client_id = null;

const clearLine = (direction) => {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(direction, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};

const moveCursor = (dx, dy) => {
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(dx, dy, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};

const askQuestion = async () => {
  const message = await rl.question("Enter a message > ");
  await moveCursor(0, -1);
  await clearLine(0);
  socket.write(`${client_id}-message-${message}`);
};

socket.on("connect", async () => {
  askQuestion();
});

socket.on("data", async (data) => {
  console.log("trace");
  await moveCursor(0, -1);
  await clearLine(0);

  const string = data.toString("utf-8");

  if (!client_id && string.startsWith("id-")) {
    client_id = string.slice(3);
    console.log(`Your client ID is: ${client_id} \n`);
  } else {
    console.log(data.toString());
  }

  askQuestion();
});

socket.on("end", () => {
  console.log("Connection was ended");
});
