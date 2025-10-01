"""FastAPI server exposing AI agent endpoints."""

import logging
import os
import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional

from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, HTTPException, Request
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from starlette.middleware.cors import CORSMiddleware

from ai_agents.agents import AgentConfig, ChatAgent, SearchAgent

try:
    import stripe
    STRIPE_AVAILABLE = True
except ImportError:
    STRIPE_AVAILABLE = False
    logger.warning("Stripe not installed. Payment processing will be unavailable.")


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

ROOT_DIR = Path(__file__).parent


class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class ChatRequest(BaseModel):
    message: str
    agent_type: str = "chat"
    context: Optional[dict] = None


class ChatResponse(BaseModel):
    success: bool
    response: str
    agent_type: str
    capabilities: List[str]
    metadata: dict = Field(default_factory=dict)
    error: Optional[str] = None


class SearchRequest(BaseModel):
    query: str
    max_results: int = 5


class SearchResponse(BaseModel):
    success: bool
    query: str
    summary: str
    search_results: Optional[dict] = None
    sources_count: int
    error: Optional[str] = None


# E-commerce Models
class SizeStock(BaseModel):
    size: str
    stock: int


class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    price: float
    images: List[str]  # URLs to product images
    category: str = "sneakers"
    color: str
    sizes: List[SizeStock]
    featured: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    images: List[str]
    category: str = "sneakers"
    color: str
    sizes: List[SizeStock]
    featured: bool = False


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    images: Optional[List[str]] = None
    category: Optional[str] = None
    color: Optional[str] = None
    sizes: Optional[List[SizeStock]] = None
    featured: Optional[bool] = None


class DropsSubscriber(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    subscribed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class DropsSubscriberCreate(BaseModel):
    email: str


class CartItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    product_id: str
    size: str
    quantity: int = 1
    added_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CartItemCreate(BaseModel):
    user_id: str
    product_id: str
    size: str
    quantity: int = 1


class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    items: List[dict]
    total: float
    status: str = "pending"  # pending, paid, shipped, delivered
    stripe_payment_id: Optional[str] = None
    shipping_address: dict
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class OrderCreate(BaseModel):
    user_id: str
    items: List[dict]
    total: float
    stripe_payment_id: Optional[str] = None
    shipping_address: dict


class CheckoutRequest(BaseModel):
    user_id: str
    cart_items: List[str]  # cart item IDs
    shipping_address: dict


def _ensure_db(request: Request):
    try:
        return request.app.state.db
    except AttributeError as exc:  # pragma: no cover - defensive
        raise HTTPException(status_code=503, detail="Database not ready") from exc


def _get_agent_cache(request: Request) -> Dict[str, object]:
    if not hasattr(request.app.state, "agent_cache"):
        request.app.state.agent_cache = {}
    return request.app.state.agent_cache


async def _get_or_create_agent(request: Request, agent_type: str):
    cache = _get_agent_cache(request)
    if agent_type in cache:
        return cache[agent_type]

    config: AgentConfig = request.app.state.agent_config

    if agent_type == "search":
        cache[agent_type] = SearchAgent(config)
    elif agent_type == "chat":
        cache[agent_type] = ChatAgent(config)
    else:
        raise HTTPException(status_code=400, detail=f"Unknown agent type '{agent_type}'")

    return cache[agent_type]


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_dotenv(ROOT_DIR / ".env")

    mongo_url = os.getenv("MONGO_URL")
    db_name = os.getenv("DB_NAME")

    if not mongo_url or not db_name:
        missing = [name for name, value in {"MONGO_URL": mongo_url, "DB_NAME": db_name}.items() if not value]
        raise RuntimeError(f"Missing required environment variables: {', '.join(missing)}")

    client = AsyncIOMotorClient(mongo_url)

    try:
        app.state.mongo_client = client
        app.state.db = client[db_name]
        app.state.agent_config = AgentConfig()
        app.state.agent_cache = {}
        logger.info("AI Agents API starting up")
        yield
    finally:
        client.close()
        logger.info("AI Agents API shutdown complete")


app = FastAPI(
    title="AI Agents API",
    description="Minimal AI Agents API with LangGraph and MCP support",
    lifespan=lifespan,
)

api_router = APIRouter(prefix="/api")


@api_router.get("/")
async def root():
    return {"message": "Hello World"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate, request: Request):
    db = _ensure_db(request)
    status_obj = StatusCheck(**input.model_dump())
    await db.status_checks.insert_one(status_obj.model_dump())
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks(request: Request):
    db = _ensure_db(request)
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]


