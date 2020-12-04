from django.db import models

# Create your models here.


class Participant(models.Model):
    first_name = models.CharField(
        'First Name',
        max_length=70,
        null=False,
        blank=False,
    )
    last_name = models.CharField(
        'Last Name',
        max_length=70,
        null=False,
        blank=False,
    )
    birthday = models.DateField(
        'Birth day',
        blank=True,
        auto_now=False,
        auto_now_add=False
    )

    def __str__(self):
        return self.first_name + " " + self.last_name


class Question(models.Model):
    question_text = models.CharField(
        'Question Text',
        max_length=300,
        null=False,
        blank=False,
    )
    sort = models.IntegerField(blank=False, null=False)

    def __str__(self):
        return self.question_text


class Answer(models.Model):
    class AnswerChoices(models.IntegerChoices):
        STRONGLY_DISAGREE = 1
        DISAGREE = 2
        UNDECIDED = 3
        AGREE = 4
        STRONGLY_AGREE = 5

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
    answer = models.IntegerField(
        choices=AnswerChoices.choices,
        null=False,
        blank=True,
    )

    def __str__(self):
        return f"{self.participant.first_name} {self.participant.last_name} >> {self.question.question_text} => ({self.answer})"