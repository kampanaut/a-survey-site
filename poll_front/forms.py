from django import forms
from poll_rear.models import Participant


class UserForm(forms.ModelForm):
    first_name = forms.CharField(max_length=100, widget=forms.TextInput(attrs={
        'placeholder': 'Enter preffered First Name',
        'class': 'user-form-input'
    }))
    last_name = forms.CharField(max_length=100, widget=forms.TextInput(attrs={
        'placeholder': 'Enter Last Name',
        'class': 'user-form-input'
    }))
    birthday = forms.DateField(input_formats=['%Y%m%d'], widget=forms.SelectDateWidget(attrs={
        'class': 'user-form-input'
    }))

    class Meta:
        model = Participant
        fields = [
            'first_name', 'last_name', 'birthday'
        ]
