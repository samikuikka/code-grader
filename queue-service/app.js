import { delay, serve } from "./deps.js";
import { grade } from "./grade.js";
import { executeQuery } from './database/database.js';

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
    const user = item.user;
    const name = item.name;
    console.log('Processing ', item);

    const result = await grade(item.code);
    //console.log(result);
    //MOCK GRADE
    let res = {
        result: null,
        exercise: item.name
    }
    result == "FAIL" ? res.result = false : res.result = true;
   
    // save to db
    if( res.result) {
        await executeQuery(
            "INSERT INTO exercises (exercise, username) VALUES ($name, $user);",
            {
                name,
                user
            },
        );
    }

    //Send grade
    try {
        sockets.get(item.user).send(JSON.stringify(res));
    } catch (e) {
        console.log(e);
    }
    
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
  
  serve(handleRequest, { port: 7779 });