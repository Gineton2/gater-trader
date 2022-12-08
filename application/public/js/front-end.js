let searchButton = document.getElementById("search-button");
let input = document.getElementById("search-text");
let dropdowns = document.querySelectorAll(".search-panel");
let password = document.getElementById("password");
let matchPassword = document.getElementById("password");
const warningText = document.getElementById('warning');

let logout = document.getElementById('logout');
if (logout) {
    logout.onclick = (event) => {
        fetch('users/logout', {
            method: "POST"
        })
        .then((data) => {
            // data.locals.logged = false;
            console.log("logout");
            location.replace('/');

        })
    }

}


input.addEventListener('input', checkSearchtext);
searchButton.addEventListener('click', checkSearchtext);

let postButton = document.getElementById("post-button");
if(postButton){
  postButton.addEventListener('click', checkPost);

}

function checkPost (event) {
  let file = document.getElementById('formFileLg');
  if (file.value==null) {
      event.preventDefault();
  }
}

function checkSearchtext (event) {
    let validText = /\W/;
    if (validText.test(input.value)) {
        event.preventDefault();
        displayWarning();
    }
}
let warningTimeout;
function displayWarning() {
    if (!warningText.hidden) {
        clearTimeout(warningTimeout);
    } else {
        warningText.hidden = false;
    }
    warningTimeout = setTimeout(() => {
        warningText.hidden = true;
        warningTimeout = -1;
    }, 3000)
}

if(password){
  password.addEventListener('focusout', function(){
    let passwordChecker = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

    if(!passwordChecker.test(password.value)){
        
        if(document.getElementById("text-alert-password")==null){
            let divMessagePassword = document.createElement("div");
            let divMessagePasswordText = document.createTextNode("Password must have at least one lower case, one upper case and one digit");
            divMessagePassword.appendChild(divMessagePasswordText);
            divMessagePassword.setAttribute("id", "text-alert-password");
            divMessagePassword.className = "text-danger text-center"
            document.getElementById("div-input-password").appendChild(divMessagePassword);
        }else{
            console.log("Check not passed and not null")
            document.getElementById("text-alert-password").textContent ="Password must have at least one lower case, one upper case and one digit";
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
  if(postData.post_category==1){
    return `
        <div id="post-${postData.post_id}" class="card text-center mw-xl-15 mw-md-20 mw-sm-25 m-auto my-2">
            <src class="card-image bg-grey w-100" src="${postData.post_thumbnail}" alt="Missing Image" type="video/mp4">
            <div class="card-body bg-grey w-100">
                <p class="card-title w-100">${postData.title}</p>
                <p clas="card-text w-100">${postData.post_description}</p>
                <p class="card-price w-100">$ ${postData.price}</p>
                <a href="/post/${postData.post_id}" class="anchor-buttons btn btn-primary w-100 m-auto">Post Details</a>
            </div>
        </div>`;

  }else{
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
  
}

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

document.addEventListener("DOMContentLoaded", function() {
  var lazyVideos = [].slice.call(document.querySelectorAll("video.lazy"));

  if ("IntersectionObserver" in window) {
    var lazyVideoObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(video) {
        if (video.isIntersecting) {
          for (var source in video.target.children) {
            var videoSource = video.target.children[source];
            if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
              videoSource.src = videoSource.dataset.src;
            }
          }

          video.target.load();
          video.target.classList.remove("lazy");
          lazyVideoObserver.unobserve(video.target);
        }
      });
    });

    lazyVideos.forEach(function(lazyVideo) {
      lazyVideoObserver.observe(lazyVideo);
    });
  }
});
