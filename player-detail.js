const playerDetail = document.querySelector(".player-detail");
const playerDetailTitle = document.getElementById("player-detail-title");
const playerDetailPrice = document.getElementById("player-detail-price");
const playerDetailDescription = document.getElementById("player-detail-description");
const playerDetailImage = document.getElementById("player-detail-image");
const editButton = document.getElementById("edit-player-detail");
const closeButton = document.getElementById("close-player-detail");

const popup = document.querySelector('.popup');
const popupTitle = document.getElementById('popup-title');
const popupPrice = document.getElementById('popup-price');
const popupImage = document.getElementById('popup-image');

const updatePopupButton = document.getElementById('update-popup');
const closePopupButton = document.getElementById('close-popup');

const playerService = new CrudService('http://localhost:3000');

// Funksjon for å hente spillerdetaljer fra spørringsparametere
function getPlayerIdFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// Funksjon for å vise spillerdetaljer på siden med spillerdetaljer
function displayPlayerDetails() {
  (async () => {
    let player = await PlayerCrud.getPlayer(getPlayerIdFromQuery());
    playerDetailTitle.textContent = player.name;
    playerDetailDescription.textContent = 'Age: ' + player.age 
                                            + ' - Nation: ' + player.nation
                                            + ' - Current Team: ' + player.currentTeam
                                            + ' - Position: ' + player.position
                                            + ' - Goal Score: ' + player.goalsScored;
    playerDetailPrice.textContent = "$ " + player.transferFee;
    playerDetailImage.src = player.profileImage;
    editButton.addEventListener("click", event => {
      popupTitle.value = player.name;
      popupPrice.value= parseInt(player.transferFee);
      popupImage.src= player.profileImage;
      popup.style.display = 'flex';
    });
    updatePopupButton.addEventListener("click", event => {
      (async() => {
        await playerService.updatePlayer(player.id, { name: popupTitle.value, transferFee: popupPrice.value + ' million' });
        location.reload(true);
      })();
    });
    playerDetail.style.display = "flex";
  })();
}

document.addEventListener("DOMContentLoaded", () => {
  // Kaller funksjonen for å vise spillerdetaljer når siden lastes inn
  window.addEventListener('load', displayPlayerDetails);


  closeButton.addEventListener("click", () => {
      window.location.href = `main.html`;
  });

  closePopupButton.addEventListener('click', () => {
    popup.style.display = 'none';
  });
});


class PlayerCrud {
  static async savePlayers(id, title, description) {
    await playerService.updatePlayer(id, { title: title, description: description });
  }

  static async getPlayer(id) {
    let data = await playerService.getPlayer(id);
    return data;
  }
}


