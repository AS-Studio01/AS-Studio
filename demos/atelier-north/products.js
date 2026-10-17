/* Atelier North Shared Product Data and Store Utilities
   All 6 store products, Indian Rupee formatting, cart and wishlist persistence */
(function() {
  'use strict';

  var PRODUCTS = [
    {
      id: 'sofa',
      name: 'Haldi Linen Sofa',
      cat: 'Seating',
      price: 84500,
      image: '../../assets/img/an-sofa.webp',
      thumb: '../../assets/img/an-sofa-sm.webp',
      badge: 'Bestseller',
      summary: 'Deep three-seat sofa in washed Belgian flax linen with a solid Indian oak frame.',
      description: 'Crafted for slow living, the Haldi sofa combines generous proportions with architectural restraint. The removable flax linen slipcover softens with every season, while dual-density foam wrapped in down-alternative clusters provides deep, supportive comfort.',
      materials: 'Solid kiln-dried Indian oak internal frame, 100% Belgian flax linen slipcover, recycled pocket coil core with cruelty-free down-alternative wrap.',
      dimensions: '220 cm W × 94 cm D × 78 cm H · Seat height: 42 cm · Seat depth: 64 cm · Weight: 68 kg',
      care: 'Slipcovers are fully removable. Professional eco-dry cleaning recommended. Spot-clean minor marks with cold water and mild neutral detergent.',
      delivery: 'Made to order. Dispatched via white-glove two-person delivery within 12–16 business days across India.',
      options: [
        { name: 'Oatmeal Natural', color: '#dcd2c4', priceDelta: 0 },
        { name: 'Haldi Ochre', color: '#c49748', priceDelta: 0 },
        { name: 'Charcoal Slate', color: '#44423e', priceDelta: 2500 }
      ]
    },
    {
      id: 'chair',
      name: 'Teak Lounge Chair',
      cat: 'Seating',
      price: 36000,
      image: '../../assets/img/an-chair.webp',
      thumb: '../../assets/img/an-chair-sm.webp',
      badge: 'Crafted',
      summary: 'A low, wide armchair in hand-rubbed teak with an unbleached Danish cord woven seat.',
      description: 'An understated reading chair built from sustainably managed Indian teak. The seat and backrest are hand-woven in continuous three-ply cord, providing gentle ergonomic flex and breathable comfort throughout long afternoons.',
      materials: 'Reclaimed and sustainably harvested teak wood, matte organic oil wax finish, natural unbleached Danish paper cord.',
      dimensions: '68 cm W × 74 cm D × 72 cm H · Seat height: 38 cm · Armrest height: 56 cm · Weight: 12 kg',
      care: 'Dust cord weave with a soft dry brush. Wipe wood frame with a dry lint-free cloth. Nourish timber once a year with pure beeswax.',
      delivery: 'Dispatched in reinforced custom wooden crate within 4–6 business days.',
      options: [
        { name: 'Natural Teak', color: '#ab7947', priceDelta: 0 },
        { name: 'Smoked Walnut', color: '#5e4835', priceDelta: 1500 },
        { name: 'Blackened Ash', color: '#272624', priceDelta: 1500 }
      ]
    },
    {
      id: 'lamp',
      name: 'Brass Arc Lamp',
      cat: 'Lighting',
      price: 18500,
      image: '../../assets/img/an-lamp.webp',
      thumb: '../../assets/img/an-lamp-sm.webp',
      badge: 'Iconic',
      summary: 'A graceful spun-brass arc casting warm, diffuse ambient light over reading nooks.',
      description: 'Precision-counterbalanced on a solid black granite cylinder, this cantilevered brass floor lamp suspends a hand-spun dome reflector. Fitted with an in-line rotary brass dimmer and a braided jute cable.',
      materials: 'Solid unlacquered raw brass, hand-turned black Kadapa granite pedestal base, spun brass shade, woven cord.',
      dimensions: '148 cm H × 46 cm reach · Dome diameter: 30 cm · Base: 18 cm diameter × 14 cm H · Weight: 9.5 kg',
      care: 'Raw brass will develop a dignified natural patina. To restore bright lustre, use a dab of brass polish with a soft cloth.',
      delivery: 'Ships flat-packed in custom molded protective casing. Simple tool-free assembly in under 5 minutes.',
      options: [
        { name: 'Brushed Brass', color: '#d8b248', priceDelta: 0 },
        { name: 'Antique Bronze', color: '#574836', priceDelta: 1000 },
        { name: 'Matte Carbon', color: '#1f1f20', priceDelta: 0 }
      ]
    },
    {
      id: 'rug',
      name: 'Wool Field Rug',
      cat: 'Textiles',
      price: 28000,
      image: '../../assets/img/an-rug.webp',
      thumb: '../../assets/img/an-rug-sm.webp',
      badge: 'Hand-loomed',
      summary: 'Hand-knotted undyed indigenous wool in a tranquil field of heather and oatmeal tones.',
      description: 'Woven slowly on traditional upright wooden looms by multigenerational weavers in Rajasthan. We leave the wool unbleached and undyed, retaining the sheep’s natural lanolin for remarkable stain resistance and tactile warmth.',
      materials: '100% indigenous desi wool pile, unbleached organic cotton warp and weft. Zero synthetic backings or latex.',
      dimensions: 'Standard: 240 cm × 170 cm (approx. 5.5 × 8 ft) · Pile height: 14 mm · Weight: 14 kg',
      care: 'Vacuum gently without revolving beater bar. Blot liquid spills immediately with clean undyed cloth. Professional wool rug wash every two years.',
      delivery: 'Rolled and sealed in water-resistant protective canvas wrap. Ships within 3–5 business days.',
      options: [
        { name: 'Oatmeal & Cream', color: '#d5ccbe', priceDelta: 0 },
        { name: 'Warm Clay Field', color: '#b89984', priceDelta: 2000 },
        { name: 'Natural Charcoal', color: '#4d4c48', priceDelta: 2000 }
      ]
    },
    {
      id: 'frame',
      name: 'Oak Gallery Frame',
      cat: 'Objects',
      price: 6500,
      image: '../../assets/img/an-frame.webp',
      thumb: '../../assets/img/an-frame-sm.webp',
      badge: 'Handmade',
      summary: 'Deep-profile solid oak picture frame with 99% UV-protective museum art glass.',
      description: 'Designed to elevate prints, drawings, and photographs. Mitered corners are reinforced with exposed walnut splines for archival longevity. Includes a 4-ply 100% cotton acid-free archival mat board and precision brass wall hardware.',
      materials: 'Solid quarter-sawn white oak, natural wax finish, 99% UV-resistant non-reflective museum glass, acid-free rag mat.',
      dimensions: 'Frame outer: 52 cm × 42 cm × 3.5 cm depth · Mat window fits A3 or 30 × 40 cm artwork · Weight: 2.2 kg',
      care: 'Clean glass with a microfiber cloth lightly misted with ammonia-free glass cleaner. Never spray liquid directly onto the frame.',
      delivery: 'Double-boxed with corner guards. Dispatched within 2–4 business days.',
      options: [
        { name: 'Natural White Oak', color: '#caa981', priceDelta: 0 },
        { name: 'Rich Walnut', color: '#5a4130', priceDelta: 800 },
        { name: 'Ebonized Ash', color: '#252422', priceDelta: 500 }
      ]
    },
    {
      id: 'bowl',
      name: 'Stoneware Centerpiece Bowl',
      cat: 'Objects',
      price: 3800,
      image: '../../assets/img/an-bowl.webp',
      thumb: '../../assets/img/an-bowl-sm.webp',
      badge: 'Studio Batch',
      summary: 'Wheel-thrown reduction-fired stoneware with a tactile chalk-matte mineral glaze.',
      description: 'Thrown individually on the potter’s wheel in small batches. The low, wide form makes a sculptural presence on dining tables or credenzas. Food-safe, watertight, and heavy enough to remain grounded on any surface.',
      materials: 'High-fire local stoneware clay, feldspar and river silt reduction glaze, unglazed raw stoneware foot.',
      dimensions: '32 cm diameter × 8.5 cm height · Capacity: 3.2 L · Weight: 2.4 kg',
      care: 'Food safe. Hand wash with warm soapy water and soft sponge. Not recommended for oven or microwave use.',
      delivery: 'Molded corrugated paper cushioning in recyclable kraft packaging. Ships in 2–3 business days.',
      options: [
        { name: 'Chalk White Matte', color: '#e5e1d8', priceDelta: 0 },
        { name: 'Terracotta Raw', color: '#b16a4f', priceDelta: 0 },
        { name: 'Basalt Slate', color: '#4f5053', priceDelta: 400 }
      ]
    }
  ];

  var CART_KEY = 'an_cart_v2';
  var WISH_KEY = 'an_wishlist_v2';
  var FREE_SHIPPING_THRESHOLD = 10000;
  var STANDARD_SHIPPING_FEE = 450;
  var DEMO_PROMO_CODE = 'STUDIO10';
  var PROMO_DISCOUNT_PERCENT = 10;

  // Safe storage wrappers with memory fallback
  var memoryStorage = {};
  var storage = {
    get: function(key) {
      try {
        var v = localStorage.getItem(key);
        return v ? JSON.parse(v) : null;
      } catch (_) {
        return memoryStorage[key] || null;
      }
    },
    set: function(key, val) {
      try {
        localStorage.setItem(key, JSON.stringify(val));
      } catch (_) {
        memoryStorage[key] = val;
      }
    }
  };

  // Indian number currency formatter
  function formatINR(n) {
    var val = Math.round(Number(n) || 0);
    return '₹' + val.toLocaleString('en-IN');
  }

  // Cart operations
  function getCart() {
    var c = storage.get(CART_KEY);
    return Array.isArray(c) ? c : [];
  }

  function saveCart(cart) {
    storage.set(CART_KEY, cart);
    updateCartUI();
  }

  function getCartItemCount() {
    return getCart().reduce(function(acc, item) {
      return acc + (item.qty || 1);
    }, 0);
  }

  function getCartSubtotal() {
    return getCart().reduce(function(acc, item) {
      return acc + ((item.price || 0) * (item.qty || 1));
    }, 0);
  }

  function addToCart(productId, optionIndex, qty) {
    optionIndex = typeof optionIndex === 'number' ? optionIndex : 0;
    qty = typeof qty === 'number' && qty > 0 ? qty : 1;
    var p = getProduct(productId);
    if (!p) return;

    var opt = (p.options && p.options[optionIndex]) ? p.options[optionIndex] : { name: 'Standard', priceDelta: 0 };
    var finalPrice = p.price + (opt.priceDelta || 0);
    var itemKey = p.id + '__' + opt.name;

    var cart = getCart();
    var existing = cart.find(function(it) { return it.key === itemKey; });
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        key: itemKey,
        id: p.id,
        name: p.name,
        optionName: opt.name,
        price: finalPrice,
        image: p.thumb || p.image,
        qty: qty
      });
    }
    saveCart(cart);
    openCartDrawer();
  }

  function updateCartQty(key, delta) {
    var cart = getCart();
    var idx = cart.findIndex(function(it) { return it.key === key; });
    if (idx !== -1) {
      cart[idx].qty += delta;
      if (cart[idx].qty <= 0) {
        cart.splice(idx, 1);
      }
      saveCart(cart);
    }
  }

  function removeFromCart(key) {
    var cart = getCart().filter(function(it) { return it.key !== key; });
    saveCart(cart);
  }

  function clearCart() {
    saveCart([]);
  }

  // Wishlist operations
  function getWishlist() {
    var w = storage.get(WISH_KEY);
    return Array.isArray(w) ? w : [];
  }

  function toggleWishlist(productId) {
    var list = getWishlist();
    var idx = list.indexOf(productId);
    var added = false;
    if (idx !== -1) {
      list.splice(idx, 1);
    } else {
      list.push(productId);
      added = true;
    }
    storage.set(WISH_KEY, list);
    updateWishlistUI();
    return added;
  }

  function isWishlisted(productId) {
    return getWishlist().indexOf(productId) !== -1;
  }

  function getProduct(id) {
    return PRODUCTS.find(function(p) { return p.id === id; }) || null;
  }

  // UI updates for badges and mini cart drawer
  function updateWishlistUI() {
    var count = getWishlist().length;
    var badges = document.querySelectorAll('[data-wishlist-count]');
    badges.forEach(function(b) {
      b.textContent = count;
      b.style.display = count > 0 ? 'inline-flex' : 'none';
    });
    document.querySelectorAll('[data-wish-btn]').forEach(function(btn) {
      var id = btn.getAttribute('data-wish-btn');
      var on = isWishlisted(id);
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.setAttribute('title', on ? 'Remove from wishlist' : 'Save to wishlist');
    });
  }

  function updateCartUI() {
    var count = getCartItemCount();
    var subtotal = getCartSubtotal();

    // Badges
    document.querySelectorAll('[data-cart-count]').forEach(function(b) {
      b.textContent = count;
    });

    // Render Drawer contents if drawer exists
    var drawer = document.getElementById('an-cart-drawer');
    if (!drawer) return;

    var listEl = drawer.querySelector('.an-drawer-items');
    var subtotalEl = drawer.querySelector('.an-drawer-subtotal');
    var progressEl = drawer.querySelector('.an-shipping-progress');
    var progressText = drawer.querySelector('.an-shipping-text');
    var emptyEl = drawer.querySelector('.an-drawer-empty');
    var footerEl = drawer.querySelector('.an-drawer-footer');

    if (subtotalEl) subtotalEl.textContent = formatINR(subtotal);

    // Free delivery progress bar
    if (progressEl && progressText) {
      if (subtotal >= FREE_SHIPPING_THRESHOLD) {
        progressEl.style.width = '100%';
        progressText.innerHTML = '<strong>Congratulations!</strong> You have unlocked <b>Free Insured Delivery</b> across India.';
      } else {
        var pct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
        var remain = FREE_SHIPPING_THRESHOLD - subtotal;
        progressEl.style.width = pct + '%';
        progressText.innerHTML = 'Add <b>' + formatINR(remain) + '</b> more to unlock free white-glove delivery.';
      }
    }

    if (!listEl) return;

    var cart = getCart();
    if (cart.length === 0) {
      listEl.innerHTML = '';
      if (emptyEl) emptyEl.style.display = 'block';
      if (footerEl) footerEl.style.display = 'none';
    } else {
      if (emptyEl) emptyEl.style.display = 'none';
      if (footerEl) footerEl.style.display = 'block';

      listEl.innerHTML = cart.map(function(item) {
        return (
          '<div class="an-drawer-item" data-key="' + escapeHTML(item.key) + '">' +
            '<img src="' + item.image + '" alt="' + escapeHTML(item.name) + '" width="70" height="70" class="an-item-thumb">' +
            '<div class="an-item-info">' +
              '<div class="an-item-top">' +
                '<h4 class="an-item-title">' + escapeHTML(item.name) + '</h4>' +
                '<button type="button" class="an-item-remove" data-remove="' + escapeHTML(item.key) + '" aria-label="Remove ' + escapeHTML(item.name) + '">×</button>' +
              '</div>' +
              '<div class="an-item-opt">' + escapeHTML(item.optionName) + '</div>' +
              '<div class="an-item-bot">' +
                '<div class="an-stepper" role="group" aria-label="Quantity">' +
                  '<button type="button" class="an-step-btn" data-step="-1" data-key="' + escapeHTML(item.key) + '" aria-label="Decrease quantity">−</button>' +
                  '<span class="an-step-val">' + item.qty + '</span>' +
                  '<button type="button" class="an-step-btn" data-step="1" data-key="' + escapeHTML(item.key) + '" aria-label="Increase quantity">+</button>' +
                '</div>' +
                '<span class="an-item-price">' + formatINR(item.price * item.qty) + '</span>' +
              '</div>' +
            '</div>' +
          '</div>'
        );
      }).join('');
    }
  }

  function escapeHTML(str) {
    return String(str || '').replace(/[&<>"']/g, function(m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  function openCartDrawer() {
    var drawer = document.getElementById('an-cart-drawer');
    var overlay = document.getElementById('an-cart-overlay');
    if (!drawer) return;
    updateCartUI();
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    if (overlay) overlay.classList.add('open');
    document.body.classList.add('an-drawer-locked');
    var closeBtn = drawer.querySelector('.an-drawer-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeCartDrawer() {
    var drawer = document.getElementById('an-cart-drawer');
    var overlay = document.getElementById('an-cart-overlay');
    if (!drawer) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    if (overlay) overlay.classList.remove('open');
    document.body.classList.remove('an-drawer-locked');
  }

  // Inject drawer into DOM if not present
  function ensureDrawerHTML() {
    if (document.getElementById('an-cart-drawer')) return;

    var overlay = document.createElement('div');
    overlay.id = 'an-cart-overlay';
    overlay.className = 'an-cart-overlay';
    overlay.onclick = closeCartDrawer;
    document.body.appendChild(overlay);

    var drawer = document.createElement('aside');
    drawer.id = 'an-cart-drawer';
    drawer.className = 'an-cart-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', 'Shopping Cart');
    drawer.setAttribute('aria-hidden', 'true');

    drawer.innerHTML = (
      '<div class="an-drawer-header">' +
        '<h3>Your Cart (<span data-cart-count>0</span>)</h3>' +
        '<button type="button" class="an-drawer-close" aria-label="Close cart">✕</button>' +
      '</div>' +
      '<div class="an-shipping-banner">' +
        '<div class="an-shipping-bar"><div class="an-shipping-progress" style="width:0%"></div></div>' +
        '<div class="an-shipping-text">Add items to unlock free shipping</div>' +
      '</div>' +
      '<div class="an-drawer-body">' +
        '<div class="an-drawer-items"></div>' +
        '<div class="an-drawer-empty" style="display:none">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="an-empty-icon"><path d="M6 6h15l-1.5 9h-13z"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M6 6L4 2H1"/></svg>' +
          '<h4>Your cart is empty</h4>' +
          '<p>Explore handcrafted homeware made to age gracefully.</p>' +
          '<a href="collection.html" class="dbtn" style="margin-top:12px">Explore Collection</a>' +
        '</div>' +
      '</div>' +
      '<div class="an-drawer-footer">' +
        '<div class="an-drawer-subrow">' +
          '<span>Estimated Subtotal</span>' +
          '<strong class="an-drawer-subtotal">₹0</strong>' +
        '</div>' +
        '<p class="fine" style="margin-bottom:12px">Taxes included. Free insured delivery on orders over ' + formatINR(FREE_SHIPPING_THRESHOLD) + '.</p>' +
        '<div class="an-drawer-actions">' +
          '<a href="checkout.html" class="dbtn" style="width:100%;text-align:center">Proceed to Checkout</a>' +
          '<a href="cart.html" class="dbtn ghost" style="width:100%;text-align:center;margin-top:6px">View Full Cart</a>' +
        '</div>' +
      '</div>'
    );

    document.body.appendChild(drawer);

    // Event listeners inside drawer
    drawer.querySelector('.an-drawer-close').addEventListener('click', closeCartDrawer);

    drawer.addEventListener('click', function(e) {
      var stepBtn = e.target.closest('[data-step]');
      if (stepBtn) {
        var delta = parseInt(stepBtn.getAttribute('data-step'), 10);
        var key = stepBtn.getAttribute('data-key');
        updateCartQty(key, delta);
        return;
      }
      var remBtn = e.target.closest('[data-remove]');
      if (remBtn) {
        removeFromCart(remBtn.getAttribute('data-remove'));
        return;
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeCartDrawer();
      }
    });
  }

  // Wishlist click delegate
  document.addEventListener('click', function(e) {
    var wishBtn = e.target.closest('[data-wish-btn]');
    if (wishBtn) {
      e.preventDefault();
      var id = wishBtn.getAttribute('data-wish-btn');
      toggleWishlist(id);
      return;
    }

    var quickAdd = e.target.closest('[data-quick-add]');
    if (quickAdd) {
      e.preventDefault();
      var pid = quickAdd.getAttribute('data-quick-add');
      addToCart(pid, 0, 1);
      return;
    }

    var cartTrigger = e.target.closest('[data-cart-drawer-trigger]');
    if (cartTrigger) {
      e.preventDefault();
      openCartDrawer();
      return;
    }
  });

  // Global exports on window
  window.AN_STORE = {
    products: PRODUCTS,
    getProduct: getProduct,
    formatINR: formatINR,
    getCart: getCart,
    addToCart: addToCart,
    updateCartQty: updateCartQty,
    removeFromCart: removeFromCart,
    clearCart: clearCart,
    getCartItemCount: getCartItemCount,
    getCartSubtotal: getCartSubtotal,
    openCartDrawer: openCartDrawer,
    closeCartDrawer: closeCartDrawer,
    updateCartUI: updateCartUI,
    getWishlist: getWishlist,
    toggleWishlist: toggleWishlist,
    isWishlisted: isWishlisted,
    updateWishlistUI: updateWishlistUI,
    FREE_SHIPPING_THRESHOLD: FREE_SHIPPING_THRESHOLD,
    STANDARD_SHIPPING_FEE: STANDARD_SHIPPING_FEE,
    DEMO_PROMO_CODE: DEMO_PROMO_CODE,
    PROMO_DISCOUNT_PERCENT: PROMO_DISCOUNT_PERCENT
  };

  // Legacy compatibility for any inline scripts
  window.PRODUCTS = PRODUCTS;
  window.addToCart = addToCart;

  // Initialize drawer & listeners once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      ensureDrawerHTML();
      updateCartUI();
      updateWishlistUI();
    });
  } else {
    ensureDrawerHTML();
    updateCartUI();
    updateWishlistUI();
  }
})();
