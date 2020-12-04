const initiate_poll_feed = () => {
  $.getScript(
    `${urls.static}poll_front/js/poll-component.js`,
    function (script) {
      poll_component();
    }
  );
};
const survey_navi_btn_check = (questions) => {
  const left_btn_container = $("div.poll-navi-btns_container.left");
  // const right_btn_container = $('div.poll-navi-btns_container.right');
  if (questions.sort == 1) {
    $(left_btn_container).attr("show", "false");
  } else {
    $(left_btn_container).attr("show", "true");
  }
};
