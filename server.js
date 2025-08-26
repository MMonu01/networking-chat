const net = require("net");
// const crypto = require("crypto");

const server = net.createServer();

const clients = [];

server.on("connection", (socket) => {
  console.log("New client connected:", socket.remoteAddress);

  const client_id = clients.length + 1; // crypto.randomBytes(16).toString("hex");
  socket.write(`id-${client_id}`);

  clients.forEach((client) => {
    client.socket.write(`> user-${client_id} joined!`);
  });

  socket.on("data", (data) => {
    const data_string = data.toString("utf-8");
    const sender_id = data_string.split("-")[0];
    const message = data_string.split("-message-")[1];

    clients.forEach((client) => {
      client.socket.write(`> user-${sender_id}  ${message}`);
    });
  });

  // user left for linux and mac
  socket.on("end", () => {
    clients.forEach((client) => {
      client.socket.write(`> user-${client_id} left!`);
    });
  });

  // user left for windows
  socket.on("error", () => {
    clients.map((client) => {
      client.socket.write(`User-${client_id} left!`);
    });
  });

  clients.push({ id: client_id, socket });
});

server.listen(3008, "localhost", () => {
  console.log("Server is running at", server.address());
});
