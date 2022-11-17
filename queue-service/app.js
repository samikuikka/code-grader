import { delay, serve } from "./deps.js";

const sockets = new Set();

const createWebSocketConnection = (request) => {
    console.log("Creating WS connection");
    const { socket, response } = Deno.upgradeWebSocket(request);
  
    socket.onopen = () => socket.send("Connection created");
    socket.onmessage = (e) => console.log(`Received a message: ${e.data}`);
  
    socket.onclose = () => {
      console.log("WS closed");
      sockets.delete(socket);
    };
    socket.onerror = (e) => console.error("WS error:", e);
  
    sockets.add(socket);
  
    return response;
};

const handleRequest = async (request) => {
    const pathname = new URL(request.url).pathname;
    console.log(pathname);
    if (pathname == "/" && request.method == 'POST') {
        const data = await request.json();
        console.log('Data in the queue service', data)

        //MOCK GRADE
        let res = {
            result: null
        }
        Math.random() * 3 < 2 ? res.result = true : res.result = false;
        
        //Send grade
        sockets.forEach(socket => socket.send(JSON.stringify(res)));
    } else if (pathname === "/connect") {
      return createWebSocketConnection(request);
    }
  
    return new Response(200);
  };
  
  serve(handleRequest, { port: 7775 });