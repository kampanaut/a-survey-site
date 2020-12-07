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
        questions = Question.objects.order_by('-sort')
        questions_dict = dict()
        questions_arr = list()
        question_tup = tuple()
        context = {
            'questions': questions
        }

        print(questions)

        for a_question in questions:
            questions_dict.update({
                a_question.id: {
                    "text": a_question.question_text,
                    "sort": a_question.sort,
                    "id": a_question.id
                }
            })

        return JsonResponse({
            'questions': questions_dict
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

    farewell_message = """Hey guys thanks for joining us, see you again soon, maybe. Goodbye"""

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

    class FarewellMsg(View):
        template_name = "poll_rear/misc/farewell-goodbye.html"

        def get(self, request, *args, **kwargs):

            context = {'message': Misc.farewell_message}

            return render(
                request,
                self.template_name,
                context,
                status=200
            )
