from django.contrib import admin

from checkout_kata.models import Product, Offer, Cart


admin.site.register(Product)
admin.site.register(Offer)
admin.site.register(Cart)