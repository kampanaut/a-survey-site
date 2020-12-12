from django.contrib import admin
from .models import *

# Register your models here.


class QuestionAdminForm(admin.ModelAdmin):
    fields = ['sort', 'question_text']


admin.site.register(Participant)
admin.site.register(Question, QuestionAdminForm)
admin.site.register(Answer)
