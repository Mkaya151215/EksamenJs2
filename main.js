document.addEventListener('DOMContentLoaded', function() {
    const crudService = new CrudService('https://example.com/api');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const usernameElement = document.getElementById('username');
    const logoutButton = document.getElementById('logout-btn');
    
    usernameElement.textContent = currentUser.username;

    if (currentUser) {
        usernameElement.textContent = currentUser.username;
    } else {
        window.location.href = 'index.html';
    }

    logoutButton.addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });

    try {
        // Futbolcuları ve takımları getir, filtrelere ekle
        const players = await crudService.getAllPlayers();
        const teams = await crudService.getAllTeams();
        const playerList = document.getElementById('players');
        const teamFilter = document.getElementById('team-filter');

        players.forEach(player => {
            const option = document.createElement('option');
            option.value = player.teamId;
            option.textContent = player.name;
            playerList.appendChild(option);
        });

        teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team.id;
            option.textContent = team.name;
            teamFilter.appendChild(option);
        });

        // Kullanıcının takımını getir ve listele
        const userTeam = await crudService.getUserTeam(currentUser.id);
        const myTeamList = document.getElementById('my-team-list');
        myTeamList.innerHTML = '';
        userTeam.forEach(player => {
            const li = document.createElement('li');
            li.textContent = player.name;
            myTeamList.appendChild(li);
        });

        // Filtreleme işlemleri
        const searchButton = document.getElementById('search-btn');
        searchButton.addEventListener('click', function() {
            const searchText = document.getElementById('search-input').value.toLowerCase();
            const selectedTeamId = document.getElementById('team-filter').value;
            const filteredPlayers = players.filter(player => {
                const name = player.name.toLowerCase();
                const teamId = player.teamId.toString();
                return name.includes(searchText) && (selectedTeamId === '' || teamId === selectedTeamId);
            });
            displayPlayers(filteredPlayers);
        });
    } catch (error) {
        console.error('Error:', error.message);
    }

    // Takımı kaydetme işlemi
    const saveTeamButton = document.getElementById('save-team-btn');
    saveTeamButton.addEventListener('click', async function() {
        try {
            const selectedPlayers = []; // Seçilen futbolcuların ID'lerini burada toplayın
            // Örnek: const selectedPlayers = [1, 3, 5]; // Oyuncu ID'leri
            await crudService.saveUserTeam(currentUser.id, selectedPlayers);
            alert('Team saved successfully!');
        } catch (error) {
            console.error('Error:', error.message);
            alert('Failed to save team. Please try again.');
        }
    });

    // Diğer işlemler buraya eklenecek
});

function displayPlayers(players) {
    const playerList = document.getElementById('players');
    playerList.innerHTML = '';
    players.forEach(player => {
        const option = document.createElement('option');
        option.value = player.teamId;
        option.textContent = player.name;
        playerList.appendChild(option);
    });
}