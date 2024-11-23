from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponseForbidden
from django.views.decorators.http import require_GET, require_POST, require_http_methods
from .models import Employee
from .forms import EmployeeForm

# Helper function to handle employee form logic
def handle_employee_form(request, form, action, employee=None):
    if request.method == "POST":
        if form.is_valid():
            form.save()
            return redirect('employee_list')  # Redirect to the employee list after successful save
        else:
            print(form.errors)  # For debugging purposes (replace with logging in production)
    return render(request, 'employees/employee_form.html', {
        'form': form,
        'action': action,
        'employee': employee
    })

# View to create a new employee
@require_http_methods(["GET", "POST"])  # Only allow GET and POST methods
def employee_create(request):
    """
    Create a new employee. Displays a form for GET and processes the form for POST.
    """
    if request.method == "POST":
        form = EmployeeForm(request.POST)
    else:
        form = EmployeeForm()  # Display an empty form for GET requests
    return handle_employee_form(request, form, 'Add Employee')

# View to update an existing employee
@require_http_methods(["GET", "POST"])  # Only allow GET and POST methods
def employee_update(request, pk):
    """
    Update an existing employee. Displays a pre-filled form for GET and processes the form for POST.
    """
    employee = get_object_or_404(Employee, pk=pk)
    if request.method == "POST":
        form = EmployeeForm(request.POST, instance=employee)
    else:
        form = EmployeeForm(instance=employee)  # Pre-fill the form with existing employee data
    return handle_employee_form(request, form, 'Update Employee', employee)

# View to delete an employee
@require_POST  # Only allow POST method for deletion
def employee_delete(request, pk):
    """
    Deletes an employee record. Only accessible via POST for security reasons.
    """
    employee = get_object_or_404(Employee, pk=pk)
    employee.delete()
    return redirect('employee_list')  # Redirect to the employee list after deletion
