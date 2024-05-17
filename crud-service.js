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
                throw new Error(' Service Error status: ' + response.status + ' message: ' + response.statusText);
            }
            return response.json();
        } catch (error) {
            throw new Error('Error:' + error.message);
        }
    }

    async getToken() {
        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            return currentUser.token;
        } catch (error) {
            throw new Error(' Token Error: ' + error.message);
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
                throw new Error(' Service Error status: ' + response.status + ' message: ' + response.statusText);
            }
            return response.json();
        } catch (error) {
            throw new Error('Error:' + error.message);
        }
    }

    async getAllPlayers() {
        try {
            const response = await fetch(`${this.baseUrl}/players`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + await this.getToken()
                }
            }
            );
            if (!response.ok) {
                throw new Error(' Service Error status: ' + response.status + ' message: ' + response.statusText);
            }
            return response.json();
        } catch (error) {
            throw new Error('Error:' + error.message);
        }
    }

    async getAllTeams() {
        try {
            const response = await fetch(`${this.baseUrl}/teams`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + await this.getToken()
                }
            });
            if (!response.ok) {
                throw new Error(' Service Error status: ' + response.status + ' message: ' + response.statusText);
            }
            return response.json();
        } catch (error) {
            throw new Error('Error:' + error.message);
        }
    }

    async deletePlayer(playerId) {
        try {
          const response = await fetch(`${this.baseUrl}/players/${playerId}`, {
            method: "DELETE",
            headers: {
                'Authorization': 'Bearer ' + await this.getToken()
            }
          });

          if (!response.ok) {
            throw new Error(' Service Error status: ' + response.status + ' message: ' + response.statusText);
          }
          console.log("Player deleted successfully");
        } catch (error) {
            throw new Error('Error:' + error.message);
        }
    }
    
    async updatePlayer(playerId, updatedPlayerData) {
        try {
            const response = await fetch(`${this.baseUrl}/players/${playerId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + await this.getToken()
                },
                body: JSON.stringify(updatedPlayerData),
            });
            if (!response.ok) {
                throw new Error(' Service Error status: ' + response.status + ' message: ' + response.statusText);
            }
        } catch (error) {
            throw new Error('Error:' + error.message);
        }
    }

    async getPlayer(playerId) {
        try {
          const response = await fetch(`${this.baseUrl}/players/${playerId}`, {
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + await this.getToken()
            }
          });

          if (!response.ok) {
            throw new Error(' Service Error status: ' + response.status + ' message: ' + response.statusText);
          }
          return response.json();
        } catch (error) {
            throw new Error('Error:' + error.message);
        }
    }

    async getTeam(teamId) {
        try {
          const response = await fetch(`${this.baseUrl}/teams/${teamId}`, {
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + await this.getToken()
            }
          });

          if (!response.ok) {
            throw new Error(' Service Error status: ' + response.status + ' message: ' + response.statusText);
          }
          return response.json();
        } catch (error) {
            throw new Error('Error:' + error.message);
        }
    }

    async getUserTeam() {
        try {
            const response = await fetch(`${this.baseUrl}/myteam`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + await this.getToken()
                }
            });
            if (!response.ok) {
                throw new Error(' Service Error status: ' + response.status + ' message: ' + response.statusText);
            }
            return response.json();
        } catch (error) {
            throw new Error('Error:' + error.message);
        }
    }

    async saveUserTeam(playerIds) {
        try {
            const response = await fetch(`${this.baseUrl}/myteam`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + await this.getToken(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(playerIds)
            });
            if (!response.ok) {
                throw new Error(' Service Error status: ' + response.status + ' message: ' + response.statusText);
            }
            console.log("Team Saved successfully");
        } catch (error) {
            throw new Error('Error:' + error.message);
        }
    }
}