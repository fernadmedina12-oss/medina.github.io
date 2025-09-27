 // Variables globales
    let cart = [];
    let currentUser = null;
    let isLoggedIn = false;

    // Elementos del DOM
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');
    const menuOverlay = document.getElementById('menu-overlay');
    const menuClose = document.getElementById('menu-close');
    
    // Elementos de autenticación
    const authPanel = document.getElementById('auth-panel');
    const authClose = document.getElementById('auth-close');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    
    // Botones y enlaces de navegación entre formularios
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const showForgotPassword = document.getElementById('show-forgot-password');
    const backToLoginFromForgot = document.getElementById('back-to-login-from-forgot');
    
    // Elementos del carrito
    const cartPanel = document.getElementById('cart-panel');
    const cartClose = document.getElementById('cart-close');
    const cartItems = document.getElementById('cart-items');
    const emptyCart = document.getElementById('empty-cart');
    const cartSummary = document.getElementById('cart-summary');
    
    // Elementos del perfil
    const profilePanel = document.getElementById('profile-panel');
    const profileClose = document.getElementById('profile-close');
    
    // Triggers de usuario
    const mobileUserTrigger = document.getElementById('mobile-user-trigger');
    const desktopUserTrigger = document.getElementById('desktop-user-trigger');
    const mobileUserMenu = document.getElementById('mobile-user-menu');
    const userDropdown = document.getElementById('user-dropdown');

    // Función para abrir/cerrar menú móvil
    function toggleMobileMenu() {
      menu.classList.toggle('active');
      menuOverlay.classList.toggle('active');
      menuToggle.classList.toggle('active');
      document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    }

    function closeMobileMenu() {
      menu.classList.remove('active');
      menuOverlay.classList.remove('active');
      menuToggle.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Función para abrir panel de autenticación
    function openAuthPanel() {
      authPanel.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeAuthPanel() {
      authPanel.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Función para cambiar entre formularios
    function showAuthForm(formToShow) {
      document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
      });
      formToShow.classList.add('active');
    }

    // Función para abrir carrito
    function openCartPanel() {
      cartPanel.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeCartPanel() {
      cartPanel.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Función para abrir perfil
    function openProfilePanel() {
      profilePanel.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeProfilePanel() {
      profilePanel.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Función para mostrar notificación
    function showNotification(message, type = 'success') {
      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.classList.add('show');
      }, 100);

      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, 3000);
    }

    // Función para agregar al carrito
    function addToCart(productId, name, price) {
      const existingItem = cart.find(item => item.id === productId);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: productId,
          name: name,
          price: parseInt(price),
          quantity: 1,
          image: `images/${name.toLowerCase().replace(' ', '-')}.jpg`
        });
      }
      
      updateCartDisplay();
      updateCartCount();
      showNotification(`${name} agregado al carrito`);
    }

    // Función para actualizar contador del carrito
    function updateCartCount() {
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      document.getElementById('desktop-cart-count').textContent = totalItems;
      document.getElementById('mobile-cart-count').textContent = totalItems;
    }

    // Función para actualizar la visualización del carrito
    function updateCartDisplay() {
      if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartSummary.style.display = 'none';
        cartItems.innerHTML = '<div class="empty-cart" id="empty-cart"><i class="fas fa-shopping-cart"></i><p>Tu carrito está vacío</p></div>';
        return;
      }

      emptyCart.style.display = 'none';
      cartSummary.style.display = 'block';

      let cartHTML = '';
      let total = 0;

      cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartHTML += `
          <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/80x80?text=${item.name}'">
            <div class="cart-item-details">
              <h4>${item.name}</h4>
              <p>$${item.price.toLocaleString()}</p>
              <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
              </div>
            </div>
            <div class="cart-item-total">
              <p>$${itemTotal.toLocaleString()}</p>
              <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        `;
      });

      cartItems.innerHTML = cartHTML;
      document.querySelector('.total-amount').textContent = `$${total.toLocaleString()}`;
    }

    // Función para actualizar cantidad
    function updateQuantity(productId, change) {
      const item = cart.find(item => item.id === productId);
      if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
          removeFromCart(productId);
        } else {
          updateCartDisplay();
          updateCartCount();
        }
      }
    }

    // Función para remover del carrito
    function removeFromCart(productId) {
      cart = cart.filter(item => item.id !== productId);
      updateCartDisplay();
      updateCartCount();
    }

    // Función para simular login
    function simulateLogin(email, name, lastname) {
      currentUser = { email, name, lastname };
      isLoggedIn = true;
      updateUserInterface();
      closeAuthPanel();
      showNotification('¡Sesión iniciada correctamente!');
    }

    // Función para cerrar sesión
    function logout() {
      currentUser = null;
      isLoggedIn = false;
      updateUserInterface();
      mobileUserMenu.style.display = 'none';
      userDropdown.style.display = 'none';
      showNotification('Sesión cerrada');
    }

    // Función para actualizar interfaz de usuario
    function updateUserInterface() {
      const userStatus = document.getElementById('user-status');
      const mobileUserName = document.getElementById('mobile-user-name');
      const profileUserName = document.getElementById('profile-user-name');

      if (isLoggedIn && currentUser) {
        // Desktop
        userStatus.textContent = `${currentUser.name}`;
        
        // Mobile - mantener solo el icono
        mobileUserName.textContent = '';
        mobileUserName.style.display = 'none';
        
        // Profile panel
        profileUserName.textContent = `${currentUser.name} ${currentUser.lastname}`;
        document.getElementById('profile-name').value = currentUser.name;
        document.getElementById('profile-lastname').value = currentUser.lastname;
        document.getElementById('profile-email').value = currentUser.email;
      } else {
        // Desktop
        userStatus.textContent = 'Login';
        
        // Mobile
        mobileUserName.style.display = 'none';
        
        // Profile panel
        profileUserName.textContent = 'Usuario';
        document.getElementById('profile-name').value = '';
        document.getElementById('profile-lastname').value = '';
        document.getElementById('profile-email').value = '';
      }
    }

    // Event Listeners
    document.addEventListener('DOMContentLoaded', function() {
      // Menú móvil
      menuToggle.addEventListener('click', toggleMobileMenu);
      menuClose.addEventListener('click', closeMobileMenu);
      menuOverlay.addEventListener('click', closeMobileMenu);

      // Autenticación - abrir panel
      mobileUserTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        if (isLoggedIn) {
          const menu = document.getElementById('mobile-user-menu');
          menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        } else {
          openAuthPanel();
        }
      });

      desktopUserTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        if (isLoggedIn) {
          const dropdown = document.getElementById('user-dropdown');
          dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        } else {
          openAuthPanel();
        }
      });

      // Cerrar paneles
      authClose.addEventListener('click', closeAuthPanel);
      cartClose.addEventListener('click', closeCartPanel);
      profileClose.addEventListener('click', closeProfilePanel);

      // Navegación entre formularios
      showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        showAuthForm(registerForm);
      });

      showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        showAuthForm(loginForm);
      });

      showForgotPassword.addEventListener('click', (e) => {
        e.preventDefault();
        showAuthForm(forgotPasswordForm);
      });

      backToLoginFromForgot.addEventListener('click', (e) => {
        e.preventDefault();
        showAuthForm(loginForm);
      });

      // Carrito
      document.getElementById('desktop-cart').addEventListener('click', (e) => {
        e.preventDefault();
        openCartPanel();
      });

      document.getElementById('mobile-cart').addEventListener('click', (e) => {
        e.preventDefault();
        openCartPanel();
      });

      // Perfil
      document.getElementById('desktop-profile').addEventListener('click', (e) => {
        e.preventDefault();
        openProfilePanel();
      });

      document.getElementById('mobile-profile').addEventListener('click', (e) => {
        e.preventDefault();
        openProfilePanel();
      });

      // Logout
      document.getElementById('desktop-logout').addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });

      document.getElementById('mobile-logout').addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });

      // Formularios
      document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Simulación de login (en producción aquí irían las validaciones reales)
        if (email && password) {
          simulateLogin(email, 'Usuario', 'Demo');
        }
      });

      document.getElementById('registerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const lastname = document.getElementById('register-lastname').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        
        if (password !== confirmPassword) {
          showNotification('Las contraseñas no coinciden', 'error');
          return;
        }
        
        if (name && lastname && email && password) {
          simulateLogin(email, name, lastname);
        }
      });

      document.getElementById('profileForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('profile-name').value;
        const lastname = document.getElementById('profile-lastname').value;
        const email = document.getElementById('profile-email').value;
        
        if (currentUser) {
          currentUser.name = name;
          currentUser.lastname = lastname;
          currentUser.email = email;
          updateUserInterface();
          showNotification('Perfil actualizado correctamente');
          closeProfilePanel();
        }
      });

      // Agregar al carrito
      document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          const producto = e.target.closest('.producto');
          const id = parseInt(producto.dataset.id);
          const name = producto.dataset.name;
          const price = producto.dataset.price;
          addToCart(id, name, price);
        });
      });

      // Toggle password visibility
      document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', () => {
          const input = toggle.previousElementSibling;
          const icon = toggle.querySelector('i');
          
          if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
          } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
          }
        });
      });

      // Cerrar dropdowns al hacer click fuera
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-menu-container')) {
          userDropdown.style.display = 'none';
        }
        if (!e.target.closest('.mobile-user-container')) {
          mobileUserMenu.style.display = 'none';
        }
      });

      // Cerrar paneles con Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (authPanel.classList.contains('active')) {
            closeAuthPanel();
          }
          if (cartPanel.classList.contains('active')) {
            closeCartPanel();
          }
          if (profilePanel.classList.contains('active')) {
            closeProfilePanel();
          }
          if (menu.classList.contains('active')) {
            closeMobileMenu();
          }
        }
      });

      // Prevenir envío de formulario de contacto (ejemplo)
      document.querySelector('.contacto form').addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Mensaje enviado correctamente');
        e.target.reset();
      });
    });

    // Funciones globales para usar desde HTML
    window.updateQuantity = updateQuantity;
    window.removeFromCart = removeFromCart;

    // LOGIN con PHP
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const res = await fetch("login.php", {
    method: "POST",
    body: new URLSearchParams({ email, password }),
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  });

  const data = await res.json();
  if (data.status === "ok") {
    simulateLogin(data.user.email, data.user.nombre, data.user.apellido);
  } else {
    showNotification(data.msg, "error");
  }
});

// REGISTRO con PHP
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('register-name').value;
  const lastname = document.getElementById('register-lastname').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;

  if (password !== confirmPassword) {
    showNotification("Las contraseñas no coinciden", "error");
    return;
  }

  const res = await fetch("register.php", {
    method: "POST",
    body: new URLSearchParams({ name, lastname, email, password }),
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  });

  const data = await res.json();
  if (data.status === "ok") {
    simulateLogin(email, name, lastname);
  } else {
    showNotification(data.msg, "error");
  }
});
