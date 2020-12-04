const load_polls = async () => {
  response = await api_get_req({
    api_link: api.type.question,
    accept: api.accept.json,
  });
  data = await response.json();
  initiate_survey(data.questions);
};
$(document).ready(() => {
  console.log(urls.static, " second print of urls.static");
  const promise = new Promise((resolve, reject) => {
    $.getScript(`${urls.static}poll_front/js/polls-feed.js`, function (script) {
      initiate_poll_feed();
      resolve(200);
    });
  });
  promise.then((response) => {
    load_polls();
  });
});
