class CrudService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async login(username, password) {
        const url = `${this.baseUrl}/login`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            if (!response.ok) {
                throw new Error('Login failed');
            }
            return response.json();
        } catch (error) {
            throw new Error('Error:', error.message);
        }
    }

    async register(username, password) {
        const url = `${this.baseUrl}/register`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            if (!response.ok) {
                throw new Error('Registration failed');
            }
            return response.json();
        } catch (error) {
            throw new Error('Error:', error.message);
        }
    }

    async getAllPlayers() {
        try {
            const response = await fetch(`${this.apiUrl}/players`);
            if (!response.ok) {
                throw new Error('Error:', response.statusText);
            }
            return response.json();
        } catch (error) {
            throw new Error('Error:', error.message);
        }
    }

    async getAllTeams() {
        try {
            const response = await fetch(`${this.apiUrl}/teams`);
            if (!response.ok) {
                throw new Error('Error:', response.statusText);
            }
            return response.json();
        } catch (error) {
            throw new Error('Error:', error.message);
        }
    }

    async getUserTeam(userId) {
        try {
            const response = await fetch(`${this.apiUrl}/teams/${userId}`);
            if (!response.ok) {
                throw new Error('Error:', response.statusText);
            }
            return response.json();
        } catch (error) {
            throw new Error('Error:', error.message);
        }
    }

    async saveUserTeam(userId, playerIds) {
        try {
            const response = await fetch(`${this.apiUrl}/teams/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ players: playerIds })
            });
            if (!response.ok) {
                throw new Error('Error:', response.statusText);
            }
            return response.json();
        } catch (error) {
            throw new Error('Error:', error.message);
        }
    }
    
}