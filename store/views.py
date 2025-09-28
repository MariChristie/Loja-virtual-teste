from django.shortcuts import render
from .models import Product

def home(request):
    on_sale_products = Product.objects.filter(old_price__isnull=False)
    computer_products = Product.objects.filter(category='Computer')
    phone_products = Product.objects.filter(category='Phones')

    context = {
        'on_sale_products': on_sale_products,
        'computer_products': computer_products,
        'phone_products': phone_products,
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