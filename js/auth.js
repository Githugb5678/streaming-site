(function () {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const message = document.getElementById('authMessage');
  const tabs = document.querySelectorAll('.auth-tabs button');

  if (!loginForm || !signupForm) return;

  tabs.forEach((button) => {
    button.addEventListener('click', () => {
      tabs.forEach((b) => b.classList.remove('active'));
      button.classList.add('active');
      const isLogin = button.dataset.view === 'login';
      loginForm.classList.toggle('hidden', !isLogin);
      signupForm.classList.toggle('hidden', isLogin);
      message.textContent = '';
    });
  });

  signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim().toLowerCase();
    const password = document.getElementById('signupPassword').value;
    const users = StorageManager.getUsers();

    if (users.some((user) => user.email === email)) {
      message.textContent = 'User already exists. Please login.';
      return;
    }

    StorageManager.saveUser({ name, email, password, createdAt: new Date().toISOString() });
    StorageManager.setCurrentUser(email);
    window.location.href = 'index.html';
  });

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;
    const user = StorageManager.getUsers().find((u) => u.email === email && u.password === password);

    if (!user) {
      message.textContent = 'Invalid email or password.';
      return;
    }

    StorageManager.setCurrentUser(email);
    window.location.href = 'index.html';
  });
})();
