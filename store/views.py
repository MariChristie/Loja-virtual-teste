
from django.shortcuts import render

def home(request):
    return render(request, 'index.html')

def all_products(request):
    return render(request, 'all_products.html')

def login_page(request):
    return render(request, 'login.html')

def signup_page(request):
    return render(request, 'signup_page.html')

def checkout(request):
    return render(request, 'checkout.html')

def item_detail(request, item_id):
    return render(request, 'item.html', {'item_id': item_id})

