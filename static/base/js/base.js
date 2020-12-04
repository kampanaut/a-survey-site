const urls = {
  static: "/static/",
};

const api = {
  api_root: "api",
  type: {
    question: "questions",
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

const api_get_req = ({ api_link = [""], get_req = "", accept }) => {
  console.log("api link[]: ", api_link);
  if (Array.isArray(api_link)) api_link = api_link.join("/");
  else api_link = [api_link];
  console.log("api link: ", api_link);
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
