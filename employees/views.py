from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required, permission_required
from django.contrib import messages
from django.views.decorators.http import require_http_methods
from django.core.exceptions import PermissionDenied
from django.db import transaction
from .models import Employee
from .forms import EmployeeForm
import logging

logger = logging.getLogger(__name__)

@login_required
@require_http_methods(["GET"])
def employee_list(request):
    try:
        employees = Employee.objects.all().order_by('name')
        return render(request, 'employees/employee_list.html', {'employees': employees})
    except Exception as e:
        logger.error(f"Error fetching employee list: {str(e)}")
        messages.error(request, "Unable to fetch employee list. Please try again.")
        return redirect('home')

@login_required
@require_http_methods(["GET", "POST"])
def employee_create(request):
    try:
        if request.method == 'POST':
            form = EmployeeForm(request.POST)
            if form.is_valid():
                with transaction.atomic():
                    employee = form.save(commit=False)
                    employee.created_by = request.user
                    employee.save()
                    messages.success(request, 'Employee created successfully.')
                    return redirect('employee_list')
            else:
                messages.error(request, 'Please correct the errors below.')
        else:
            form = EmployeeForm()
        
        return render(request, 'employees/employee_form.html', {
            'form': form,
            'action': 'Add'
        })
    except Exception as e:
        logger.error(f"Error creating employee: {str(e)}")
        messages.error(request, "An error occurred while creating the employee.")
        return redirect('employee_list')

@login_required
@require_http_methods(["GET", "POST"])
def employee_update(request, pk):
    try:
        employee = get_object_or_404(Employee, pk=pk)
        
        if request.method == 'POST':
            form = EmployeeForm(request.POST, instance=employee)
            if form.is_valid():
                with transaction.atomic():
                    employee = form.save(commit=False)
                    employee.updated_by = request.user
                    employee.save()
                    messages.success(request, 'Employee updated successfully.')
                    return redirect('employee_list')
            else:
                messages.error(request, 'Please correct the errors below.')
        else:
            form = EmployeeForm(instance=employee)
        
        return render(request, 'employees/employee_form.html', {
            'form': form,
            'employee': employee,
            'action': 'Update'
        })
    except Employee.DoesNotExist:
        messages.error(request, "Employee not found.")
        return redirect('employee_list')
    except Exception as e:
        logger.error(f"Error updating employee {pk}: {str(e)}")
        messages.error(request, "An error occurred while updating the employee.")
        return redirect('employee_list')

@login_required
@require_http_methods(["GET", "POST"])
def employee_delete(request, pk):
    try:
        employee = get_object_or_404(Employee, pk=pk)
        
        if request.method == 'POST':
            with transaction.atomic():
                employee.delete()
                messages.success(request, 'Employee deleted successfully.')
                return redirect('employee_list')
        
        return render(request, 'employees/employee_confirm_delete.html', {
            'employee': employee
        })
    except Employee.DoesNotExist:
        messages.error(request, "Employee not found.")
        return redirect('employee_list')
    except Exception as e:
        logger.error(f"Error deleting employee {pk}: {str(e)}")
        messages.error(request, "An error occurred while deleting the employee.")
        return redirect('employee_list')