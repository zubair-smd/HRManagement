from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.views.decorators.http import require_http_methods, require_POST, require_GET, require_safe
from django.core.exceptions import PermissionDenied
from django.db import transaction
from .models import Employee
from .forms import EmployeeForm
import logging

logger = logging.getLogger(__name__)

@login_required
@require_safe
def employee_list(request):
    """View to display list of employees."""
    try:
        employees = Employee.objects.all().order_by('name')
        return render(request, 'employees/employee_list.html', {'employees': employees})
    except Exception as e:
        logger.error(f"Error fetching employee list: {str(e)}")
        messages.error(request, "Unable to fetch employee list. Please try again.")
        return redirect('employees:employee_list')  # Updated

@login_required
@require_GET
def employee_create_form(request):
    """View to display the employee creation form."""
    try:
        form = EmployeeForm()
        return render(request, 'employees/employee_form.html', {
            'form': form,
            'action': 'Add'
        })
    except Exception as e:
        logger.error(f"Error displaying employee creation form: {str(e)}")
        messages.error(request, "Unable to display employee creation form.")
        return redirect('employees:employee_list')  # Updated

@login_required
@require_POST
def employee_create(request):
    """View to handle employee creation form submission."""
    try:
        form = EmployeeForm(request.POST)
        if form.is_valid():
            with transaction.atomic():
                employee = form.save(commit=False)
                employee.created_by = request.user
                employee.save()
                messages.success(request, 'Employee created successfully.')
                return redirect('employees:employee_list')  # Updated
        else:
            messages.error(request, 'Please correct the errors below.')
            return render(request, 'employees/employee_form.html', {
                'form': form,
                'action': 'Add'
            })
    except Exception as e:
        logger.error(f"Error creating employee: {str(e)}")
        messages.error(request, "An error occurred while creating the employee.")
        return redirect('employees:employee_list')  # Updated

@login_required
@require_GET
def employee_update_form(request, pk):
    """View to display the employee update form."""
    try:
        employee = get_object_or_404(Employee, pk=pk)
        form = EmployeeForm(instance=employee)
        return render(request, 'employees/employee_form.html', {
            'form': form,
            'employee': employee,
            'action': 'Update'
        })
    except Employee.DoesNotExist:
        messages.error(request, "Employee not found.")
        return redirect('employees:employee_list')  # Updated
    except Exception as e:
        logger.error(f"Error displaying update form for employee {pk}: {str(e)}")
        messages.error(request, "Unable to display employee update form.")
        return redirect('employees:employee_list')  # Updated

@login_required
@require_POST
def employee_update(request, pk):
    """View to handle employee update form submission."""
    try:
        employee = get_object_or_404(Employee, pk=pk)
        form = EmployeeForm(request.POST, instance=employee)
        if form.is_valid():
            with transaction.atomic():
                employee = form.save(commit=False)
                employee.updated_by = request.user
                employee.save()
                messages.success(request, 'Employee updated successfully.')
                return redirect('employees:employee_list')  # Updated
        else:
            messages.error(request, 'Please correct the errors below.')
            return render(request, 'employees/employee_form.html', {
                'form': form,
                'employee': employee,
                'action': 'Update'
            })
    except Employee.DoesNotExist:
        messages.error(request, "Employee not found.")
        return redirect('employees:employee_list')  # Updated
    except Exception as e:
        logger.error(f"Error updating employee {pk}: {str(e)}")
        messages.error(request, "An error occurred while updating the employee.")
        return redirect('employees:employee_list')  # Updated

@login_required
@require_GET
def employee_delete_confirm(request, pk):
    """View to display delete confirmation page."""
    try:
        employee = get_object_or_404(Employee, pk=pk)
        return render(request, 'employees/employee_confirm_delete.html', {
            'employee': employee
        })
    except Employee.DoesNotExist:
        messages.error(request, "Employee not found.")
        return redirect('employees:employee_list')  # Updated
    except Exception as e:
        logger.error(f"Error displaying delete confirmation for employee {pk}: {str(e)}")
        messages.error(request, "Unable to display delete confirmation.")
        return redirect('employees:employee_list')  # Updated

@login_required
@require_POST
def employee_delete(request, pk):
    """View to handle employee deletion."""
    try:
        employee = get_object_or_404(Employee, pk=pk)
        with transaction.atomic():
            employee.delete()
            messages.success(request, 'Employee deleted successfully.')
            return redirect('employees:employee_list')  # Updated
    except Employee.DoesNotExist:
        messages.error(request, "Employee not found.")
        return redirect('employees:employee_list')  # Updated
    except Exception as e:
        logger.error(f"Error deleting employee {pk}: {str(e)}")
        messages.error(request, "An error occurred while deleting the employee.")
        return redirect('employees:employee_list')  # Updated