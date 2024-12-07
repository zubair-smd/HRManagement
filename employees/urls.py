from django.urls import path
from django.contrib.auth.views import LogoutView
from . import views
from employees.views import CustomLoginView

app_name = 'employees'

urlpatterns = [
    path('', CustomLoginView.as_view(), name='login'),  # Changed to root URL
    path('logout/', LogoutView.as_view(), name='logout'),
    path('employees/', views.employee_list, name='employee_list'),
    path('employees/create/', views.employee_create_form, name='employee_create_form'),
    path('employees/create/submit/', views.employee_create, name='employee_create'),
    path('employees/<int:pk>/edit/', views.employee_update_form, name='employee_update_form'),
    path('employees/<int:pk>/edit/submit/', views.employee_update, name='employee_update'),
    path('employees/<int:pk>/delete/', views.employee_delete_confirm, name='employee_delete_confirm'),
    path('employees/<int:pk>/delete/submit/', views.employee_delete, name='employee_delete'),
]