from django.shortcuts import render
from .models import Product

def home(request):
    products = Product.objects.all()
    context = {'products': products}
    return render(request, 'index.html', context)

def all_products(request):
    products = Product.objects.all()
    context = {'products': products}
    return render(request, 'all_products.html', context)

def login_page(request):
    return render(request, 'login.html')

def signup_page(request):
    return render(request, 'signup_page.html')

def checkout(request):
    return render(request, 'checkout.html')

def product_detail(request, product_id):
    product = Product.objects.get(id=product_id)
    context = {'product': product}
    return render(request, 'item.html', context)