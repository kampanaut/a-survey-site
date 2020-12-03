const load_polls = async () => {
  response = await api_get_req({
    api_link: api.type.question,
    accept: api.accept.json,
  });
  data = await response.json();
  initiate_survey(data.questions);
};
$(document).ready(() => {
  load_polls();
});
