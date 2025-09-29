from django.shortcuts import render
from .models import Product
from django.http import JsonResponse
from django.core.serializers import serialize
import json
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth import logout
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login


def home(request):
    on_sale_products = Product.objects.filter(old_price__isnull=False)
    computer_products = Product.objects.filter(category='Computer')
    
    context = {
        'on_sale_products': on_sale_products,
        'computer_products': computer_products,
    }
    return render(request, 'index.html', context)

def all_products(request):
    products = Product.objects.all()
    categories = Product.objects.values_list('category', flat=True).distinct()
    brands = Product.objects.values_list('brand', flat=True).distinct()
    
    context = {
        'products': products,
        'categories': categories,
        'brands': brands,
    }
    return render(request, 'all_products.html', context)

def product_detail(request, product_id):
    product = Product.objects.get(id=product_id)
    context = {'product': product}
    return render(request, 'item.html', context)

def login_page(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            messages.success(request, f'Welcome!, {username}!')
            return redirect('home') 
        else:
            messages.error(request, 'Invalid username or password.')
            return redirect('login')
    return render(request, 'login.html')

def signup_page(request):
    return render(request, 'signup_page.html')

@login_required(login_url='login')
def checkout_page(request):
    return render(request, 'checkout.html')

def product_api(request):
    products = Product.objects.all()
    products_json = serialize('json', products)
    return JsonResponse(json.loads(products_json), safe=False)

def signup_page(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        password2 = request.POST.get('password2')
        if password != password2:
            messages.error(request, 'Passwords dont match!')
            return redirect('signup')
        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists!!')
            return redirect('signup')
        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()
        messages.success(request, 'Account created successfully! Log in.')
        return redirect('login')
    return render(request, 'signup_page.html')

def logout_user(request):
    logout(request)
    messages.success(request, 'You have logged out of your account.')
    return redirect('home')