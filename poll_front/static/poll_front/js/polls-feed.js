const getCookie = (cookie) => {
	let name = cookie + "=";
	let decoded_cookie = decodeURIComponent(document.cookie);
	let arr_cookie = decoded_cookie.split(';');
	for (let i = 0; i < arr_cookie.length; ++i) 
	{
		var cookie = arr_cookie[i];
		while (cookie.charAt(0) == ' ')
		{
			cookie = cookie.substring(1); 
		}
		if (cookie.indexOf(name) == 0)
		{
			return cookie.substring(name.length, cookie.length)
		}
	}
	return "";
}

const initiate_poll_feed = () => {
	if (getCookie('submitted') !== 'true')
	{
		$.getScript(`${urls.static}poll_front/js/poll-component.js`, function (script) {
			poll_component();
		});
		return true;
	}
	else
	{
		$.getScript(`${urls.static}poll_front/js/endgame-component.js`, function (script) {
			endgame_component();
		});
		return false;
	}
};
const survey_navi_btn_check = (questions) => {
	const left_btn_container = $('div.poll-navi-btns_container.left');
	// const right_btn_container = $('div.poll-navi-btns_container.right');
	if (cur_question_key + 1 == 1) {
		$(left_btn_container).attr('show', 'false');
	} else {
		$(left_btn_container).attr('show', 'true');
	}
};
