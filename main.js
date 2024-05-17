let players = [];
let myTeam = [];
let teams = [];
let buttonsDeleteDOM = [];
let buttonsAddDOM = [];
const teamFilter = document.getElementById('team-filter');
const crudService = new CrudService('http://localhost:3000');
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const usernameElement = document.getElementById('username');
const logoutButton = document.getElementById('logout-btn');
const playersDOM = document.querySelector("#players-dom");
let myTeamDOM = document.querySelector("#my-team-dom");

document.addEventListener('DOMContentLoaded', async function () {
    const ui = new UI();

    if (currentUser) {
        usernameElement.textContent = currentUser.username;
    } else {
        window.location.href = 'index.html';
    }

    logoutButton.addEventListener('click', function () {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('myTeam');
        window.location.href = 'index.html';
    });

    try {

        myTeam = await Memory.getMyTeam();

        await crudService.getAllPlayers()
            .then((response) => {
                players = response;
                ui.setupAPP();
            });

        await ui.displayPlayers(players);

        teams = await crudService.getAllTeams();

        teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team.id;
            option.textContent = team.name;
            teamFilter.appendChild(option);
        });

        const searchButton = document.getElementById('search-btn');
        searchButton.addEventListener('click', event => {
            (async () => {
                const searchText = document.getElementById('search-input').value.toLowerCase();
                const selectedTeamId = document.getElementById('team-filter').value;
                const filteredPlayers = players.filter(player => {
                    const name = player.name.toLowerCase();
                    const teamId = player.teamId.toString();
                    return name.includes(searchText) && (selectedTeamId === '' || teamId === selectedTeamId);
                });

                await ui.displayPlayers(filteredPlayers);
            })();
        });

    } catch (error) {
        console.error('Error:', error.message);
        //window.location.href = 'index.html';
        alert(error.message);
    }

    const saveTeamButton = document.getElementById('save-team-btn');
    saveTeamButton.addEventListener('click', async function () {
        try {
            await crudService.saveUserTeam(myTeam);
            alert('Team saved successfully!');
        } catch (error) {
            console.error('Error:', error.message);
            alert('Failed to save team. Please try again.');
        }
    });

});

class Memory {

    static saveMyTeam(myTeam) {
        localStorage.setItem("myTeam", JSON.stringify(myTeam));
    }

    static async getMyTeam() {
        const localMyTeam = localStorage.getItem("myTeam");
        if (!localMyTeam) {
            myTeam = await crudService.getUserTeam(currentUser.id);
            localStorage.setItem("myTeam", JSON.stringify(myTeam));
        }
        else {
            myTeam = JSON.parse(localMyTeam);
        }

        return myTeam;
    }
}
class UI {
    async displayPlayers(players) {
        let playersDomHtml = "";
        players.forEach(player => {
            playersDomHtml += `
        <div class="col-lg-4 col-md-6">
            <div class="players">
                <div class="players-image">
                    <img src="${player.profileImage}" alt="players" class="img-fluid" />
                </div>
                <div class="players-hover team-upper">
                    <span class="players-team d-inline-block text-truncate" data-toggle="tooltip" data-placement="top" title='${player.currentTeam}'>
                        ${player.currentTeam}
                    </span>
                    <button class="btn-players btn-show-team-details" data-id=${player.teamId}>
                        <i class="fas fa-cart-white fa-info-circle"></i>
                    </button>
                </div>
                <div class="players-hover player-buttom">
                    <span class="players-title d-inline-block text-truncate" data-toggle="tooltip" data-placement="top" title='${player.name}'>${player.name}</span>
                    <button class="btn-players btn-show-details" data-id=${player.id}>
                        <i class="fas fa-cart-white fa-info-circle"></i>
                    </button>
                    <button class="btn-players btn-delete" data-id=${player.id}>
                        <i class="fas fa-cart-white fa-trash"></i>
                    </button>
                    <button class="btn-players btn-add" data-id=${player.id}>
                        <i class="fas fa-cart-white fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
        `;
        });
        playersDOM.innerHTML = playersDomHtml;
        await this.getPlayersButtons();
    }

