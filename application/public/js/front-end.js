let searchButton = document.getElementById("search-button");
let input = document.getElementById("search-text");
let dropdowns = document.querySelectorAll(".search-panel");
let password = document.getElementById("password");
let matchPassword = document.getElementById("password");

if(password){
  password.addEventListener('focusout', function(){
    let passwordChecker = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

    if(!passwordChecker.test(password.value)){
        
        if(document.getElementById("text-alert-password")==null){
            let divMessagePassword = document.createElement("div");
            let divMessagePasswordText = document.createTextNode("Password must have at least one lower case, one upper case and one digit");
            divMessagePassword.appendChild(divMessagePasswordText);
            divMessagePassword.setAttribute("id", "text-alert-password");
            document.getElementById("div-input-password").appendChild(divMessagePassword);
        }else{
            document.getElementById("text-alert-password").innerText("Password must have at least one lower case, one upper case and one digit");
        }  
    }else{
        if(document.getElementById("text-alert-password")!=null){
            document.getElementById("text-alert-password").textContent = "";
        }
    }
    
});
}




dropdowns.forEach((dropdown) => {
  let select = dropdown.querySelector(".select");
  let caret = dropdown.querySelector(".caret");
  let menu = dropdown.querySelector(".dropdown-menu");
  let options = dropdown.querySelectorAll(".dropdown-menu li");
  let selected = dropdown.querySelector(".selected");
  let selectedHidden = dropdown.querySelector(".selectedCat");

  console.log(
    "here is the list of elements select:" +
      select +
      " , caret: " +
      caret +
      ",  menu: " +
      menu +
      " , options: " +
      options +
      ", selected: " +
      selected +
      ", hidden: " +
      selectedHidden
  );

  options.forEach((option) => {
    option.addEventListener("click", () => {
      selectedHidden.value = option.innerText;
      selected.innerText = option.innerText;

      options.forEach((option) => {
        option.classList.remove("active-item");
      });
      option.classList.add("active-item");
    });
  });
});

function setflashMessageFadeOut(flashMessage) {
  setTimeout(() => {
    let currentOpacity = 1.0;
    let timer = setInterval(() => {
      if (currentOpacity < 0.5) {
        clearInterval(timer);
        flashMessage.remove();
      }
      currentOpacity = currentOpacity - 0.05;
      flashMessage.style.opacity = currentOpacity;
    }, 50);
  }, 3000);
}

function addFlashFromFrontEnd(message) {
  let flashMessageDiv = document.createElement("div");
  let innerFlashDiv = document.createElement("div");
  let innerTextNode = document.createTextNode(message);
  innerFlashDiv.appendChild(innerTextNode);
  flashMessageDiv.appendChild(innerFlashDiv);
  flashMessageDiv.setAttribute("id", "flashMessage");
  innerFlashDiv.setAttribute("class", "alert alert-success");
  document.getElementsByTagName("body")[0].appendChild(flashMessageDiv);
  console.log(document.getElementsByTagName("body")[0]);
  setflashMessageFadeOut(flashMessageDiv);
}

function createSearchConditionMessage(categorySearch, searchText) {
  let innerTextNode = document.createTextNode(
    categorySearch + " > " + searchText
  );
  let searchCondition = document.getElementById("search-condition");
  searchCondition.innerText = "";
  searchCondition.appendChild(innerTextNode);
}

function createResultMessage(messageData) {
  let innerTextNode = document.createTextNode(messageData);
  let photoCount = document.getElementById("photo-count");
  photoCount.innerText = "";
  photoCount.appendChild(innerTextNode);
  return;
}

function createCard(postData) {
  return `
        <div id="post-${postData.post_id}" class="card text-center mw-xl-15 mw-md-20 mw-sm-25 m-auto my-2">
            <img class="card-image bg-grey w-100" src="${postData.post_thumbnail}" alt="Missing Image">
            <div class="card-body bg-grey w-100">
                <p class="card-title w-100">${postData.title}</p>
                <p clas="card-text w-100">${postData.post_description}</p>
                <p class="card-price w-100">$ ${postData.price}</p>
                <a href="/post/${postData.post_id}" class="anchor-buttons btn btn-primary w-100 m-auto">Post Details</a>
            </div>
        </div>`;
}

function executeSearch() {
  console.log("searching...");

  let searchText = document.getElementById("search-text").value;

  let inputChecker = /\w+/;
  if (!inputChecker.test(searchText)) {
    searchText = "";
  }
  let categorySearch = document.getElementById(
    "search_concept selected"
  ).innerText;

  categorySearch.toString();

  console.log("cat:" + categorySearch);

  let searchTerm = searchText + "-" + categorySearch;
  let searchURL = `/posts/search?search=${searchTerm}`;

  //

  let mainContent = document.getElementById("main-content");

  console.log(window.location.href);

  fetch(searchURL)
    .then((data) => {
      console.log(data);
      return data.json();
    })
    .then((data_json) => {
      if (data_json.message) {
        // addFlashFromFrontEnd(data_json.message);
        createSearchConditionMessage(categorySearch, searchText);
        createResultMessage(data_json.message);
      }
      let newMainContentHTML = "";
      data_json.results.forEach((row) => {
        console.log(row);
        newMainContentHTML += createCard(row);
      });
      mainContent.innerHTML = newMainContentHTML;
    })
    .catch((err) => console.log(err));

  let mainpagePicture = document.getElementById("mainpage-picture");
  if (mainpagePicture) {
    mainpagePicture.style.display = "none";
  }
}

// if (searchButton) {
//     searchButton.onclick = executeSearch;

// }

// if(input)
// {
//     input.addEventListener('keydown', function(event) {
//     if(event.key === 'Enter'){
//         console.log("Enter pressed");
//         executeSearch();

//     }
// })
// }

function examplePlaceholder() {
  let category = document.getElementById("search_concept selected").innerText;
  let searchText = document.getElementById("search-text");
  if (category === "All") {
    searchText.placeholder = " e.g. Janis Joplin";
  } else if (category === "Videos") {
    searchText.placeholder = " e.g. YouTube";
  } else if (category === "Images") {
    searchText.placeholder = " e.g. mountains";
  } else if (category === "Music") {
    searchText.placeholder = " e.g. Justin Bieber";
  } else if (category === "Ebooks") {
    searchText.placeholder = " e.g. Zybooks";
  } else if (category === "Slides") {
    searchText.placeholder = " e.g. csc648";
  }
}
