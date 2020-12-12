from django.shortcuts import render
from django.views import View

# Create your views here.


class PollFeed(View):
    template_name = "poll_front/poll-feed.html"

    def get(self, request, *args, **kwargs):
        is_visited = request.COOKIES.get('submitted')
        context = {'is_visited': is_visited}
        return render(
            request,
            self.template_name,
            context
        )
