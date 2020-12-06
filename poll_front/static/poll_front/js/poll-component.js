let cur_question_item = 0;
let cur_question_key = 0;

const html_elems = {
	likert_and_question: $('main.poll-container_main>section, main.poll-container_main>hr'),
	poll_container_main: $('main.poll-container_main')[0],
	user_form_container: 'section.user-form_container',
};

const poll_component = () => {};

//PRINTS THE QUESTION TEXT THE QUESTION CONTAINER ELEMENT
const print_data = (question_text) => {
	console.log('%cPrinted the Question: ', 'color: #ffae17', question_text);
	$('div#question_text>span').html(question_text.text);
	$('div.question-item-info.sort>span').html(`item no. <span>${cur_question_key + 1}</span>`);
	survey_navi_btn_check(question_text);
};

//INITIATES ALL OF THE CORE FUNCTIONS OF THE POLL SURVEY FUNCTIONALITY
const initiate_survey = (questions_json = JSON) => {
	cur_question_item = Object.keys(questions_json)[cur_question_key];
	console.log(cur_question_item);
	console.log('QUESTIONS: ', questions_json);
	const ask_w_answ_arr = {};
	let answer = '';
	let user_form = {
		in_use: false,
		input_data: null,
		requested: false,
	};
	const question_total = Object.keys(questions_json).length;
	const last_id_key = Object.keys(questions_json)[question_total - 1];

	print_data(questions_json[cur_question_item]);

	//Assign TOTAL QUESTIONS
	$('div.question-item-info.total>span').html(`total items: <span>${question_total}</span>`);
	survey_btn_listeners();

	//A function for submitting answers
	const submit_poll = (question_index) => {
		const data = $('form#qualit-answer').serialize();
		answer = data.split('=')[1];
		ask_w_answ_arr[question_index] = {
			text: questions_json[question_index].text,
			sort: questions_json[question_index].sort,
			id: questions_json[question_index].id,
			answ: answer,
		};
		console.log(`%cArrays of Answer: `, 'color: #f27100; background-color: #1c1c1c; font-weight: bold;', ask_w_answ_arr);
		console.log(
			`%cLatest question ID saved inside:`,
			'color: #f27100; background-color: #1c1c1c; font-weight: bold;',
			ask_w_answ_arr[cur_question_item].id
		);
	};

	//A function that puts the previous answer saved from the global stack to the textarea input
	const ans_snapshot = () => {
		$('textarea#id_answer').val(ask_w_answ_arr[cur_question_item].answ.replace(/(%20)/g, ' '));
	};

	//A function that shows the user form
	const user_data_form_show = async () => {
		const height = $(html_elems.poll_container_main).css('height');
		if (!user_form.requested) {
			response = await api_get_req({
				api_link: [api.type.user, api.subtype.form],
				accept: api.accept.html,
			});
			html = await response.text();
			user_form.requested = true;
			setTimeout(() => {
				$(html_elems.poll_container_main).addClass('is-user-form').css({ 'min-height': height }).append(`
          <section class="user-form_container" style="opacity:0">${html} </section>
          `);
				$('form#user-form').css({ height: `calc(${height} - 0.6rem)` });
				setTimeout(() => {
					$('section.user-form_container').css({
						opacity: 1,
					});
				}, 200);
			}, 230);
		} else {
			$(html_elems.poll_container_main).addClass('is-user-form').css({ 'min-height': height });
			$('section.user-form_container').css({
				display: 'block',
			});
			setTimeout(() => {
				$('section.user-form_container').css({
					opacity: 1,
				});
			}, 200);
		}
		$(html_elems.likert_and_question).css({
			opacity: 0,
			transition: 'all 200ms ease-out',
		});
		user_form.in_use = true;
	};

	//Function for hiding the user form
	const user_data_form_hide = (flow = '') => {
		const change_panel = () => {
			if (flow === 'prev') {
				setTimeout(() => {
					$(html_elems.poll_container_main).attr('style', '').removeClass('is-user-form');
					$(html_elems.user_form_container).css({ display: 'none' });
					setTimeout(() => {
						$(html_elems.likert_and_question).css('transition', '');
					}, 200);
					$(html_elems.likert_and_question).css('opacity', '1');
				}, 150);
				$(html_elems.user_form_container).css({ opacity: 0 });
			} else {
				setTimeout(() => {
					$(html_elems.poll_container_main).attr('style', '').removeClass('is-user-form').addClass('is-question-form');
					$(html_elems.user_form_container).css({ display: 'none' });
					setTimeout(() => {
						$(html_elems.user_form_container).css('transition', '');
						$('section.misc-message_container').css('opacity', '1');
					}, 100);
					$('section.misc-message_container').css('display', 'block');
				}, 150);
				$(html_elems.user_form_container).css({ opacity: 0 });
			}
		};
		if (flow === 'prev') {
			user_form.in_use = false;
			console.log('Hiding User Form');
			change_panel();
		} else if (flow === 'next') {
			if (user_form.input_data.first_name && user_form.input_data.last_name && user_form.input_data.birthday) {
				console.log('Hiding User Form');
				user_form.in_use = false;
				(async () => {
					response = await api_get_req({
						api_link: [api.type.misc, api.type.message, 'farewell'],
						accept: api.accept.html,
					});
					html = await response.text();
					$(html_elems.poll_container_main).append(`
							<section class="misc-message_container" style="opacity: 0; display:none">${html}</section>
						`);
					$('div.poll-navi-btns_container').attr('state', 'submit');
					change_panel();
				})();
			} else {
				console.log('%cIncomplete Form!', 'color:orangered');
				$('form#user-form>fieldset>div.input_container').each(function (index, element) {
					const child_elem = $(element).children('input');
					if (child_elem.val() === '') {
						child_elem.attr('valid', 'true');
					} else {
						child_elem.removeAttr('valid');
					}
				});
				setTimeout(() => {
					$('form#user-form>fieldset>div.input_container').removeClass('pulse');
				}, 200);
				$('form#user-form>fieldset>div.input_container').addClass('pulse');
			}
		} else {
			throw `Invalid Argument for function user_data_form_hide("${flow}").
      Use only two arguments, "prev" and "next".`;
		}
	};

	//Event listeners for the two buttons in order to navigate between panels of question and forms
	$('div.poll-navi-btns_container').click((e) => {
		console.log('%cNAVIGATION BUTTON CLICKED', 'color: #ffae17');
		if (!user_form.in_use) submit_poll(cur_question_item);
		else {
			user_form.input_data = {
				first_name: $('form#user-form>fieldset>div.first-name>input').val(),
				last_name: $('form#user-form>fieldset>div.last-name>input').val(),
				birthday: $('form#user-form>fieldset>div.birth-date>input').val(),
			};
			console.log(
				`%cUser input for User Data: `,
				'color: #72db7a; background-color: #1c1c1c; font-weight: bold;',
				user_form.input_data
			);
		}
		$('textarea#id_answer').val('');
		if (!answer && $(e.target).is('.right')) {
			setTimeout(() => {
				$('textarea#id_answer').removeClass('pulse');
			}, 200);
			$('textarea#id_answer').addClass('pulse');
		}
	});

	//Event listener specifically for the right side button, the NEXT button
	$('div.poll-navi-btns_container.right:not([state="submit"])').click((e) => {
		console.log('%cNEXT PANEL', 'color:#4fdf4f;');
		if (user_form.in_use) {
			user_data_form_hide('next');
			answer = undefined;
		}
		if (answer) {
			if (cur_question_item != last_id_key) {
				cur_question_item = Object.keys(questions_json)[++cur_question_key];
				print_data(ask_w_answ_arr[cur_question_item] ? ask_w_answ_arr[cur_question_item] : questions_json[cur_question_item]);
				if (ask_w_answ_arr[cur_question_item]) ans_snapshot();
			} else {
				console.log('Using User Form');
				user_data_form_show();
			}
		}
	});

	//Event listener specifically for the left side button, the PREV button
	$('div.poll-navi-btns_container.left:not([state="submit"])').click((e) => {
		console.log('%cPREV PANEL', 'color:#4bb6e0;');
		if (user_form.in_use) {
			user_data_form_hide('prev');
		} else {
			cur_question_item = Object.keys(questions_json)[--cur_question_key];
			print_data(ask_w_answ_arr[cur_question_item] ? ask_w_answ_arr[cur_question_item] : questions_json[cur_question_item]);
		}
		if (ask_w_answ_arr[cur_question_item]) ans_snapshot();
	});
};
const survey_btn_listeners = () => {
	$(' div.scale-items_container > input[type="button"]')
		.on({
			mouseenter: (e) => {
				$(e.currrentTarget).off('mouseleave');
				const timer = setTimeout(() => {
					$(e.currentTarget).addClass('hover-state-one hover-state-two');
					$(e.currentTarget).on('mouseleave', (e1) => {
						$(e1.currentTarget).removeClass('hover-state-two');
						setTimeout(() => {
							$(e1.currentTarget).removeClass('hover-state-one').off('mouseleave');
						}, 300);
					});
				}, 120);
				$(e.currentTarget).on('mouseleave', (e) => {
					clearTimeout(timer);
					$(e.currentTarget).off('mouseleave');
				});
			},
		})
		.click((e) => {
			const radio_btn = $(e.target).prev()[0];
			if ($(radio_btn).is(':checked')) $(radio_btn).prop('checked', false);
			else $(radio_btn).prop('checked', true);
		});
};
