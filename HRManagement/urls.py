from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from employees.views import CustomLoginView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('logout/', include('employees.urls')),  # Fixing the URLs path
    path('', RedirectView.as_view(url='/login/', permanent=True)),  # Redirect to login
]
