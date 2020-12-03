from django.urls import path, include
from .views import *

app_name = 'Poll Front'

urlpatterns = [
    path('', PollFeed.as_view(), name="Poll-Feed")
]