@api_router.post("/chat", response_model=ChatResponse)
async def chat_with_agent(chat_request: ChatRequest, request: Request):
    try:
        agent = await _get_or_create_agent(request, chat_request.agent_type)
        response = await agent.execute(chat_request.message)

        return ChatResponse(
            success=response.success,
            response=response.content,
            agent_type=chat_request.agent_type,
            capabilities=agent.get_capabilities(),
            metadata=response.metadata,
            error=response.error,
        )
    except HTTPException:
        raise
    except Exception as exc:  # pragma: no cover - defensive
        logger.exception("Error in chat endpoint")
        return ChatResponse(
            success=False,
            response="",
            agent_type=chat_request.agent_type,
            capabilities=[],
            error=str(exc),
        )


@api_router.post("/search", response_model=SearchResponse)
async def search_and_summarize(search_request: SearchRequest, request: Request):
    try:
        search_agent = await _get_or_create_agent(request, "search")
        search_prompt = (
            f"Search for information about: {search_request.query}. "
            "Provide a comprehensive summary with key findings."
        )
        result = await search_agent.execute(search_prompt, use_tools=True)

        if result.success:
            metadata = result.metadata or {}
            return SearchResponse(
                success=True,
                query=search_request.query,
                summary=result.content,
                search_results=metadata,
                sources_count=int(metadata.get("tool_run_count", metadata.get("tools_used", 0)) or 0),
            )

        return SearchResponse(
            success=False,
            query=search_request.query,
            summary="",
            sources_count=0,
            error=result.error,
        )
    except HTTPException:
        raise
    except Exception as exc:  # pragma: no cover - defensive
        logger.exception("Error in search endpoint")
        return SearchResponse(
            success=False,
            query=search_request.query,
            summary="",
            sources_count=0,
            error=str(exc),
        )


@api_router.get("/agents/capabilities")
async def get_agent_capabilities(request: Request):
    try:
        search_agent = await _get_or_create_agent(request, "search")
        chat_agent = await _get_or_create_agent(request, "chat")

        return {
            "success": True,
            "capabilities": {
                "search_agent": search_agent.get_capabilities(),
                "chat_agent": chat_agent.get_capabilities(),
            },
        }
    except HTTPException:
        raise
    except Exception as exc:  # pragma: no cover - defensive
        logger.exception("Error getting capabilities")
        return {"success": False, "error": str(exc)}


# Product Endpoints
@api_router.post("/products", response_model=Product)
async def create_product(product_input: ProductCreate, request: Request):
    """Create a new product (Admin endpoint)"""
    db = _ensure_db(request)
    product = Product(**product_input.model_dump())
    await db.products.insert_one(product.model_dump())
    return product


@api_router.get("/products", response_model=List[Product])
async def get_products(
    request: Request,
    category: Optional[str] = None,
    color: Optional[str] = None,
    featured: Optional[bool] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
):
    """Get all products with optional filtering"""
    db = _ensure_db(request)
    query = {}

    if category:
        query["category"] = category
    if color:
        query["color"] = color
    if featured is not None:
        query["featured"] = featured
    if min_price is not None or max_price is not None:
        query["price"] = {}
        if min_price is not None:
            query["price"]["$gte"] = min_price
        if max_price is not None:
            query["price"]["$lte"] = max_price

    products = await db.products.find(query).sort("created_at", -1).to_list(1000)
    return [Product(**product) for product in products]


@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str, request: Request):
    """Get a single product by ID"""
    db = _ensure_db(request)
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return Product(**product)


