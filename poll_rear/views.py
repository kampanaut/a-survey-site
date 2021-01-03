from django.shortcuts import render
from django.views import View
from .models import *
from django.template.loader import render_to_string
from django.http import HttpResponse, JsonResponse
from poll_front.forms import *
from django.utils.encoding import uri_to_iri
import json

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


class CoreCRUD(object):
    class Create(object):

        class SurveyCreate(View):
            import urllib.parse as url

            success_template = 'poll_rear/misc/success-panel.html'

            def createParticipant(self):
                user = Participant(
                    first_name=self.User['first_name'], last_name=self.User['last_name'], birthday=self.User['birthday'], sex=self.User['gender'])
                try:
                    user.save()
                    self.User['id'] = user.id
                except Exception as err:
                    return err
                return True

            def createAnswers(self):
                curr_ans = None
                answer = None
                user = Participant.objects.get(pk=self.User['id'])
                for answ_key in self.Answers:
                    curr_ans = self.Answers[answ_key]
                    question = Question.objects.get(pk=curr_ans['id'])
                    answer = Answer(
                        participant=user, question=question, answer=self.url.unquote(curr_ans['answ']))
                    try:
                        answer.save()
                    except Exception as err:
                        return err

                return True

            def post(self, request, *args, **kwargs):
                import datetime
                survey = json.loads(request.body)['post_req']
                self.Answers = json.loads(survey)['answers']
                self.User = json.loads(survey)['user_data']
                createUser = self.createParticipant()
                createAnswers = self.createAnswers()
                context = {
                    'username': self.User,
                    'error': False
                }
                status = 200

                if not createUser == True:
                    context['error'] = True
                    status = 500
                    context['error_cause'] = f"[ERROR] Create User\n{createUser}"

                else:
                    if not createAnswers == True:
                        context['error'] = True
                        status = 500
                        context['error_cause'] = f"[ERROR] Create Answers\n{createAnswers}"

                response_html = render_to_string(
                    self.success_template, context, request=request, )
                response = HttpResponse(response_html, request, status=status)
                response.set_cookie('submitted', 'true', expires=datetime.datetime(
                    2021, 12, 1, 12, 30, 30, 35), httponly=False)
                return response


class Misc(object):

    vicinity_question = "Do you consider your hometown as rural or urban vicinity?"

    farewell_message = """Hey man, you have reached the end, thanks for joining us, see you again soon, maybe. Goodbye"""

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
