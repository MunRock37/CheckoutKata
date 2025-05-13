from django.db import models
from decimal import ROUND_HALF_UP, Decimal


class Product(models.Model):
    name = models.CharField(max_length=100, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    
    def get_discounted_price(self, quantity):
        """Calculate the total price in cents for a given quantity, considering a single discount."""
        total_price = 0

        # Use getattr to safely access the related 'discount'
        offer = getattr(self, "offer", None)

        if offer and quantity >= offer.quantity:
            sets = quantity // offer.quantity
            remaining_qty = quantity % offer.quantity
            total_price = (sets * offer.offer_price) + (remaining_qty * self.price)
        else:
            total_price = quantity * self.price

        # Convert to cents and round
        total_price_in_cents = Decimal(total_price * 100).quantize(Decimal('1'), rounding=ROUND_HALF_UP)
        return int(total_price_in_cents)


class Offer(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name="offer")
    quantity = models.PositiveIntegerField(default=2)
    offer_price = models.DecimalField(max_digits=10, decimal_places=2)  # Offer price in USD for `quantity`

    def __str__(self):
        return f"{self.product.name} - Buy {self.quantity} for ${self.offer_price}"


class Cart(models.Model):
    items = models.JSONField(default=dict)
    total_mrp = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    def get_final_price(self):
        """
        Calculates and updates:
        - total MRP (undiscounted) in USD
        - total price after discounts
        """
        product_names = self.items.keys()
        products = Product.objects.filter(name__in=product_names).select_related("offer")

        total = Decimal("0.00")
        total_mrp = Decimal("0.00")

        for product in products:
            quantity = self.items.get(product.name, 0)
            total_mrp += product.price * quantity
            total += Decimal(product.get_discounted_price(quantity)) / 100  # convert cents to dollars

        self.total_price = total
        self.total_mrp = total_mrp
        self.save(update_fields=["total_price", "total_mrp"])

        return {
            "total_price": round(self.total_price, 2),
            "total_mrp": round(self.total_mrp, 2),
        }
        

    def __str__(self):
        return f"Cart {self.pk} - Your total ${self.total_price}"
