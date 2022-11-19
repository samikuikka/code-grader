import { serve } from "./deps.js";
import {executeQuery} from './database/database.js';

const sendRequest = (data) => {
  try {
    fetch("http://queue-service:7779/",
  {
    method: "POST",
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  });
  } catch (e){
    console.log(e);
  }
}

const getResults = async (request) => {

  const url = new URL(request.url);
  const params = url.searchParams;
  const id = params.get('id');
  
  const result = await executeQuery(
    "SELECT exercise FROM exercises WHERE username = $id AND successful = TRUE;",
    {
      id
    },
  );
    return result.rows;
}

const handleRequest = async (request) => {
  const url = new URL(request.url);
  
  //console.log(url.pathname);

  if(request.method === "POST") {
    const data = await request.json();

    //console.log('Data in the api: ', data)

    //Send the request to the queue
    sendRequest(data);
    return new Response(JSON.stringify({ result: data}));

  } else if (request.method === "GET" && url.pathname == "/api/results") {
      console.log('Retrieving results...');
      const exercise_results = await getResults(request);
      return new Response(JSON.stringify(exercise_results));
  } else {
    return new Response('POST TO HERE', { status: 200 });
  }

  //return new Response(JSON.stringify({ result: result }));
};

serve(handleRequest, { port: 7777 });
