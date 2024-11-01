from django.db import models

# Create your models here.


class Participant(models.Model):
    from datetime import datetime

    class Sex(models.TextChoices):
        MALE = 'M', 'MALE'
        FEMALE = 'F', 'FEMALE'
    first_name = models.CharField(
        'First Name & Middle Name',
        max_length=70,
        null=False,
        blank=False,
    )
    last_name = models.CharField(
        'Family Name',
        max_length=70,
        null=False,
        blank=False,
    )
    birthday = models.DateField(
        'Birthday',
        blank=True,
        auto_now=False,
        auto_now_add=False
    )
    sex = models.CharField(
        max_length=2,
        choices=Sex.choices,
        null=False
    )
    date_created = models.DateTimeField(
        'Date Created | Date Submitted ',
        auto_now_add=True,
        # default=datetime.now(),
        null=False,
        blank=False
    )

    date_modified = models.DateTimeField(
        'Date Modified',
        auto_now=True,
        null=False,
        blank=False,
    )

    def __str__(self):
        return f"[{self.pk}] {self.first_name} {self.last_name}"


class Question(models.Model):
    question_text = models.TextField(
        'Question Text',
        max_length=300,
        null=False,
        blank=False,
    )
    sort = models.IntegerField(blank=False, null=False)

    def __str__(self):
        # return f"{self.sort}. {self.question_text[:50] + '...' if len(self.question_text) > 50 else self.question_text } [{self.pk}]"
        return f"{self.sort}. {self.question_text}  [{self.pk}]"


class Answer(models.Model):

    participant = models.ForeignKey(
        Participant,
        related_name="answers",
        on_delete=models.CASCADE,
    )
    question = models.ForeignKey(
        Question,
        related_name="answers",
        on_delete=models.CASCADE,
    )
    answer = models.TextField(
        'Answer',
        max_length=50000,
        null=False,
        blank=False
    )
    date_created = models.DateTimeField(
        'Date Submitted',
        auto_now_add=True,
        null=False,
        blank=False,
    )
    date_modified = models.DateTimeField(
        'Date Modified',
        auto_now=True,
        null=False,
        blank=False,
    )

    def __str__(self):
        return f"{self.participant.first_name} {self.participant.last_name} ({self.participant.pk}) -> {self.question.question_text[:25]} [{self.question.pk}] >> \"{ self.answer[:25] + '...' if len(self.answer) >= 25 else self.answer }\""
