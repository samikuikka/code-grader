import { delay, serve } from "./deps.js";
import { grade } from "./grade.js";

const sockets = new Map();

const createWebSocketConnection = (request) => {
    console.log("Creating WS connection");
    const { socket, response } = Deno.upgradeWebSocket(request);

    const url = new URL(request.url);
    const params = url.searchParams;
    const id = params.get('id');
  
    socket.onopen = () => socket.send("Connection created");
    socket.onmessage = (e) => console.log(`Received a message: ${e.data}`);
  
    socket.onclose = () => {
      console.log("WS closed");
      sockets.delete(socket);
    };
    socket.onerror = (e) => console.error("WS error:", e);
  
    sockets.set(id, socket);
  
    return response;
};

let queue = [];
let run = 0;

const runQueue = async () => {
    if(!queue.length) {
        return;
    }
    if(!run) {
        return;
    }
    run = 1;
    
    let item = queue.pop();
    console.log('Processing ', item);
    await delay(5000);

    //MOCK GRADE
    let res = {
        result: null
    }
    Math.random() * 3 < 2 ? res.result = true : res.result = false;

    //Send grade
    sockets.get(item.user).send(JSON.stringify(res));
    
    if(queue.length > 0) {
        return runQueue();
    }

    run = 0;
    return;
}

const handleRequest = async (request) => {
    const url = new URL(request.url);
    const pathname = url.pathname;
    //console.log(pathname);
    if (pathname == "/" && request.method == 'POST') {
        const data = await request.json();
        console.log('Adding to queue', data)
        queue.push(data);

        if(run == 0) {
            console.log("Started the service")
            run = 1;
            runQueue();
        }
    } else if (pathname === "/connect") {
      return createWebSocketConnection(request);
    }
  
    return new Response(200);
  };
  
  serve(handleRequest, { port: 7775 });