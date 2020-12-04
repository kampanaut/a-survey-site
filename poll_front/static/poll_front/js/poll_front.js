console.log(urls.static, " first print of urls.static");

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
    console.log(urls.static, " third print of urls.static");
    console.log(`${urls.static}/poll_front/js/polls-feed.js`);
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
});
