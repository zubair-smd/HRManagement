from django.urls import path
from . import views

urlpatterns = [
    # path('admin/', admin.site.urls),
    # path('', include('http://127.0.0.1:8000/.urls')),
    path('', views.employee_list, name='employee_list'),
    path('list/', views.employee_list, name='employee_list'),
    path('form/', views.employee_create, name='employee_create'),
    path('form/<int:pk>/', views.employee_update, name='employee_update'),
    path('detail/<int:pk>/', views.employee_detail, name='employee_detail'),
    path('delete/<int:pk>/', views.employee_delete, name='employee_delete'),
]