@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, product_update: ProductUpdate, request: Request):
    """Update a product (Admin endpoint)"""
    db = _ensure_db(request)

    existing_product = await db.products.find_one({"id": product_id})
    if not existing_product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = {k: v for k, v in product_update.model_dump().items() if v is not None}

    if update_data:
        await db.products.update_one({"id": product_id}, {"$set": update_data})
        updated_product = await db.products.find_one({"id": product_id})
        return Product(**updated_product)

    return Product(**existing_product)


@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, request: Request):
    """Delete a product (Admin endpoint)"""
    db = _ensure_db(request)
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"success": True, "message": "Product deleted"}


# Drops Notification Endpoints
@api_router.post("/drops/subscribe", response_model=DropsSubscriber)
async def subscribe_to_drops(subscriber_input: DropsSubscriberCreate, request: Request):
    """Subscribe to drops notifications"""
    db = _ensure_db(request)

    # Check if email already exists
    existing = await db.drops_subscribers.find_one({"email": subscriber_input.email})
    if existing:
        return DropsSubscriber(**existing)

    subscriber = DropsSubscriber(**subscriber_input.model_dump())
    await db.drops_subscribers.insert_one(subscriber.model_dump())
    return subscriber


@api_router.get("/drops/subscribers", response_model=List[DropsSubscriber])
async def get_drops_subscribers(request: Request):
    """Get all drops subscribers (Admin endpoint)"""
    db = _ensure_db(request)
    subscribers = await db.drops_subscribers.find().sort("subscribed_at", -1).to_list(10000)
    return [DropsSubscriber(**sub) for sub in subscribers]


