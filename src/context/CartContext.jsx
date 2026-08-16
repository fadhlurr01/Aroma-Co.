import React, { createContext, useContext, useState, useEffect } from 'react';
import { COFFEE_MENU } from '../data/coffeeData';
import { ARTICLES_DATA } from '../data/articlesData';

const CartContext = createContext();

const INITIAL_MOCK_ORDERS = [
  {
    orderId: 'ARC-789210',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    customerName: 'Rayhan Sudiro',
    customerPhone: '081298451122',
    orderType: 'dine-in',
    tableNumber: '03',
    paymentMethod: 'qris',
    paymentStatus: 'LUNAS (QRIS Verified)',
    status: 'processing', // 'pending' | 'processing' | 'completed' | 'cancelled'
    subtotal: 75000,
    discount: 0,
    tax: 7500,
    total: 82500,
    customerNote: 'Es batu sedikit saja',
    items: [
      {
        id: 'c1',
        name: 'Sea Salt Caramel Latte',
        price: 40000,
        quantity: 1,
        image: './assets/images/prod-1.jpg',
        customOptions: { temperature: 'Dingin (Iced)', sweetness: 'Gula 50%', milk: 'Fresh Milk', size: 'Reguler (250ml)' }
      },
      {
        id: 'c2',
        name: 'Golden Velvet Espresso',
        price: 35000,
        quantity: 1,
        image: './assets/images/prod-2.jpg',
        customOptions: { temperature: 'Panas (Hot)', sweetness: 'Gula 0%', milk: 'Fresh Milk', size: 'Reguler (250ml)', extraShot: '+1 Extra Shot (+8k)' }
      }
    ]
  },
  {
    orderId: 'ARC-642199',
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    customerName: 'Clarissa Putri',
    customerPhone: '081388992011',
    orderType: 'takeaway',
    paymentMethod: 'bca_va',
    paymentStatus: 'Menunggu Konfirmasi (Pending)',
    status: 'pending',
    subtotal: 42000,
    discount: 0,
    tax: 4200,
    total: 46200,
    customerNote: 'Tolong disiapkan jam 18.30 WIB',
    items: [
      {
        id: 'c3',
        name: 'Smoked Vanilla Cold Brew',
        price: 42000,
        quantity: 1,
        image: './assets/images/prod-3.jpg',
        customOptions: { temperature: 'Dingin (Iced)', sweetness: 'Gula 100%', milk: 'Oat Milk (+5k)', size: 'Large (+6k)' }
      }
    ]
  }
];

