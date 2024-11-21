from django.shortcuts import render, get_object_or_404, redirect
from .models import Employee
from .forms import EmployeeForm
from django.http import HttpResponseForbidden
from django.views.decorators.http import require_GET, require_POST, require_http_methods

# View to list all employees
@require_GET  # Only GET method is allowed for this view
def employee_list(request):
    employees = Employee.objects.all()
    return render(request, 'employees/employee_list.html', {'employees': employees})

# View to view details of a single employee
@require_GET  # Only GET method is allowed for this view
def employee_detail(request, pk):
    employee = get_object_or_404(Employee, pk=pk)
    return render(request, 'employees/employee_detail.html', {'employee': employee})

# Common function to handle form display and save for create/update
def handle_employee_form(request, form, action, employee=None):
    if request.method == "POST":
        if form.is_valid():
            form.save()
            return redirect('employee_list')
        else:
            print(form.errors)  # For debugging form errors
    elif request.method == "GET":
        return render(request, 'employees/employee_form.html', {
            'form': form, 
            'action': action, 
            'employee': employee
        })
    else:
        return HttpResponseForbidden("Forbidden: Only POST and GET methods are allowed.")

# View to create a new employee
@require_http_methods(["GET", "POST"])  # Only allow GET and POST methods
def employee_create(request):
    if request.method == "POST":
        form = EmployeeForm(request.POST)
    else:
        form = EmployeeForm()  # Empty form for GET request
    return handle_employee_form(request, form, 'Add Employee')

# View to update an existing employee
@require_http_methods(["GET", "POST"])  # Only allow GET and POST methods
def employee_update(request, pk):
    employee = get_object_or_404(Employee, pk=pk)
    if request.method == "POST":
        form = EmployeeForm(request.POST, instance=employee)
    else:
        form = EmployeeForm(instance=employee)
    return handle_employee_form(request, form, 'Update Employee', employee)

# View to delete an employee
@require_POST  # Only allow POST method for deletion
def employee_delete(request, pk):
    employee = get_object_or_404(Employee, pk=pk)
    employee.delete()
    return redirect('employee_list')

# Safeguard against accessing the delete confirmation page using GET method
@require_GET  # Only GET method is allowed to show confirmation
def employee_delete_confirm(request, pk):
    employee = get_object_or_404(Employee, pk=pk)
    return render(request, 'employees/employee_confirm_delete.html', {'employee': employee})
