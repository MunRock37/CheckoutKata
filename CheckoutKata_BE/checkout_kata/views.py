from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from checkout_kata.models import Offer, Product, Cart
from checkout_kata.serializers import CartSerializer, OfferSerializer, ProductSerializer


class ProductView(APIView):
    def get(self, request, pk=None):
        """
        Retrieve all products or a specific product by ID
        """

        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """
        Create a new product
        """
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """
        Delete a product by its ID
        """
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        product.delete()
        return Response({"message": "Product deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class OfferView(APIView):
    def get(self, request, pk):
        try:
            discount = Offer.objects.get(pk=pk)
        except Offer.DoesNotExist:
            return Response({"error": "Offer not available"}, status=status.HTTP_404_NOT_FOUND)
        return Response(OfferSerializer(discount).data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = OfferSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            # Log the errors to see what's wrong
            print(serializer.errors)  # Add this line to log errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def patch(self, request, pk):
        try:
            offer = Offer.objects.get(pk=pk)
        except Offer.DoesNotExist:
            return Response({"error": "Offer not available"}, status=status.HTTP_404_NOT_FOUND)
        serializer = OfferSerializer(offer, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            discount = Offer.objects.get(pk=pk)
        except Offer.DoesNotExist:
            return Response({"error": "Offer not available"}, status=status.HTTP_404_NOT_FOUND)
        discount.delete()
        return Response({"message": "Offer deleted successfully"}, status=status.HTTP_200_OK)


class CartView(APIView):
    def get(self, request):
        """
        Get the current cart
        """
        carts = Cart.objects.all()
        serializer = CartSerializer(carts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """
        Add an item to the cart or update quantity
        """
        cart, _ = Cart.objects.get_or_create(id=1)
        product_name = request.data.get("product_name")
        quantity = int(request.data.get("quantity", 1))

        if not product_name:
            return Response({"error": "Product name is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            Product.objects.get(name=product_name)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        if cart.items is None:
            cart.items = {} 
            
        if product_name in cart.items:
            cart.items[product_name] += quantity
        else:
            cart.items[product_name] = quantity

        cart.get_final_price()
        cart.save()
        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)

    def put(self, request):
        """
        Update the quantity of an item in the cart
        """
        cart, _ = Cart.objects.get_or_create(id=1)
        product_name = request.data.get("product_name")
        new_quantity = int(request.data.get("quantity", 1))

        if not product_name:
            return Response({"error": "Product name is required"}, status=status.HTTP_400_BAD_REQUEST)

        if product_name not in cart.items:
            return Response({"error": "Product not in cart"}, status=status.HTTP_404_NOT_FOUND)

        if new_quantity <= 0:
            del cart.items[product_name]
        else:
            cart.items[product_name] = new_quantity

        cart.get_final_price()
        cart.save()
        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)

    def delete(self, request):
        """
        Remove an item from the cart or clear the entire cart
        """
        cart, _ = Cart.objects.get_or_create(id=1)
        product_name = request.data.get("product_name")

        if product_name:
            if product_name not in cart.items:
                return Response({"error": "Product not in cart"}, status=status.HTTP_404_NOT_FOUND)

            del cart.items[product_name]
        else:
            cart.items = {}

        cart.get_final_price()
        cart.save()
        return Response({"message": "Cart updated successfully"}, status=status.HTTP_200_OK)