export function CartProvider({ children }) {
  const [cartState, setCartState] = useState(() => {
    try {
      const saved = localStorage.getItem('aroma_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [ordersList, setOrdersList] = useState(() => {
    try {
      const savedOrders = localStorage.getItem('aroma_orders_history');
      return savedOrders ? JSON.parse(savedOrders) : INITIAL_MOCK_ORDERS;
    } catch {
      return INITIAL_MOCK_ORDERS;
    }
  });

  const [articlesList, setArticlesList] = useState(() => {
    try {
      const savedArticles = localStorage.getItem('aroma_articles_data');
      return savedArticles ? JSON.parse(savedArticles) : ARTICLES_DATA;
    } catch {
      return ARTICLES_DATA;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(() => {
    try {
      const savedOrder = localStorage.getItem('aroma_active_order');
      return savedOrder ? JSON.parse(savedOrder) : null;
    } catch {
      return null;
    }
  });

  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [orderType, setOrderType] = useState('dine-in'); // 'dine-in' | 'takeaway' | 'delivery'
  const [customerNote, setCustomerNote] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('aroma_cart', JSON.stringify(cartState));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [cartState]);

  useEffect(() => {
    try {
      localStorage.setItem('aroma_orders_history', JSON.stringify(ordersList));
    } catch (e) {
      console.error('Failed to save orders list', e);
    }
  }, [ordersList]);

  useEffect(() => {
    try {
      localStorage.setItem('aroma_articles_data', JSON.stringify(articlesList));
    } catch (e) {
      console.error('Failed to save articles list', e);
    }
  }, [articlesList]);

  useEffect(() => {
    try {
      if (activeOrder) {
        localStorage.setItem('aroma_active_order', JSON.stringify(activeOrder));
      } else {
        localStorage.removeItem('aroma_active_order');
      }
    } catch (e) {
      console.error('Failed to save active order', e);
    }
  }, [activeOrder]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3200);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const openCheckout = () => {
    if (cartState.length === 0) return;
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };
  const closeCheckout = () => setIsCheckoutOpen(false);

  const addToCart = (productId, customOptions = {}) => {
    const product = COFFEE_MENU.find((item) => item.id === productId);
    if (!product) return;

    let extraPrice = 0;
    if (customOptions.milk === 'Oat Milk (+5k)' || customOptions.milk === 'oat') extraPrice += 5000;
    if (customOptions.milk === 'Almond Milk (+7k)' || customOptions.milk === 'almond') extraPrice += 7000;
    if (customOptions.size === 'Large (+6k)' || customOptions.size === 'large') extraPrice += 6000;
    if (customOptions.extraShot) extraPrice += 8000;

    const itemPrice = product.price + extraPrice;
    const qty = customOptions.quantity || 1;

    setCartState((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.id === productId && JSON.stringify(item.customOptions) === JSON.stringify(customOptions)
      );

      if (existingIndex > -1) {
        const nextCart = [...prevCart];
        nextCart[existingIndex] = {
          ...nextCart[existingIndex],
          quantity: nextCart[existingIndex].quantity + qty,
        };
        return nextCart;
      } else {
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            image: product.image,
            category: product.category,
            basePrice: product.price,
            price: itemPrice,
            quantity: qty,
            customOptions: customOptions,
          },
        ];
      }
    });

    openCart();
    showToast(`"${product.name}" ditambahkan ke keranjang!`);
  };

  const removeFromCart = (index) => {
    setCartState((prev) => prev.filter((_, i) => i !== index));
    showToast("Item dihapus dari keranjang.");
  };

  const updateCartQuantity = (index, delta) => {
    setCartState((prev) => {
      const next = [...prev];
      const newQty = next[index].quantity + delta;
      if (newQty <= 0) {
        return next.filter((_, i) => i !== index);
      }
      next[index] = { ...next[index], quantity: newQty };
      return next;
    });
  };

  const clearCart = () => {
    setCartState([]);
  };

  const applyVoucher = (code) => {
    const cleanCode = code.toUpperCase().trim();
    if (cleanCode === 'AROMA10') {
      setAppliedVoucher({ code: 'AROMA10', discountPercent: 0.1, label: 'Diskon 10% Spesial' });
      showToast('Voucher AROMA10 berhasil digunakan (-10%)!');
    } else if (cleanCode === 'KOPI50') {
      setAppliedVoucher({ code: 'KOPI50', discountPercent: 0.5, label: 'Diskon 50% Grand Opening' });
      showToast('Voucher KOPI50 berhasil digunakan (-50%)!');
    } else if (cleanCode === 'ARTISAN') {
      setAppliedVoucher({ code: 'ARTISAN', discountAmount: 15000, label: 'Potongan Rp 15.000' });
      showToast('Voucher ARTISAN berhasil digunakan (-Rp 15.000)!');
    } else {
      showToast('Kode voucher tidak valid atau sudah kadaluarsa.');
    }
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    showToast('Voucher promo telah dihapus.');
  };

  const cartSubtotal = cartState.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discountAmount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.discountPercent) {
      discountAmount = Math.round(cartSubtotal * appliedVoucher.discountPercent);
    } else if (appliedVoucher.discountAmount) {
      discountAmount = Math.min(appliedVoucher.discountAmount, cartSubtotal);
    }
  }

  const taxableAmount = Math.max(0, cartSubtotal - discountAmount);
  const taxAmount = Math.round(taxableAmount * 0.1);
  const cartTotal = taxableAmount + taxAmount;
  const cartCount = cartState.reduce((sum, item) => sum + item.quantity, 0);

  // Place Order function
  const placeOrder = (orderDetails) => {
    const isOnlinePayment = orderDetails.paymentMethod === 'qris' || orderDetails.paymentMethod === 'bca_va' || orderDetails.paymentMethod === 'mandiri_va';
    
    const newOrder = {
      orderId: 'ARC-' + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString(),
      items: [...cartState],
      subtotal: cartSubtotal,
      discount: discountAmount,
      tax: taxAmount,
      total: cartTotal,
      voucher: appliedVoucher,
      orderType: orderType,
      customerNote: customerNote,
      ...orderDetails,
      status: isOnlinePayment ? 'pending' : 'pending', // Pending barista verification
    };

    setOrdersList((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    clearCart();
    setAppliedVoucher(null);
    setCustomerNote('');
    showToast("Pesanan Anda berhasil diajukan dan sedang diverifikasi!");
    return newOrder;
  };

  // Admin Order Actions
  const updateOrderStatus = (orderId, newStatus) => {
    setOrdersList((prev) =>
      prev.map((ord) => (ord.orderId === orderId ? { ...ord, status: newStatus } : ord))
    );
    showToast(`Status pesanan ${orderId} diubah menjadi "${newStatus}"`);
  };

  const updatePaymentStatus = (orderId, newPaymentStatus) => {
    setOrdersList((prev) =>
      prev.map((ord) => (ord.orderId === orderId ? { ...ord, paymentStatus: newPaymentStatus } : ord))
    );
    showToast(`Status pembayaran ${orderId} diperbarui.`);
  };

  const deleteOrder = (orderId) => {
    setOrdersList((prev) => prev.filter((ord) => ord.orderId !== orderId));
    showToast(`Histori pesanan #${orderId} berhasil dihapus.`);
  };

  const clearFinishedOrders = () => {
    setOrdersList((prev) => prev.filter((ord) => ord.status !== 'completed' && ord.status !== 'cancelled'));
    showToast("Semua histori pesanan yang selesai/dibatalkan telah dibersihkan.");
  };

  // Article Management Actions
  const addArticle = (newArticle) => {
    setArticlesList((prev) => [newArticle, ...prev]);
    showToast(`Artikel "${newArticle.title}" berhasil diterbitkan ke jurnal!`);
  };

  const deleteArticle = (articleId) => {
    setArticlesList((prev) => prev.filter((art) => art.id !== articleId));
    showToast("Artikel berhasil dihapus dari jurnal.");
  };

  return (
    <CartContext.Provider
      value={{
        cartState,
        cartSubtotal,
        discountAmount,
        taxAmount,
        cartTotal,
        cartCount,
        isCartOpen,
        openCart,
        closeCart,
        isCheckoutOpen,
        openCheckout,
        closeCheckout,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        appliedVoucher,
        applyVoucher,
        removeVoucher,
        orderType,
        setOrderType,
        customerNote,
        setCustomerNote,
        activeOrder,
        setActiveOrder,
        placeOrder,
        ordersList,
        updateOrderStatus,
        updatePaymentStatus,
        deleteOrder,
        clearFinishedOrders,
        articlesList,
        addArticle,
        deleteArticle,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
