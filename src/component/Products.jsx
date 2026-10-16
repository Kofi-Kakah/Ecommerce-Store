import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth, useClerk } from "@clerk/clerk-react";
import Navbar from "./Navbar.jsx";
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  CloseButton,
  Container,
  Drawer,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  Portal,
  SimpleGrid,
  Skeleton,
  Text,
} from "@chakra-ui/react";

const API_URL = "https://dummyjson.com/products";
const PAGE_SIZE = 12;
const CART_KEY = "store-cart";

const formatPrice = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

// DummyJSON's `price` is the pre-discount price, so apply the discount ourselves
const getSalePrice = (product) =>
  Math.round(product.price * (1 - (product.discountPercentage || 0) / 100) * 100) / 100;

/* ----------------------------- Cart logic ----------------------------- */

function useCart() {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Keep the cart across page refreshes
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable (private mode, full) - cart still works in memory */
    }
  }, [items]);

  const addItem = (product) =>
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) } : i
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: getSalePrice(product),
          thumbnail: product.thumbnail,
          stock: product.stock,
          quantity: 1,
        },
      ];
    });

  // Setting quantity to 0 or less removes the item; the max is the item's stock
  const setQuantity = (id, quantity) =>
    setItems((prev) =>
      prev.flatMap((i) => {
        if (i.id !== id) return [i];
        if (quantity <= 0) return [];
        return [{ ...i, quantity: Math.min(quantity, i.stock) }];
      })
    );

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => setItems([]);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = Math.round(items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100) / 100;

  return { items, itemCount, subtotal, addItem, setQuantity, removeItem, clearCart };
}

/* ---------------------------- Cart drawer UI --------------------------- */

function CartRow({ item, onQuantityChange, onRemove }) {
  const atMax = item.quantity >= item.stock;

  return (
    <Flex gap="3" py="4" borderBottomWidth="1px">
      <Image
        src={item.thumbnail}
        alt={item.title}
        boxSize="20"
        objectFit="cover"
        rounded="md"
        bg="bg.muted"
      />

      <Box flex="1" minW="0">
        <Text fontWeight="medium" lineClamp={2}>
          {item.title}
        </Text>
        <Text fontSize="sm" color="fg.muted">
          {formatPrice(item.price)} each
        </Text>

        <HStack mt="2" gap="2">
          <IconButton
            size="xs"
            variant="outline"
            aria-label={`Decrease quantity of ${item.title}`}
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
          >
            −
          </IconButton>
          <Text minW="6" textAlign="center" fontWeight="medium">
            {item.quantity}
          </Text>
          <IconButton
            size="xs"
            variant="outline"
            aria-label={`Increase quantity of ${item.title}`}
            disabled={atMax}
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
          >
            +
          </IconButton>
        </HStack>

        {atMax && (
          <Text fontSize="xs" color="orange.600" mt="1">
            Max available: {item.stock}
          </Text>
        )}
      </Box>

      <Flex direction="column" align="flex-end" justify="space-between">
        <Text fontWeight="semibold">{formatPrice(item.price * item.quantity)}</Text>
        <Button size="xs" variant="ghost" colorPalette="red" onClick={() => onRemove(item.id)}>
          Remove
        </Button>
      </Flex>
    </Flex>
  );
}

