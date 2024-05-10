
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginRadio = document.getElementById('login');
    const registerRadio = document.getElementById('register');

    const crudService = new CrudService('https://example.com/api');
    loginRadio.addEventListener('change', function() {
        if (loginRadio.checked) {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        }
    });

    registerRadio.addEventListener('change', function() {
        if (registerRadio.checked) {
            registerForm.style.display = 'block';
            loginForm.style.display = 'none';
        }
    });

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        try {
            const response = await crudService.login(username, password);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            alert('Login successful!');
            window.location.href = 'main.html';
        } catch (error) {
            alert('Error:', error.message);
        }
    });

    registerForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        try {
            await crudService.register(username, password);
            alert('Registration successful! Please login.');
        } catch (error) {
            alert('Error:', error.message);
        }
    });
});
