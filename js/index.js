document.addEventListener('DOMContentLoaded', function () {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (!users.some(user => user.email === "admin@gym.com")) {
        users.push({
            name: "Admin",
            email: "admin@gym.com",
            password: "admin123"
        });
        localStorage.setItem('users', JSON.stringify(users));
    }
  });
  
  document.addEventListener('DOMContentLoaded', function () {
    let loginFormWrapper = document.getElementById('loginFormWrapper');
    let registerFormWrapper = document.getElementById('registerFormWrapper');
  
    document.getElementById('switchToRegister').addEventListener('click', function (event) {
        event.preventDefault();
        loginFormWrapper.style.display = 'none';
        registerFormWrapper.style.display = 'block';
    });
  
    document.getElementById('switchToLogin').addEventListener('click', function (event) {
        event.preventDefault();
        registerFormWrapper.style.display = 'none';
        loginFormWrapper.style.display = 'block';
    });
  });
  
  function showError(inputId, message) {
    let inputField = document.getElementById(inputId);
    let errorSpan = inputField.nextElementSibling;
    errorSpan.textContent = message;
    errorSpan.style.color = "red";
  }
  
  function clearError(inputId) {
    let inputField = document.getElementById(inputId);
    let errorSpan = inputField.nextElementSibling;
    errorSpan.textContent = "";
  }
  
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  document.getElementById('registerForm').addEventListener('submit', function (event) {
    event.preventDefault();
  
    let valid = true;
    let name = document.getElementById('registerName');
    let email = document.getElementById('registerEmail');
    let password = document.getElementById('registerPassword');
    let confirmPassword = document.getElementById('confirmPassword');
  
    if (!name.value.trim()) {
        showError('registerName', 'Tên không được để trống');
        valid = false;
    } else {
        clearError('registerName');
    }
  
    if (!email.value.trim()) {
        showError('registerEmail', 'Email không được để trống');
        valid = false;
    } else if (!validateEmail(email.value.trim())) {
        showError('registerEmail', 'Email không hợp lệ');
        valid = false;
    } else {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.some(user => user.email === email.value.trim())) {
            showError('registerEmail', 'Email đã tồn tại');
            valid = false;
        } else {
            clearError('registerEmail');
        }
    }
  
    if (!password.value) {
        showError('registerPassword', 'Mật khẩu không được để trống');
        valid = false;
    } else if (password.value.includes(' ') || password.value.length < 8) {
        showError('registerPassword', 'Mật khẩu ít nhất 8 ký tự và không chứa dấu cách');
        valid = false;
    } else {
        clearError('registerPassword');
    }
  
    if (!confirmPassword.value) {
        showError('confirmPassword', 'Vui lòng nhập lại mật khẩu');
        valid = false;
    } else if (password.value !== confirmPassword.value) {
        showError('confirmPassword', 'Mật khẩu không khớp');
        valid = false;
    } else {
        clearError('confirmPassword');
    }
  
    if (valid) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users.push({
            name: name.value.trim(),
            email: email.value.trim(),
            password: password.value
        });
        localStorage.setItem('users', JSON.stringify(users));
        alert("Đăng ký thành công!");
        window.location.href = "index.html"; 
    }
  });
  
  document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
  
    let valid = true;
    let email = document.getElementById('loginEmail');
    let password = document.getElementById('loginPassword');
  
    if (!email.value.trim()) {
        showError('loginEmail', 'Email không được để trống');
        valid = false;
    } else if (!validateEmail(email.value.trim())) {
        showError('loginEmail', 'Email không hợp lệ');
        valid = false;
    } else {
        clearError('loginEmail');
    }
  
    if (!password.value) {
        showError('loginPassword', 'Mật khẩu không được để trống');
        valid = false;
    } else {
        clearError('loginPassword');
    }
  
    if (valid) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        let user = users.find(user => user.email === email.value.trim() && user.password === password.value);
  
        if (user) {
            // Lưu người đang đăng nhập
localStorage.setItem("currentUser", JSON.stringify(user));

            if (user.email === "admin@gym.com") {
                window.location.href = "dashboard-admin.html";
            } else {
                window.location.href = "gymWeb.html"; 
            }
        } else {
            showError('loginPassword', 'Email hoặc mật khẩu không đúng');
        }
    }
  });
  