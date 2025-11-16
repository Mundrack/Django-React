from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/', include('authentication.urls')),
    path('api/', include('companies.urls')),
    path('api/', include('audits.urls')),
]