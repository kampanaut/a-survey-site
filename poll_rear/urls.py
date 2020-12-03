from django.urls import path
from .views import *

app_name = 'Poll Rear'

urlpatterns = [
    path('questions/fetch', QuestionsFetch.as_view(), name="Fetch-Questions"),
    path('users/form/fetch', ParticipantForm.as_view(),
         name="Fetch-Participant-Form"),
    path('misc/questions/vicinity/fetch', Misc.VicinityQuestion.as_view(),
         name="Fetch-Vicinity-Question"),
]
