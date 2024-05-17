const teamDetail = document.querySelector(".team-detail");
const teamDetailTitle = document.getElementById("team-detail-title");
const teamDetailPrice = document.getElementById("team-detail-price");
const teamDetailDescription = document.getElementById(
  "team-detail-description"
);
const teamDetailImage = document.getElementById("team-detail-image");
const editButton = document.getElementById("edit-team-detail");
const closeButton = document.getElementById("close-team-detail");

const closePopupButton = document.getElementById("close-popup");

const teamService = new CrudService("http://localhost:3000");

//Funksjon for å hente teamdetaljer fra spørringsparametere
function getTeamIdFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// Funksjon for å vise lagdetaljer på lagets detaljside
function displayTeamDetails() {
  (async () => {
    let team = await TeamCrud.getTeam(getTeamIdFromQuery());
    teamDetailTitle.textContent = team.teamName;
    teamDetailDescription.textContent =
      "President: " +
      team.president +
      " - Championships: " +
      team.championships +
      " - League: " +
      team.league;
    teamDetailPrice.textContent = " Market Value: " + team.marketValue;
    teamDetailImage.src = team.logo;
    teamDetail.style.display = "flex";
  })();
}

document.addEventListener("DOMContentLoaded", () => {
  // Kaller funksjonen for å vise lagdetaljer når siden lastes inn
  window.addEventListener("load", displayTeamDetails);

  closeButton.addEventListener("click", () => {
    window.location.href = `main.html`;
  });
});

class TeamCrud {
  static async getTeam(id) {
    let data = await teamService.getTeam(id);
    return data;
  }
}
