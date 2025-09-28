from django.contrib import admin
from django.urls import path
from store import views
from django.conf import settings              
from django.conf.urls.static import static   


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('all-products/', views.all_products, name='all_products'),
    path('login/', views.login_page, name='login'),
    path('signup/', views.signup_page, name='signup'),
    path('checkout/', views.checkout, name='checkout'),
    path('product/<int:product_id>/', views.product_detail, name='product_detail'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)