from django.contrib import admin
from .models import *

# Register your models here.


class AdminStyleUtils(object):
    class ParticipantStyle():
        def combine_name(instance):
            return f"""{instance.first_name} {instance.last_name}"""

        class AnswerInline(admin.StackedInline):
            model = Answer
            extra = 0

    class AnswerStyle():
        def return_obj_identifier(instance):
            return instance.__str__()

        def return_date_created(instance):
            return instance.date_created


class QuestionAdminStyle(admin.ModelAdmin):
    fields = ['sort', 'question_text']
    list_display = ('question_text', 'sort')


class ParticipantAdminStyle(admin.ModelAdmin):
    AdminStyleUtils.ParticipantStyle.combine_name.short_description = 'Full Name'
    list_display = (AdminStyleUtils.ParticipantStyle.combine_name,
                    'last_name', "first_name", 'birthday', 'sex', 'date_created', 'date_modified', 'id')
    readonly_fields = ['date_modified', 'date_created']
    fieldsets = ([
        ('Main Details', {
            'fields': [
                'first_name',
                'last_name',
                'birthday',
                'sex',
                'date_created',
                'date_modified',
            ],
        }
        ),
    ])

    inlines = [AdminStyleUtils.ParticipantStyle.AnswerInline]


class AnswerAdminStyle(admin.ModelAdmin):
    AdminStyleUtils.AnswerStyle.return_obj_identifier.short_description = 'Details'
    AdminStyleUtils.AnswerStyle.return_date_created.short_description = 'Date Created'
    list_display = [AdminStyleUtils.AnswerStyle.return_obj_identifier,
                    'id', AdminStyleUtils.AnswerStyle.return_date_created, 'date_modified', 'participant', 'question', 'answer']
    readonly_fields = ['date_created', 'date_modified']
    fieldsets = (
        [
                ('Main Details', {
                    'fields': [
                        'participant',
                        'question',
                        'answer',
                        'date_created',
                        'date_modified'
                    ]
                }
                )
        ]
    )


admin.site.register(Participant, ParticipantAdminStyle)
admin.site.register(Question, QuestionAdminStyle)
admin.site.register(Answer, AnswerAdminStyle)