function CartDrawer({ open, onOpenChange, cart, onCheckout }) {
  const { items, itemCount, subtotal, setQuantity, removeItem, clearCart } = cart;

  return (
    <Drawer.Root open={open} onOpenChange={(e) => onOpenChange(e.open)} size="md">
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Your cart ({itemCount})</Drawer.Title>
            </Drawer.Header>

            <Drawer.Body>
              {items.length === 0 ? (
                <Box textAlign="center" py="12">
                  <Text fontWeight="medium">Your cart is empty</Text>
                  <Text color="fg.muted" fontSize="sm" mt="1">
                    Add some products to get started.
                  </Text>
                  <Button mt="4" variant="outline" onClick={() => onOpenChange(false)}>
                    Continue shopping
                  </Button>
                </Box>
              ) : (
                items.map((item) => (
                  <CartRow
                    key={item.id}
                    item={item}
                    onQuantityChange={setQuantity}
                    onRemove={removeItem}
                  />
                ))
              )}
            </Drawer.Body>

            {items.length > 0 && (
              <Drawer.Footer flexDirection="column" alignItems="stretch" gap="3">
                <Flex justify="space-between" align="center">
                  <Text fontWeight="semibold">Subtotal</Text>
                  <Text fontWeight="bold" fontSize="xl">
                    {formatPrice(subtotal)}
                  </Text>
                </Flex>
                <Text fontSize="xs" color="fg.muted">
                  Shipping and taxes are calculated at checkout.
                </Text>
                <Button colorPalette="blue" onClick={() => onCheckout(items, subtotal)}>
                  Checkout
                </Button>
                <Button variant="outline" onClick={clearCart}>
                  Clear cart
                </Button>
              </Drawer.Footer>
            )}

            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}

/* ----------------------------- Product card ---------------------------- */

function ProductCard({ product, quantityInCart, onAdd }) {
  const inStock = product.stock > 0;
  const maxedOut = quantityInCart >= product.stock;
  const hasDiscount = product.discountPercentage >= 1;
  const salePrice = getSalePrice(product);

  return (
    <Card.Root overflow="hidden" h="full" _hover={{ shadow: "lg" }} transition="box-shadow 0.2s">
      <Box position="relative" bg="bg.muted">
        <Image
          src={product.thumbnail}
          alt={product.title}
          w="full"
          h="48"
          objectFit="cover"
          loading="lazy"
        />
        {hasDiscount && (
          <Badge position="absolute" top="3" left="3" colorPalette="red" variant="solid">
            -{Math.round(product.discountPercentage)}%
          </Badge>
        )}
      </Box>

      <Card.Body gap="2">
        <Text fontSize="xs" textTransform="uppercase" letterSpacing="wide" color="fg.muted">
          {product.category}
        </Text>
        <Card.Title lineClamp={1} title={product.title}>
          {product.title}
        </Card.Title>
        <Card.Description lineClamp={2}>{product.description}</Card.Description>
        <HStack gap="1">
          <Text color="yellow.500">★</Text>
          <Text fontSize="sm">{product.rating.toFixed(1)}</Text>
        </HStack>
      </Card.Body>

      <Card.Footer justifyContent="space-between" alignItems="center">
        <Box>
          <HStack gap="2" align="baseline">
            <Text fontWeight="bold" fontSize="lg">
              {formatPrice(salePrice)}
            </Text>
            {hasDiscount && (
              <Text fontSize="sm" color="fg.muted" textDecoration="line-through">
                {formatPrice(product.price)}
              </Text>
            )}
          </HStack>
          <Text fontSize="xs" color={inStock ? "green.600" : "red.500"}>
            {!inStock ? "Out of stock" : quantityInCart > 0 ? `${quantityInCart} in cart` : "In stock"}
          </Text>
        </Box>
        <Button
          size="sm"
          colorPalette="blue"
          disabled={!inStock || maxedOut}
          onClick={() => onAdd(product)}
        >
          {maxedOut && inStock ? "Max in cart" : quantityInCart > 0 ? "Add one more" : "Add to cart"}
        </Button>
      </Card.Footer>
    </Card.Root>
  );
}

/* ------------------------------ Main page ------------------------------ */

export default function ProductStore() {
  const { isLoaded, isSignedIn } = useAuth();
  const { redirectToSignUp } = useClerk();
  const [input, setInput] = useState(""); // what the user is typing
  const [query, setQuery] = useState(""); // what we actually search for
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true); // first page / new search
  const [loadingMore, setLoadingMore] = useState(false); // "Load more" clicks
  const [error, setError] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  const cart = useCart();
  const controllerRef = useRef(null);
  const lastRequestRef = useRef({ q: "", skip: 0 });

  // One fetch function for both the first page (skip = 0) and "Load more" (skip > 0).
  // Starting a new request cancels the previous one, so stale responses can't win.
  const fetchProducts = useCallback(async ({ q, skip }) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    lastRequestRef.current = { q, skip };

    const append = skip > 0;
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setLoadingMore(false);
    }
    setError(null);

    try {
      const base = q ? `${API_URL}/search?q=${encodeURIComponent(q)}&` : `${API_URL}?`;
      const response = await fetch(`${base}limit=${PAGE_SIZE}&skip=${skip}`, {
        signal: controller.signal,
      });
      if (!response.ok) {
        throw new Error(`Request failed (status ${response.status})`);
      }

      const data = await response.json();
      const results = data.products ?? [];
      setProducts((prev) => (append ? [...prev, ...results] : results));
      setTotal(data.total ?? 0);
    } catch (err) {
      if (err.name === "AbortError") return; // a newer request replaced this one
      setError(err.message || "Something went wrong");
      if (!append) setProducts([]); // keep what's on screen if only "Load more" failed
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, []);

  // Search-as-you-type: wait 400ms after the user stops typing
  useEffect(() => {
    const timer = setTimeout(() => setQuery(input.trim()), 400);
    return () => clearTimeout(timer);
  }, [input]);

  // New search (or first load) always starts again from page one
  useEffect(() => {
    fetchProducts({ q: query, skip: 0 });
    return () => controllerRef.current?.abort();
  }, [query, fetchProducts]);

  const loadMore = () => fetchProducts({ q: query, skip: products.length });
  const retry = () => fetchProducts(lastRequestRef.current);
  const hasMore = products.length < total;

  const handleSubmit = (e) => {
    e.preventDefault();
    setQuery(input.trim()); // search immediately, skip the debounce wait
  };

  const handleClear = () => {
    setInput("");
    setQuery("");
  };

  const getQuantityInCart = (id) => cart.items.find((i) => i.id === id)?.quantity ?? 0;

  const handleAddToCart = (product) => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      redirectToSignUp();
      return;
    }
    cart.addItem(product);
  };

  // TODO: connect this to your real checkout / payment flow
  const handleCheckout = (items, subtotal) => {
    console.log("Checkout:", { items, subtotal });
  };

  return (
    <>
      <Navbar
        searchValue={input}
        onSearchChange={(event) => setInput(event.target.value)}
        onSearchSubmit={handleSubmit}
        onCartClick={() => setCartOpen(true)}
        cartItemCount={cart.itemCount}
      />
      <Container maxW="7xl" py="8">
      <Flex justify="space-between" align="flex-start" gap="4" mb="6">
        <Box>
          <Heading size="3xl">{query ? `Results for "${query}"` : "Shop all products"}</Heading>
          <Text color="fg.muted" mt="1">
            {query ? "Products matching your search" : "Browse our latest catalog"}
          </Text>
        </Box>

        <Button
          variant="outline"
          onClick={() => setCartOpen(true)}
          aria-label={`Open cart, ${cart.itemCount} items`}
        >
          Cart
          {cart.itemCount > 0 && (
            <Badge colorPalette="blue" variant="solid">
              {cart.itemCount}
            </Badge>
          )}
        </Button>
      </Flex>

      {/* Search */}
      <form onSubmit={handleSubmit}>
        <Flex gap="2" mb="6">
          <Input
            aria-label="Search products"
            placeholder="Search products, e.g. phone, laptop, perfume"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          {input && (
            <Button type="button" variant="outline" onClick={handleClear}>
              Clear
            </Button>
          )}
          <Button type="submit" colorPalette="blue">
            Search
          </Button>
        </Flex>
      </form>

      <Box aria-live="polite">
        {/* Loading first page / new search */}
        {loading && (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap="6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} h="80" rounded="md" />
            ))}
          </SimpleGrid>
        )}

        {/* Results */}
        {!loading && products.length > 0 && (
          <>
            <Text color="fg.muted" mb="4" fontSize="sm">
              Showing {products.length} of {total} {total === 1 ? "product" : "products"}
            </Text>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap="6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantityInCart={getQuantityInCart(product.id)}
                  onAdd={handleAddToCart}
                />
              ))}
            </SimpleGrid>
          </>
        )}

        {/* Error (also covers a failed "Load more", keeping loaded products visible) */}
        {error && !loading && (
          <Alert.Root status="error" mt="6">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Couldn't load products</Alert.Title>
              <Alert.Description>{error}</Alert.Description>
            </Alert.Content>
            <Button size="sm" onClick={retry}>
              Try again
            </Button>
          </Alert.Root>
        )}

        {/* Load more */}
        {!loading && !error && hasMore && (
          <Flex justify="center" mt="8">
            <Button variant="outline" onClick={loadMore} loading={loadingMore} loadingText="Loading...">
              Load more
            </Button>
          </Flex>
        )}

        {/* Empty state */}
        {!loading && !error && products.length === 0 && (
          <Box textAlign="center" py="12">
            <Text color="fg.muted">
              {query
                ? `No products found for "${query}". Try a different search.`
                : "No products available right now."}
            </Text>
          </Box>
        )}
      </Box>

      <CartDrawer
        open={cartOpen}
        onOpenChange={setCartOpen}
        cart={cart}
        onCheckout={handleCheckout}
      />
      </Container>
    </>
  );
}