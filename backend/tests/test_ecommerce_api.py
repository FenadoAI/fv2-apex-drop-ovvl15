"""Test e-commerce API endpoints"""
import os
import sys
import requests
from dotenv import load_dotenv

# Load environment
load_dotenv("/workspace/repo/backend/.env")

BASE_URL = "https://8001-izs9fxeionvs283nc7acn.e2b.app/api"


def test_create_product():
    """Test creating a product"""
    print("Testing product creation...")

    product_data = {
        "name": "Air Jordan 1 Retro High OG",
        "description": "The Air Jordan 1 Retro High OG remakes the classic sneaker, giving you a fresh look with a familiar feel.",
        "price": 299.99,
        "images": [
            "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800",
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"
        ],
        "category": "sneakers",
        "color": "black",
        "sizes": [
            {"size": "8", "stock": 10},
            {"size": "9", "stock": 15},
            {"size": "10", "stock": 20},
            {"size": "11", "stock": 12},
            {"size": "12", "stock": 8}
        ],
        "featured": True
    }

    response = requests.post(f"{BASE_URL}/products", json=product_data)
    print(f"Status: {response.status_code}")

    if response.status_code == 200:
        product = response.json()
        print(f"✓ Product created: {product['name']} (ID: {product['id']})")
        return product["id"]
    else:
        print(f"✗ Failed to create product: {response.text}")
        return None


def test_get_products():
    """Test getting all products"""
    print("\nTesting get products...")

    response = requests.get(f"{BASE_URL}/products")
    print(f"Status: {response.status_code}")

    if response.status_code == 200:
        products = response.json()
        print(f"✓ Retrieved {len(products)} products")
        return products
    else:
        print(f"✗ Failed to get products: {response.text}")
        return []


def test_get_featured_products():
    """Test filtering featured products"""
    print("\nTesting featured products filter...")

    response = requests.get(f"{BASE_URL}/products?featured=true")
    print(f"Status: {response.status_code}")

    if response.status_code == 200:
        products = response.json()
        print(f"✓ Retrieved {len(products)} featured products")
        for p in products:
            if not p["featured"]:
                print(f"✗ Non-featured product in results: {p['name']}")
                return False
        return True
    else:
        print(f"✗ Failed to get featured products: {response.text}")
        return False


def test_drops_subscription():
    """Test subscribing to drops"""
    print("\nTesting drops subscription...")

    subscriber_data = {
        "email": "sneakerhead@example.com"
    }

    response = requests.post(f"{BASE_URL}/drops/subscribe", json=subscriber_data)
    print(f"Status: {response.status_code}")

    if response.status_code == 200:
        subscriber = response.json()
        print(f"✓ Subscribed: {subscriber['email']}")
        return True
    else:
        print(f"✗ Failed to subscribe: {response.text}")
        return False


def test_cart_operations(product_id):
    """Test cart add, get, and remove"""
    print("\nTesting cart operations...")

    # Add to cart
    cart_data = {
        "user_id": "test_user_123",
        "product_id": product_id,
        "size": "10",
        "quantity": 2
    }

    response = requests.post(f"{BASE_URL}/cart/add", json=cart_data)
    print(f"Add to cart status: {response.status_code}")

    if response.status_code != 200:
        print(f"✗ Failed to add to cart: {response.text}")
        return None

    cart_item = response.json()
    print(f"✓ Added to cart: {cart_item['id']}")

    # Get cart
    response = requests.get(f"{BASE_URL}/cart/test_user_123")
    print(f"Get cart status: {response.status_code}")

    if response.status_code == 200:
        cart = response.json()
        print(f"✓ Cart has {len(cart)} items")

        if len(cart) > 0:
            item_data = cart[0]
            print(f"  - {item_data['product']['name']}, Size: {item_data['cart_item']['size']}, Qty: {item_data['cart_item']['quantity']}")
    else:
        print(f"✗ Failed to get cart: {response.text}")

    return cart_item["id"]


def test_remove_from_cart(cart_item_id):
    """Test removing item from cart"""
    print("\nTesting remove from cart...")

    response = requests.delete(f"{BASE_URL}/cart/{cart_item_id}")
    print(f"Status: {response.status_code}")

    if response.status_code == 200:
        print("✓ Item removed from cart")
        return True
    else:
        print(f"✗ Failed to remove from cart: {response.text}")
        return False


def main():
    """Run all e-commerce API tests"""
    print("=" * 60)
    print("E-COMMERCE API TESTS")
    print("=" * 60)

    # Create product
    product_id = test_create_product()

    if not product_id:
        print("\n✗ Cannot continue tests without product ID")
        sys.exit(1)

    # Get all products
    products = test_get_products()

    if len(products) == 0:
        print("\n✗ No products returned")
        sys.exit(1)

    # Filter featured products
    test_get_featured_products()

    # Test drops subscription
    test_drops_subscription()

    # Test cart operations
    cart_item_id = test_cart_operations(product_id)

    if cart_item_id:
        test_remove_from_cart(cart_item_id)

    print("\n" + "=" * 60)
    print("ALL TESTS COMPLETED")
    print("=" * 60)


if __name__ == "__main__":
    main()
