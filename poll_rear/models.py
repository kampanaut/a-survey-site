from django.db import models

# Create your models here.


class Participant(models.Model):
    SEX_CHOICES = {
        'M': 'MALE',
        'F': 'FEMALE'
    }
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
    sex = models.CharField(
        max_length=2,
        choices=SEX_CHOICES
    )

    def __str__(self):
        return f"[{self.pk}] {self.first_name} {self.last_name}"


class Question(models.Model):
    question_text = models.CharField(
        'Question Text',
        max_length=300,
        null=False,
        blank=False,
    )
    sort = models.IntegerField(blank=False, null=False)

    def __str__(self):
        return f"[{self.pk}] -> #{self.sort} {self.question_text}"


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

    def __str__(self):
        return f"[{self.pk}] --> {self.participant.first_name} {self.participant.last_name} ({self.participant.pk}) >> {self.question.question_text} ({self.question.pk}) => \"{self.answer[:25]}\""
