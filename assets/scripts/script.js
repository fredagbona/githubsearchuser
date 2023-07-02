localStorage.setItem('GITHUB_TOKEN', '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');
function printValue() {
  let searchUser = document.getElementById("search_bar").value;
  const accessToken = localStorage.getItem('GITHUB_TOKEN');
  const headers = new Headers();
  headers.append('Authorization', `token ${accessToken}`);

  function createModal(data) {
    var modal = document.createElement("div");
    modal.classList.add("modal");
  
    var modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");
  
    var closeBtn = document.createElement("span");
    closeBtn.classList.add("close");
    closeBtn.innerHTML = "&times;";
    closeBtn.addEventListener("click", closeModal);
  
    var heading = document.createElement("h3");
    heading.textContent = "Single User Infos";
  
    var paragraph = document.createElement("p");
    paragraph.innerHTML = "Name : " + data.name + "  <br> Login : " + data.login + " <br> Repos Count : " + data.public_repos + " <br> Folowers :  " + data.followers;
  
    var image = document.createElement("img");
    image.src = data.avatar_url;
    image.width = 100;
    image.style.borderRadius = '100%';
  
    var link = document.createElement("a");
    link.textContent = "Github Profile Link";
    link.href = data.html_url;
    link.target = "_blank";
  
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(heading);
    modalContent.appendChild(image);
    modalContent.appendChild(paragraph);
    modalContent.appendChild(link);
  
    modal.appendChild(modalContent);
  
    return modal;
  }
  

  function openModal(modal) {
    document.body.appendChild(modal);
    modal.style.display = "block";
    document.addEventListener("click", outsideModalClick);
  }

  function closeModal() {
    var modal = document.querySelector(".modal");
    document.body.removeChild(modal);
    document.removeEventListener("click", outsideModalClick);
  }

  function outsideModalClick(event) {
    var modal = document.querySelector(".modal");
    if (event.target === modal) {
      closeModal();
    }
  }

  if (searchUser == "") {
    document.getElementById("error_message").innerHTML = "";
    document.getElementById("printres").innerHTML = "";
    const perPage = 40; // Number of users per page
    const page = 1; // Page Number

    fetch(`https://api.github.com/users?per_page=${perPage}&page=${page}`, { headers })
      .then(response => response.json())
      .then(data => {
        for (let single_user in data) {
          let div = document.createElement("div");
          div.classList.add('results');
          const image = document.createElement("img");
          image.src = data[single_user].avatar_url;
          image.width = 150;
          image.style.borderRadius = '100%';
          const username = document.createElement("h3");
          username.innerHTML = "Username : " + data[single_user].login;
          div.appendChild(image);
          div.appendChild(username);
          document.getElementById("printres").appendChild(div);

          div.addEventListener("click", () => {
            fetchUserData(data[single_user].login, headers)
              .then(data => {
                var modal = createModal(data);
                openModal(modal);
              });
          });
        }
      });
  } else {
    fetch(`https://api.github.com/users/${searchUser}`, { headers })
      .then(response => response.json())
      .then(data => {
        if (data.message == "Not Found") {
          document.getElementById("printres").innerHTML = "";
          document.getElementById("error_message").innerHTML = "The search did not return any data";
        } else {
          document.getElementById("error_message").innerHTML = "";
          document.getElementById("printres").innerHTML = "";
          let div = document.createElement("div");
          div.classList.add('results');
          const image = document.createElement("img");
          image.src = data.avatar_url;
          image.width = 100;
          image.style.borderRadius = '100%';
          const username = document.createElement("h3");
          username.innerHTML = "Username : " + data.login;
          div.appendChild(image);
          div.appendChild(username);
          document.getElementById("printres").appendChild(div);

          div.addEventListener("click", () => {
            var modal = createModal(data);
            openModal(modal);
          });
        }
      });
  }
}

function fetchUserData(searchUser, headers) {
  return fetch(`https://api.github.com/users/${searchUser}`, { headers })
    .then(response => response.json())
    .then(data => {
      return data;
    });
}
