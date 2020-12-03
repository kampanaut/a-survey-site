import { urls, api, api_get_req, api_post_req } from "../../base/js/base.js";
const load_polls = async () => {
  response = await api_get_req({
    api_link: api.type.question,
    accept: api.accept.json,
  });
  data = await response.json();
  window.initiate_survey(data.questions);
};
$(document).ready(() => {
  setTimeout(() => {
    const promise = new Promise((resolve, reject) => {
      $.getScript(
        `${urls.static}/poll_front/js/polls-feed.js`,
        function (script) {
          initiate_poll_feed();
          resolve(200);
        }
      );
    });
    promise.then((response) => {
      load_polls();
    });
  }, 500);
});
