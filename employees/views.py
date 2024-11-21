from django.shortcuts import render, get_object_or_404, redirect
from .models import Employee
from .forms import EmployeeForm
from django.http import HttpResponseForbidden

# View to list all employees
def employee_list(request):
    if request.method == "GET":  # Only GET method is allowed
        employees = Employee.objects.all()
        return render(request, 'employees/employee_list.html', {'employees': employees})
    return HttpResponseForbidden("Forbidden: Only GET method is allowed.")  # Handle unsafe methods

# View to view details of a single employee
def employee_detail(request, pk):
    if request.method == "GET":  # Only GET method is allowed
        employee = get_object_or_404(Employee, pk=pk)
        return render(request, 'employees/employee_detail.html', {'employee': employee})
    return HttpResponseForbidden("Forbidden: Only GET method is allowed.")  # Handle unsafe methods

# View to create a new employee
def employee_create(request):
    if request.method == "POST":  # Handle POST for form submission
        form = EmployeeForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('employee_list')
        else:
            print(form.errors)  # To debug form errors
    elif request.method == "GET":  # Handle GET to display the empty form
        form = EmployeeForm()
    else:
        return HttpResponseForbidden("Forbidden: Only POST and GET methods are allowed.")
    
    return render(request, 'employees/employee_form.html', {
        'form': form, 
        'action': 'Add Employee', 
        'employee': None
    })

# View to update an existing employee
def employee_update(request, pk):
    employee = get_object_or_404(Employee, pk=pk)
    if request.method == "POST":  # Handle POST for form submission
        form = EmployeeForm(request.POST, instance=employee)
        if form.is_valid():
            form.save()
            return redirect('employee_list')
        else:
            print(form.errors)  # To debug form errors
    elif request.method == "GET":  # Handle GET to display the form with existing data
        form = EmployeeForm(instance=employee)
    else:
        return HttpResponseForbidden("Forbidden: Only POST and GET methods are allowed.")
    
    return render(request, 'employees/employee_form.html', {
        'form': form, 
        'action': 'Update Employee', 
        'employee': employee
    })

# View to delete an employee
def employee_delete(request, pk):
    employee = get_object_or_404(Employee, pk=pk)
    if request.method == "POST":  # Only allow POST method for deletion
        employee.delete()
        return redirect('employee_list')
    elif request.method == "GET":  # Safeguard against unsafe methods
        return render(request, 'employees/employee_confirm_delete.html', {'employee': employee})
    else:
        return HttpResponseForbidden("Forbidden: Only POST method is allowed.")
