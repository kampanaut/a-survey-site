const load_polls = async () => {
  response = await api_get_req({
    api_link: api.type.question,
    accept: api.accept.json,
  });
  data = await response.json();
  initiate_survey(data.questions);
};
$(document).ready(() => {
<<<<<<< HEAD
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
=======
  load_polls();
>>>>>>> 1fe7c1ce85ab8b4aad5a2cf010ea3d0b4b6f81d2
});
