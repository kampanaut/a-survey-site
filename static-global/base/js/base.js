const urls = {
  static: "/static/",
};

const api = {
  api_root: "api",
  type: {
    question: "questions",
    message: "messages",
    user: "participants",
    answer: "answers",
    misc: "misc",
    survey: 'survey',
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

const refreshListeners = ({ domElement=[""], event: eventName=[""], newFuncCallback=[(e)=>e], localCallback=(e=>e) }) => {
  if (Array.isArray(eventName)) eventName = eventName.join(", ")
  let callbacks = {};
  if (!Array.isArray(domElement)) 
  {
    $(domElement).off(eventName)
    localCallback();
    $(domElement).on(eventName, (e) => { newFuncCallback(e) }) 
  }
  else
  {
    for (const index in domElement) { 
      callbacks[index] = {};
      callbacks[index].func = newFuncCallback[index]; 
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

const api_post_create = ({api_link = [""], post_req, accept, csrftoken}) => {
  if (Array.isArray(api_link)) api_link = api_link.join("/");
  else api_link = [api_link];
  return fetch(`${api.api_root}/${api_link}/create`, {
    method: "POST",
    credentials: "same-origin", 
    headers: {
      Accept: accept,
      'X-Requested-With': 'XMLHttpRequest', 
      'X-CSRFToken': csrftoken,
    }, 
    body: JSON.stringify({
      post_req
    })
  })
};