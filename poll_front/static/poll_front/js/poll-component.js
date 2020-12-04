let question_item = 1;

const html_elems = {
  likert_and_question: $(
    "main.poll-container_main>section, main.poll-container_main>hr"
  ),
  poll_container_main: $("main.poll-container_main")[0],
  user_form_container: "section.user-form_container",
};

const poll_component = () => {};

//PRINTS THE QUESTION TEXT THE QUESTION CONTAINER ELEMENT
const print_data = (question_text) => {
  $("div#question_text>span").html(question_text.text);
  $("div.question-item-info.sort>span").html(
    `item no. <span>${question_text.sort}</span>`
  );
  survey_navi_btn_check(question_text);
};

//INITIATES ALL OF THE CORE FUNCTIONS OF THE POLL SURVEY FUNCTIONALITY
const initiate_survey = (questions_json = JSON) => {
  print_data(questions_json[question_item]);

  const ask_w_answ_arr = {};

  let answer = "";

  let user_form = {
    in_use: false,
    input_data: null,
    requested: false,
  };

  const count = Object.keys(questions_json).length;
  $("div.question-item-info.total>span").html(
    `total items: <span>${count}</span>`
  );

  survey_btn_listeners();

  //ADDS A NEW ANSWER TO QUESTION OBJECT TO THE GLOBALLY DECLARED OBJECT
  const submit_poll = (question_index) => {
    const data = $("form#qualit-answer").serialize();
    answer = data.split("=")[1];
    ask_w_answ_arr[question_index] = {
      text: questions_json[question_index].text,
      sort: questions_json[question_index].sort,
      id: questions_json[question_index].id,
      answ: answer,
    };
  };

  const ans_snapshot = () => {
    $("textarea#id_answer").val(
      ask_w_answ_arr[question_item].answ.replace(/(%20)/g, " ")
    );
  };

  // SHOWS THE USER FORM BY FIRST REQUESTING ON THE FORM HTML. IF THE USER WENT
  // TO PREVIOUS SLIDE (TO THE QUESTION) AND DECIDED TO GO BACK, IT THEN JUST ONLY
  // SHOW THE HTML FORM HIDDEN THROUGH display:none
  const user_data_form_show = async () => {
    const height = $(html_elems.poll_container_main).css("height");
    if (!user_form.requested) {
      response = await api_get_req({
        api_link: [api.type.user, api.subtype.form],
        accept: api.accept.html,
      });
      html = await response.text();
      user_form.requested = true;
      setTimeout(() => {
        $(html_elems.poll_container_main)
          .addClass("is-user-form")
          .css({ "min-height": height }).append(`
          <section class="user-form_container" style="opacity:0">
          ${html}
          </section>
          `);
        $("form#user-form").css({ height: `calc(${height} - 0.6rem)` });
        setTimeout(() => {
          $("section.user-form_container").css({
            opacity: 1,
          });
        }, 200);
      }, 230);
    } else {
      $(html_elems.poll_container_main)
        .addClass("is-user-form")
        .css({ "min-height": height });
      $("section.user-form_container").css({
        display: "block",
      });
      setTimeout(() => {
        $("section.user-form_container").css({
          opacity: 1,
        });
      }, 200);
    }
    $(html_elems.likert_and_question).css({
      opacity: 0,
      transition: "all 200ms ease-out",
    });
    user_form.in_use = true;
  };

  const user_data_form_hide = (flow = "") => {
    user_form.in_use = false;

    const change_panel = () => {
      if (flow === "prev") {
        setTimeout(() => {
          $(html_elems.poll_container_main)
            .attr("style", "")
            .removeClass("is-user-form");
          $(html_elems.user_form_container).css({ display: "none" });
          setTimeout(() => {
            $(html_elems.likert_and_question).css("transition", "");
          }, 200);
          $(html_elems.likert_and_question).css("opacity", "1");
        }, 150);
        $(html_elems.user_form_container).css({ opacity: 0 });
      } else {
        setTimeout(() => {
          $(html_elems.poll_container_main)
            .attr("style", "")
            .removeClass("is-user-form")
            .addClass("is-question-form");
          $(html_elems.user_form_container).css({ display: "none" });
          setTimeout(() => {
            $(html_elems.user_form_container).css("transition", "");
            $("section.misc-message_container").css("opacity", "1");
          }, 100);
          $("section.misc-message_container").css("display", "block");
        }, 150);
        $(html_elems.user_form_container).css({ opacity: 0 });
      }
    };

    if (flow === "prev") {
      change_panel();
    } else if (flow === "next") {
      if (
        user_form.input_data.first_name &&
        user_form.input_data.last_name &&
        user_form.input_data.birthday
      ) {
        (async () => {
          response = await api_get_req({
            api_link: [api.type.misc, api.type.message, "farewell"],
            accept: api.accept.html,
          });
          html = await response.text();
          $(html_elems.poll_container_main).append(`
        <section class="misc-message_container" style="opacity: 0; display:none">${html}</section>
        `);
          change_panel();
        })();
      } else {
        $("form#user-form>fieldset>div.input_container").each(function (
          index,
          element
        ) {
          const child_elem = $(element).children("input");
          if (child_elem.val() === "") {
            child_elem.attr("valid", "true");
          } else {
            child_elem.removeAttr("valid");
          }
        });
        setTimeout(() => {
          $("form#user-form>fieldset>div.input_container").removeClass("pulse");
        }, 200);
        $("form#user-form>fieldset>div.input_container").addClass("pulse");
      }
    } else {
      throw `Invalid Argument for function user_data_form_hide("${flow}").
      Use only two arguments, "prev" and "next".`;
    }
  };

  //EVENT LISTENERS FOR BOTH THE BUTTONS. IT CHECKS FIRST WHETHER THE HTML FORM IS
  //DISPLAYED, IF IT'S NOT, THE PROPGRAM CALLS THE FUNCTION THAT ADDS NEW SURVEY ANSWERS
  //TO AN OBJECT, ELSE, IT JUST IGNORES THE FUNCTION ITSELF. IT THEN TURNS OFF THE CHECKED
  //STATUSES OF THE RADIO BUTTONS WHICH ALSO AFFECTS THE DESIGN OF THE PROXY BUTTONS ITSELF
  //DONE THROUGH A SELECTOR SPECIFIC STYLESHEET. IT THEN CHECKS IF THE USER HAS AN ANSWER OR
  //NOT, THE PROGRAM WON'T ALLOW THE USER TO PROCEED OR PRECEED TO UPCOMING IF THERE'S NO CHOSEN
  //ANSWER.
  $("div.poll-navi-btns_container").click((e) => {
    if (!user_form.in_use) submit_poll(question_item);
    else {
      user_form.input_data = {
        first_name: $("form#user-form>fieldset>div.first-name>input").val(),
        last_name: $("form#user-form>fieldset>div.last-name>input").val(),
        birthday: $("form#user-form>fieldset>div.birth-date>input").val(),
      };
      console.log(user_form.input_data);
    }
    $("textarea#id_answer").val("");
    if (!answer && $(e.target).is(".right")) {
      setTimeout(() => {
        $("textarea#id_answer").removeClass("pulse");
      }, 200);
      $("textarea#id_answer").addClass("pulse");
    }
  });

  //EVENT LISTENER FOR THE RIGHT-SIDE BUTTON. IT ACCESSES THE JSON OF QUESTIONS FROM THE SERVER
  //AND TRAVERSES THROUGH THE JSON UPWARDS. IT ALSO CHECKS IF THE USER HAS AN ANSWER OR NOT. THIS
  //IS WHERE THE ans_snapshot() and user_data_form_show() COMES TO PLAY. WHEN IT'S TRYING TO
  //TRAVERSE IN THE JSON, IT FIRST CHECKS WHETHER THE UPCOMING QUESTION HAS AN ANSWER OR NOT,
  //IF NOT, IT JUST ACCESSES THE JSON ARRAY OF QUESTIONS THAT CAME FROM THE SERVER, ELSE,
  //IT JUST ACCESSES THE INDEX OF THE UPCOMING ANSWER FROM THE ANSWER WITH QUESTION ARRAY.
  $("div.poll-navi-btns_container.right:not([state='submit']").click((e) => {
    if (user_form.in_use) {
      user_data_form_hide("next");
    }
    if (answer) {
      if (question_item != count) {
        print_data(
          ask_w_answ_arr[++question_item]
            ? ask_w_answ_arr[question_item]
            : questions_json[question_item]
        );
        if (ask_w_answ_arr[question_item]) ans_snapshot();
      } else {
        user_data_form_show();
      }
    }
  });

  //EVENT LISTENER FOR THE LEFT-SIDE BUTTON. IT ALSO ACCESSES THE JSON ARRAYS LIKELY TO WHAT THE
  //RIGHT-SIDE BUTTON IS PROGRAMMED TO DO. BUT, THIS EVENT LISTENERS ALWAYS CHECKS IF THE HTML FORM
  //IS IN USE OR NOT, IF IT IS, IT THEN ADDS A NEW OBJECT TO THE OBJECT DECLARED ON THE UPPER PART
  //OF THE CODE, IF IT'S NOT, IT JUST PROCEEDS TO THE NORMAL FUNCTION LIKE THE RIGHT-SIDE BUTTON DOES.
  $("div.poll-navi-btns_container.left").click((e) => {
    if (user_form.in_use) {
      user_data_form_hide("prev");
    } else {
      print_data(
        ask_w_answ_arr[--question_item]
          ? ask_w_answ_arr[question_item]
          : questions_json[question_item]
      );
    }
    if (ask_w_answ_arr[question_item]) ans_snapshot();
  });
};
const survey_btn_listeners = () => {
  $(' div.scale-items_container > input[type="button"]')
    .on({
      mouseenter: (e) => {
        $(e.currrentTarget).off("mouseleave");
        const timer = setTimeout(() => {
          $(e.currentTarget).addClass("hover-state-one hover-state-two");
          $(e.currentTarget).on("mouseleave", (e1) => {
            $(e1.currentTarget).removeClass("hover-state-two");
            setTimeout(() => {
              $(e1.currentTarget)
                .removeClass("hover-state-one")
                .off("mouseleave");
            }, 300);
          });
        }, 120);
        $(e.currentTarget).on("mouseleave", (e) => {
          clearTimeout(timer);
          $(e.currentTarget).off("mouseleave");
        });
      },
    })
    .click((e) => {
      const radio_btn = $(e.target).prev()[0];
      if ($(radio_btn).is(":checked")) $(radio_btn).prop("checked", false);
      else $(radio_btn).prop("checked", true);
    });
};
