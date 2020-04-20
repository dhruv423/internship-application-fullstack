/**
 * Sources: https://github.com/cloudflare/worker-template-fetch/blob/master/index.js
 * https://blog.cloudflare.com/introducing-htmlrewriter/
 * https://developers.cloudflare.com/workers/reference/apis/html-rewriter/#htmlrewriter
 * https://stackoverflow.com/questions/49428779/cloudflare-workers-check-for-cookie-add-headers-set-cookie
 */


const URL = "https://cfw-takehome.developers.workers.dev/api/variants";


addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

class AttributeRewriter
{
	constructor(attributeName, attributeContent)
	{
    this.attributeName = attributeName;
    this.attributeContent = attributeContent;
	}

	element(element)
	{
    const attribute = element.getAttribute(this.attributeName);
    if (attribute) element.setAttribute(this.attributeName, this.attributeContent);
    else element.setInnerContent(this.attributeContent);
	}
}

const rewriter = new HTMLRewriter()
  .on('title', new AttributeRewriter('', 'Dhruv Bhavsar'))
  .on('h1#title', new AttributeRewriter('', 'Dhruv Bhavsar'))
  .on('a#url', new AttributeRewriter('', 'Visit my Site!'))
  .on('a#url', new AttributeRewriter('href', 'https://dhruv423.github.io/'));
  

/**
 * Appropriate steps to take for the response for the request
 * @param {*} request 
 */
async function handleRequest(request) {

  // Get the json response
  const json = await fetchGetHtml(URL);

  // Get cookies
  const cookies = request.headers.get("Cookie");

  // Response
  let response = new Response("Initial");

  if (cookies && cookies.includes("variant 0")) {
    response = rewriter.transform(await fetch(json.variants[0]));
  }
  else if (cookies && cookies.includes("variant 1")) {
    response = rewriter.transform(await fetch(json.variants[1]));
  }
  // no cookies available
  else {
    const {route, variant} = chooseRandRoute(json);
    const resp = await fetch(variant);
    response = rewriter.transform(resp);
    response.headers.set("Set-Cookie", `variant ${route}`);
  }
  return response;
}

/**
 * Function to get random route url and variant number
 * @param {*} json 
 */
function chooseRandRoute(json) {
  const urls = json.variants;
  const route = Math.floor(Math.random() * urls.length);
  const variant = urls[route];
  return { route, variant };
}


/**
 * Gets response JSON from URL
 */
async function getResponseJSON() {
  const response = await fetch(URL);
  const json = await response.json();
  return json;
}


/**
 * gatherResponse awaits and returns a response body as a string.
 * Use await gatherResponse(..) in an async function to get the response body
 * @param {Response} response to
 */
async function gatherResponse(response) {
  const { headers } = response
  const contentType = headers.get('content-type')

  if (contentType.includes('application/json')) {
    const body = await response.json()
    return body
  } else if (contentType.includes('application/text')) {
    const body = await response.text()
    return body
  } else if (contentType.includes('text/html')) {
    const body = await response.text()
    return body
  } else {
    const body = await response.text()
    return body
  }
}


/**
 * fetchGetHtml sends a GET request expecting html
 * Use await fetchGetHtml(..) in an async function to get the HTML
 * @param {string} url the URL to send the request to
 */
async function fetchGetHtml(url) {
  const response = await fetch(url)
  const respBody = await gatherResponse(response)
  return respBody
}
