/**
 * Sources: https://github.com/cloudflare/worker-template-fetch/blob/master/index.js
 * https://blog.cloudflare.com/introducing-htmlrewriter/
 * https://developers.cloudflare.com/workers/reference/apis/html-rewriter/#htmlrewriter
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
    element.setInnerContent(this.attributeContent);
	}
}

const rewriter = new HTMLRewriter()
  .on('title', new AttributeRewriter('', 'Dhruv Bhavsar'))
  .on('h1#title', new AttributeRewriter('', 'Dhruv Bhavsar'))
  .on('a#url', new AttributeRewriter('', 'Visit my Site!'));
  


async function handleRequest(request) {
  const init = {
    method: 'Get',
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  }

  const json = await fetchGetHtml(URL);
  const randomRoute = chooseRandRoute(json);
  const html = await fetchGetHtml(randomRoute);
  const resp = await fetch(randomRoute);
  return rewriter.transform(resp);
}


function chooseRandRoute(json) {
  const urls = json.variants;
  const route = Math.floor(Math.random() * urls.length);
  return urls[route];
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
