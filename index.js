/**
 * Sources: https://github.com/cloudflare/worker-template-fetch/blob/master/index.js
 */


const URL = "https://cfw-takehome.developers.workers.dev/api/variants";
const init = {
  method: "POST",
  headers: {
    "content-type": "application/json",
  },
};

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});



async function handleRequest(request) {
  const json = await getResponseJSON();
  return new Response(JSON.stringify(json));
}


/**
 * Gets response JSON from URL
 */
async function getResponseJSON() {
  const response = await fetch(URL);
  const json = await response.json();
  return json;
}
