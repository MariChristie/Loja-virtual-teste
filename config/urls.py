from django.contrib import admin
from django.urls import path
from store import views 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('all-products/', views.all_products, name='all_products'),
    path('login/', views.login_page, name='login'),
    path('signup/', views.signup_page, name='signup'),
    path('checkout/', views.checkout, name='checkout'),
    path('item/<int:item_id>/', views.item_detail, name='item_detail'),
    

]