    async getPlayersButtons() {
        const buttonsDelete = [...document.querySelectorAll(".btn-delete")];
        buttonsDeleteDOM = buttonsDelete;
        buttonsDelete.forEach((button) => {
            let id = button.dataset.id;
            let inTeam = myTeam.find((item) => item === id);
            if (inTeam) {
                button.setAttribute("disabled", "disabled");
                button.style.opacity = ".3";
            }
            button.addEventListener("click", (event) => {
                event.target.disabled = true;
                event.target.style.opacity = ".3";
                (async () => {
                    await crudService.deletePlayer(id);
                    location.reload(true);
                })();
            });
        });

        const buttonsAddMyTeam = [...document.querySelectorAll(".btn-add")];
        buttonsAddDOM = buttonsAddMyTeam;
        buttonsAddMyTeam.forEach((button) => {
            let id = button.dataset.id;
            let inTeam = myTeam.find((item) => item === id);
            if (inTeam) {
                button.setAttribute("disabled", "disabled");
                button.style.opacity = ".3";
            }
            button.addEventListener("click", (event) => {
                event.target.disabled = true;
                event.target.style.opacity = ".3";
                let deleteButton = this.getDeleteButton(id);
                deleteButton.setAttribute("disabled", "disabled");
                deleteButton.style.opacity = ".3";
                (async () => {
                    myTeam = [...myTeam, id];
                    Memory.saveMyTeam(myTeam);
                    this.addMyTeam(id);
                })();
            });
        });

        const buttonsDetails = [...document.querySelectorAll(".btn-show-details")];
        buttonsDetails.forEach((button) => {
            const playerId = button.dataset.id;
            button.addEventListener("click", (event) => {
                window.location.href = `player-detail.html?id=${playerId}`;
            });
        });

        const buttonsTeamDetails = [...document.querySelectorAll(".btn-show-team-details")];
        buttonsTeamDetails.forEach((button) => {
            const teamId = button.dataset.id;
            button.addEventListener("click", (event) => {
                window.location.href = `team-detail.html?id=${teamId}`;
            });
        });
    }

    addMyTeam(id) {
        const player = players.find((item) => item.id === id);
        const div = document.createElement("div");
        div.classList.add("col-lg-4");
        div.classList.add("col-md-6");
        div.innerHTML = `<div class="players">
                            <div class="players-image">
                                <img src="${player.profileImage}" alt="players" class="img-fluid" />
                            </div>
                            <div class="players-hover player-buttom">
                                <span class="players-title d-inline-block text-truncate" data-toggle="tooltip" data-placement="top" title='${player.name}'>${player.name}</span>
                                <button class="btn-players btn-remove-myteam" data-id=${player.id}>
                                    <i class="fas fa-cart-white fa-minus"></i>
                                </button>
                            </div>
                        </div>
            `;
        const removeButton = [...div.querySelectorAll('.btn-remove-myteam')][0];

        removeButton.addEventListener("click", (event) => {
            event.target.disabled = true;
            event.target.style.opacity = ".3";
            this.removeFromMyTeam(id);
        });
        myTeamDOM.appendChild(div);
    }

    setupAPP() {
        this.populateMyTeam();
    }

    populateMyTeam() {
        myTeamDOM.innerHTML = '';
        myTeam.forEach((item) => this.addMyTeam(item));
    }

    removeFromMyTeam(id) {
        myTeam = myTeam.filter((x) => x !== id);
        Memory.saveMyTeam(myTeam);
        let button = this.getAddButton(id);
        button.disabled = false;
        button.style.opacity = "1";
        let buttonDelete = this.getDeleteButton(id);
        buttonDelete.disabled = false;
        buttonDelete.style.opacity = "1";
        this.populateMyTeam();
    }

    getAddButton(id) {
        return buttonsAddDOM.find((button) => button.dataset.id === id);
    }

    getDeleteButton(id) {
        return buttonsDeleteDOM.find((button) => button.dataset.id === id);
    }
}