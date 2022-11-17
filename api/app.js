import { serve } from "./deps.js";
import { grade } from "./grade.js";

const sendRequest = (data) => {
  
  fetch("http://localhost:7775/",
  {
    method: "POST",
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  });
} 

const handleRequest = async (request) => {
  const url = new URL(request.url);
 /*  const formData = await request.formData();
  const code = formData.get("code");

  const result = await grade(code); */

  if(request.method === "POST") {
    const data = await request.json();
    console.log('Data in the api: ', data)
    //Send the reqeust to the queue
    sendRequest(data);
    return new Response(JSON.stringify({ result: data}));
  } else {
    return new Response('POST TO HERE', { status: 200 });
  }

  //return new Response(JSON.stringify({ result: result }));
};

serve(handleRequest, { port: 7777 });
