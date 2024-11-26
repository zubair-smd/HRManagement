from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

app_name = 'employees'

urlpatterns = [
    path('login/', auth_views.LoginView.as_view(template_name='employees/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='employees:login'), name='logout'),
    path('employees/', views.employee_list, name='employee_list'),
    path('employees/create/', views.employee_create_form, name='employee_create_form'),
    path('employees/create/submit/', views.employee_create, name='employee_create'),
    path('employees/<int:pk>/edit/', views.employee_update_form, name='employee_update_form'),
    path('employees/<int:pk>/edit/submit/', views.employee_update, name='employee_update'),
    path('employees/<int:pk>/delete/', views.employee_delete_confirm, name='employee_delete_confirm'),
    path('employees/<int:pk>/delete/submit/', views.employee_delete, name='employee_delete'),
]