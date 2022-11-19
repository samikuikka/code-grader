import { delay, serve, connect} from "./deps.js";
import { grade } from "./grade.js";
import { executeQuery } from './database/database.js';

const sockets = new Map();

// Cache server
const redis = await connect({
    hostname: "cache",
    port: 6379
})

// Creates the websocket connection between frontend and queue
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

// Queue process
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

    let result;
    //Check if in cache
    const hit = await redis.hget(name, item.code);
    if(hit != null) {
        //Cache hit
        //console.log('Cache hit in queue');
        result = hit == "0" ? "FAIL" : "PASS";
    } else {
        //console.log('Processing ', item);
        result = await grade(item.code);
    }

    //console.log(result);
    //MOCK GRADE
    let res = {
        result: null,
        exercise: item.name
    }
    result == "FAIL" ? res.result = false : res.result = true;
    const bool  = res.result ? '1' : '0';
   
    // save to db
    await executeQuery(
        "INSERT INTO exercises (exercise, username, successful) VALUES ($name, $user, $bool);",
        {
            name,
            user,
            bool
        },
    );

    //Save to cache
    await redis.hset(`${name}`, item.code, bool);
    

    //Send grade
    try {
        let socket = sockets.get(item.user)
        if(socket){
            socket.send(JSON.stringify(res))
        }
    } catch (e) {
        console.log("User did not initiate the connection first");
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
        //console.log('Adding to queue', data)

        const hit = await redis.hget(data.name, data.code);
        if(hit != null) {
            //Cache hit
            const val = hit == "0" ? false : true;
            const res = {
                result: val,
                exercise: data.name
            }
            //Send grade
            try {
                let socket = sockets.get(data.user)
                if(socket){
                    socket.send(JSON.stringify(res))
                }
                //sockets.get(data.user).send(JSON.stringify(res));
            } catch (e) {
                console.log(e);
            }
        } else {
            // Cache miss
            queue.push(data);

            if(run == 0) {
                console.log("Started the service")
                run = 1;
                runQueue();
            }
        }
    } else if (pathname === "/connect") {
      return createWebSocketConnection(request);
    }
  
    return new Response(200);
  };
  
  serve(handleRequest, { port: 7779 });