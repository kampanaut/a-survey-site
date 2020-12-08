const urls = {
  static: "/static/",
};

const api = {
  api_root: "api",
  type: {
    question: "questions",
    message: "messages",
    user: "users",
    answer: "answers",
    misc: "misc",
  },
  subtype: {
    form: "form",
  },
  accept: {
    json: "application/json",
    html: "text/html",
    text: "text/plain",
  },
};

const refreshListeners = ({ domElement=[""], event: eventName=[""], functionCallback=[(e)=>e], localCallback=(e=>e) }) => {
  if (Array.isArray(eventName)) eventName = eventName.join(", ")
  $(domElement).off(eventName)
  let callbacks = {};
  if (!Array.isArray(domElement)) 
  {
    throw "Not an Array is given Argument to function, refreshListeners!"
    domElement = domElement.join(", ");
  }
  else
  {
    for (const index in domElement) { 
      callbacks[index] = {};
      callbacks[index].func = functionCallback[index]; 
    }
    for (const index in domElement) { $(domElement[index]).off(eventName) };

    localCallback();
    for (const index in domElement) { $(domElement[index]).on(eventName, (e) => {callbacks[index].func(e)});
    }
  }
}

const api_get_req = ({ api_link = [""], get_req = "", accept }) => {
  if (Array.isArray(api_link)) api_link = api_link.join("/");
  else api_link = [api_link];
  return fetch(
    `${api.api_root}/${api_link}/fetch${get_req ? `?${get_req}` : ""}`,
    {
      method: "GET",
      credentials: "same-origin",
      headers: {
        Accept: accept,
      },
    }
  );
};

const api_post_req = ({ api_type, post_req, accept }) => {
  return fetch(`${api.api_root}/${api_type}/fetch`, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      Accept: accept,
    },
    body: post_req,
  });
};
