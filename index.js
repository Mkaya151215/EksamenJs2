
document.addEventListener('DOMContentLoaded', function() {
    
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginButton = document.getElementById('login-btn');
    const registerButton = document.getElementById('register-btn');
    const loginRadio = document.getElementById('login');
    const registerRadio = document.getElementById('register');

    const crudService = new CrudService('http://localhost:3000');
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

    loginButton.addEventListener('click', async function(event) {
        event.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        try {
            const response = await crudService.login(username, password);
            localStorage.setItem('currentUser', JSON.stringify(response));
            window.location.href = 'main.html';
        } catch (error) {
            alert(error.message);
        }
    });

    registerButton.addEventListener('click', async function(event) {
        event.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        try {
            const response = await crudService.register(username, password);
            localStorage.setItem('currentUser', JSON.stringify(response));
            window.location.href = 'main.html';
        } catch (error) {
            alert(error.message);
        }
    });
});
