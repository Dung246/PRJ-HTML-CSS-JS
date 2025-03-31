document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');
    const loginWrapper = document.getElementById('loginFormWrapper');
    const registerWrapper = document.getElementById('registerFormWrapper');

    switchToRegister.addEventListener('click', function (event) {
        event.preventDefault();
        loginWrapper.style.display = 'none';
        registerWrapper.style.display = 'block';
    });

    switchToLogin.addEventListener('click', function (event) {
        event.preventDefault();
        registerWrapper.style.display = 'none';
        loginWrapper.style.display = 'block';
    });

    function showError(inputId, message) {
        document.getElementById(inputId + 'Error').textContent = message;
    }
    function clearError(inputId) {
        document.getElementById(inputId + 'Error').textContent = '';
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    registerForm.addEventListener('submit', function (event) {
        event.preventDefault();
        let valid = true;

        const name = document.getElementById('registerName');
        const email = document.getElementById('registerEmail');
        const password = document.getElementById('registerPassword');
        const confirmPassword = document.getElementById('confirmPassword');
        if (!name.value.trim()) {
            showError('registerName', 'Họ và tên không được để trống');
            valid = false;
        } else {
            clearError('registerName');
        }
        if (!email.value.trim()) {
            showError('registerEmail', 'Email không được để trống');
            valid = false;
        } else if (!validateEmail(email.value.trim())) {
            showError('registerEmail', 'Email không đúng định dạng');
            valid = false;
        } else {
            clearError('registerEmail');
        }

        if (!password.value) {
            showError('registerPassword', 'Mật khẩu không được để trống');
            valid = false;
        } else if (password.value.includes(" ")) {
            showError('registerPassword', 'Mật khẩu không được chứa dấu cách');
            valid = false;
        } else if (password.value.length < 8) {
            showError('registerPassword', 'Mật khẩu tối thiểu 8 ký tự');
            valid = false;
        } else {
            clearError('registerPassword');
        }
        if (!confirmPassword.value) {
            showError('confirmPassword', 'Mật khẩu xác nhận không được để trống');
            valid = false;
        } else if (password.value !== confirmPassword.value) {
            showError('confirmPassword', 'Mật khẩu không trùng khớp');
            valid = false;
        } else {
            clearError('confirmPassword');
        }

        if (valid) {
            let users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.some(user => user.email === email.value.trim())) {
                showError('registerEmail', 'Email đã tồn tại');
                return;
            }
            users.push({
                name: name.value.trim(),
                email: email.value.trim(),
                password: password.value
            });
            localStorage.setItem('users', JSON.stringify(users));
            window.location.href = "/";
        }
    });

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        let valid = true;
        const email = document.getElementById('loginEmail');
        const password = document.getElementById('loginPassword');
        if (!email.value.trim()) {
            showError('loginEmail', 'Email không được để trống');
            valid = false;
        } else if (!validateEmail(email.value.trim())) {
            showError('loginEmail', 'Email không đúng định dạng');
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
            const user = users.find(user => user.email === email.value.trim() && user.password === password.value);
            if (user) {
                window.location.href = "/";
            } else {
                showError('loginPassword', 'Email hoặc mật khẩu không đúng');
            }
        }
    });
});
