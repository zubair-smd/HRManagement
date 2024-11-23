from django import forms
from .models import Employee

class EmployeeForm(forms.ModelForm):
    class Meta:
        model = Employee
        fields = ['name', 'department', 'position', 'hire_date', 'email']
        widgets = {
            'hire_date': forms.DateInput(attrs={'type': 'date'}),
        }