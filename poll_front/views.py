from django.shortcuts import render
from django.views import View

# Create your views here.

class PollFeed(View):
    template_name = "poll_front/poll-feed.html"

    def get(self, request, *args, **kwargs):
        context={}
        return render(
            request,
            self.template_name,
            context
        )
