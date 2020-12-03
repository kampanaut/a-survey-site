from django.shortcuts import render
from django.views import View
from .models import *
from django.template.loader import render_to_string
from django.http import HttpResponse, JsonResponse
from poll_front.forms import *

# Create your views here.


class QuestionsFetch(View):
    template_name = 'poll_front/poll-module.html'

    def get(self, request, *args, **kwargs):
        questions = Question.objects.all()
        questions_arr = list()
        question_tup = tuple()
        context = {
            'questions': questions
        }

        for a_question in questions:
            question_tup = tuple(
                [
                    a_question.pk, tuple(
                        [
                            tuple(
                                ["text", a_question.question_text]
                            ),
                            tuple(
                                ["id", a_question.pk]
                            ),
                            tuple(
                                ["sort", a_question.sort]
                            )
                        ]
                    )
                ]
            )
            questions_arr.append(question_tup)

        question_keys = dict()
        i = 0
        for keypk, data in questions_arr:
            question_keys[keypk] = list()
            for subkey in data:
                question_keys[keypk].append({
                    subkey[0]: subkey[1]
                })

            question_keys[keypk] = {**question_keys[keypk][0], **
                                    question_keys[keypk][1], **question_keys[keypk][2]}

        return JsonResponse({
            'questions': question_keys
        })


class ParticipantForm(View):
    template_name = "poll_rear/forms/user-form.html"

    def get(self, request, *args, **kwargs):
        form = UserForm()
        context = {'form': form}

        return render(
            request,
            self.template_name,
            context
        )


class Misc(object):

    vicinity_question = "Do you consider your hometown as rural or urban vicinity?"

    class VicinityQuestion(View):
        template_name = "poll_rear/misc/misc-question.html"

        def get(self, request, *args, **kwargs):

            context = {
                'question': Misc.vicinity_question
            }
            return render(
                request,
                self.template_name,
                context,
            )