# Cart Endpoints
@api_router.post("/cart/add", response_model=CartItem)
async def add_to_cart(cart_item_input: CartItemCreate, request: Request):
    """Add item to cart"""
    db = _ensure_db(request)

    # Verify product exists
    product = await db.products.find_one({"id": cart_item_input.product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Check if item already in cart
    existing = await db.cart_items.find_one({
        "user_id": cart_item_input.user_id,
        "product_id": cart_item_input.product_id,
        "size": cart_item_input.size
    })

    if existing:
        # Update quantity
        new_quantity = existing["quantity"] + cart_item_input.quantity
        await db.cart_items.update_one(
            {"id": existing["id"]},
            {"$set": {"quantity": new_quantity}}
        )
        updated = await db.cart_items.find_one({"id": existing["id"]})
        return CartItem(**updated)

    cart_item = CartItem(**cart_item_input.model_dump())
    await db.cart_items.insert_one(cart_item.model_dump())
    return cart_item


@api_router.get("/cart/{user_id}", response_model=List[dict])
async def get_cart(user_id: str, request: Request):
    """Get user's cart with populated product details"""
    db = _ensure_db(request)
    cart_items = await db.cart_items.find({"user_id": user_id}).to_list(1000)

    cart_with_products = []
    for item in cart_items:
        product = await db.products.find_one({"id": item["product_id"]})
        if product:
            cart_with_products.append({
                "cart_item": CartItem(**item).model_dump(),
                "product": Product(**product).model_dump()
            })

    return cart_with_products


@api_router.delete("/cart/{item_id}")
async def remove_from_cart(item_id: str, request: Request):
    """Remove item from cart"""
    db = _ensure_db(request)
    result = await db.cart_items.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return {"success": True, "message": "Item removed from cart"}


@api_router.put("/cart/{item_id}/quantity")
async def update_cart_quantity(item_id: str, quantity: int, request: Request):
    """Update cart item quantity"""
    db = _ensure_db(request)

    if quantity < 1:
        raise HTTPException(status_code=400, detail="Quantity must be at least 1")

    result = await db.cart_items.update_one(
        {"id": item_id},
        {"$set": {"quantity": quantity}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Cart item not found")

    return {"success": True, "message": "Quantity updated"}


# Order Endpoints
@api_router.post("/orders", response_model=Order)
async def create_order(order_input: OrderCreate, request: Request):
    """Create an order after payment"""
    db = _ensure_db(request)
    order = Order(**order_input.model_dump())
    await db.orders.insert_one(order.model_dump())

    # Clear user's cart
    await db.cart_items.delete_many({"user_id": order_input.user_id})

    return order


@api_router.get("/orders/{user_id}", response_model=List[Order])
async def get_user_orders(user_id: str, request: Request):
    """Get user's order history"""
    db = _ensure_db(request)
    orders = await db.orders.find({"user_id": user_id}).sort("created_at", -1).to_list(1000)
    return [Order(**order) for order in orders]


@api_router.get("/admin/orders", response_model=List[Order])
async def get_all_orders(request: Request):
    """Get all orders (Admin endpoint)"""
    db = _ensure_db(request)
    orders = await db.orders.find().sort("created_at", -1).to_list(1000)
    return [Order(**order) for order in orders]


# Stripe Checkout Endpoint
@api_router.post("/checkout")
async def create_checkout_session(checkout_request: CheckoutRequest, request: Request):
    """Create Stripe checkout session"""
    if not STRIPE_AVAILABLE:
        raise HTTPException(status_code=503, detail="Payment processing unavailable")

    db = _ensure_db(request)

    # Get stripe key from env
    stripe_key = os.getenv("STRIPE_SECRET_KEY")
    if not stripe_key:
        raise HTTPException(status_code=500, detail="Stripe not configured")

    stripe.api_key = stripe_key

    # Get cart items
    cart_items = []
    total = 0.0

    for cart_item_id in checkout_request.cart_items:
        cart_item_doc = await db.cart_items.find_one({"id": cart_item_id})
        if not cart_item_doc:
            continue

        product = await db.products.find_one({"id": cart_item_doc["product_id"]})
        if not product:
            continue

        item_total = product["price"] * cart_item_doc["quantity"]
        total += item_total

        cart_items.append({
            "product_id": product["id"],
            "product_name": product["name"],
            "size": cart_item_doc["size"],
            "quantity": cart_item_doc["quantity"],
            "price": product["price"]
        })

    if not cart_items:
        raise HTTPException(status_code=400, detail="No valid items in cart")

    try:
        # Create Stripe checkout session
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[
                {
                    "price_data": {
                        "currency": "usd",
                        "product_data": {
                            "name": f"{item['product_name']} - Size {item['size']}",
                        },
                        "unit_amount": int(item["price"] * 100),  # Convert to cents
                    },
                    "quantity": item["quantity"],
                }
                for item in cart_items
            ],
            mode="payment",
            success_url=os.getenv("STRIPE_SUCCESS_URL", "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}"),
            cancel_url=os.getenv("STRIPE_CANCEL_URL", "http://localhost:3000/cart"),
            metadata={
                "user_id": checkout_request.user_id,
            }
        )

        # Create order with pending status
        order = Order(
            user_id=checkout_request.user_id,
            items=cart_items,
            total=total,
            status="pending",
            stripe_payment_id=session.id,
            shipping_address=checkout_request.shipping_address
        )
        await db.orders.insert_one(order.model_dump())

        return {
            "success": True,
            "session_id": session.id,
            "checkout_url": session.url,
            "order_id": order.id
        }

    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhook events"""
    if not STRIPE_AVAILABLE:
        raise HTTPException(status_code=503, detail="Stripe not available")

    db = _ensure_db(request)
    stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        if webhook_secret:
            event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
        else:
            event = stripe.Event.construct_from(
                stripe.util.convert_to_dict(payload), stripe.api_key
            )

        # Handle successful payment
        if event["type"] == "checkout.session.completed":
            session = event["data"]["object"]
            payment_id = session["id"]

            # Update order status
            await db.orders.update_one(
                {"stripe_payment_id": payment_id},
                {"$set": {"status": "paid"}}
            )

            # Clear user's cart
            user_id = session.get("metadata", {}).get("user_id")
            if user_id:
                await db.cart_items.delete_many({"user_id": user_id})

        return {"success": True}

    except Exception as e:
        logger.error(f"Webhook error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
