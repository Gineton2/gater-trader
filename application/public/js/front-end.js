 /* 
    Filename: front-end.js

    Purpose: Handles User Search, Login, and Registration Errors

    Author: Duccio Rocca, Yoshimasa Iwano, Rai'd M. Team: 07

    Course: CSC648 SFSU

 */
// const { checkout } = require("../../routes/posts");

 

let searchButton = document.getElementById("search-button");
let searchText = document.getElementById("search-text");
let dropdowns = document.querySelectorAll(".search-panel");
let password = document.getElementById("password");
let matchPassword = document.getElementById("password");
const warningText = document.getElementById("warning");
let email = document.getElementById("email");
let login = document.getElementById("login");
let sendButton = document.getElementById("send-button");
let regSendButton = document.getElementById('regSendButton');
let logSendButton = document.getElementById('logSendButton');
let regSendButtonMake = document.getElementById('regSendButtonMake');
let logSendButtonMake = document.getElementById('logSendButtonMake');
let postButton = document.getElementById("post-button");
let formPost = document.getElementById('post-form');

if(logSendButtonMake){
  logSendButtonMake.addEventListener('click', (event)=>{
    
    event.preventDefault();

    let emailSendPost = document.getElementById('emailSend');
    let passwordSendPost = document.getElementById('passSend');

    let passwordLog = document.getElementById('passwordLog');
    let emailLog = document.getElementById('loginEmail');
    
    passwordSendPost.value = passwordLog.value;
    emailSendPost.value = emailLog.value;
    
    formPost.submit();
  })
}

if(regSendButtonMake){
  regSendButtonMake.addEventListener('click', (event)=>{
    event.preventDefault();

    let emailSendPost = document.getElementById('emailSend');
    let passwordSendPost = document.getElementById('passSend');
    let matchPassSend = document.getElementById('matchPassSend');
    let usernameSend = document.getElementById('usernameSend');
    
    

    let passwordReg = document.getElementById('passwordReg');
    let emailReg = document.getElementById('emailReg');
    let usernameReg = document.getElementById('usernameReg');
    let matchPasswordReg = document.getElementById('matchPasswordReg');
    
    passwordSendPost.value = passwordReg.value;
    emailSendPost.value = emailReg.value;
    usernameSend.value = usernameReg.value;
    matchPassSend.value = matchPasswordReg.value;
    
    formPost.submit();
  })
}



if(logSendButton){
  logSendButton.addEventListener('click', (event)=>{
    event.preventDefault();
    let messageLog = document.getElementById('messageLog');
    let message = document.getElementById('message');
    messageLog.value = message.value;
    console.log("messageLog.value : "+ messageLog.value );
    let formLog = document.getElementById('loginSend');
    formLog.submit();
  })
}

if(regSendButton){
  regSendButton.addEventListener('click', (event)=>{
    event.preventDefault();
    let messageReg = document.getElementById('messageReg');
    let message = document.getElementById('message');
    messageReg.value = message.value;
    let formReg = document.getElementById('registerSend');
    formReg.submit();
  })
}

if(sendButton){
  
  sendButton.addEventListener('click', (event)=>{
    event.preventDefault();
    fetch("./logged", {
      method: "POST",
    }).then((data) => {
      return data.json();
  })
  .then((data_json) => {

      console.log(data_json.logged)
      if(data_json.logged===false){
          var myModal = new bootstrap.Modal(document.getElementById('ModalToggle'));
          myModal.toggle();
      }else{
        let form = document.getElementById('contact-form');
        let user_id = data_json.author_id;
        let author_id = document.getElementById('author_id');
        author_id.value = user_id;
        console.log("SESSION ID: "+user_id);
        form.submit();

      }
      
  })
  .catch((err) => console.log(err));
  
  })
}



if (email) {
  email.addEventListener("focusout", (event) => {
    let emailChecker =
      /^([a-z0-9]+@[mail]+\.sfsu\.edu|([a-z0-9]+@[sfsu]+\.edu))/;
      // console.log(emailChecker.test(email.value));
      if (!emailChecker.test(email.value)) {
        
      
        if (document.getElementById("text-alert-email") == null) {
          let divMessageEmail = document.createElement("div");
          let divMessageEmailText = document.createTextNode("Email is not valid. Only @sfsu.edu");
          divMessageEmail.appendChild(divMessageEmailText);
          divMessageEmail.setAttribute("id", "text-alert-email");
          divMessageEmail.className = "text-danger text-center";
          document.getElementById("div-input-email").appendChild(divMessageEmail);
        } else {
          document.getElementById("text-alert-email").textContent =
            "Email is not valid";
        }
      } else {
        if (document.getElementById("text-alert-email") != null) {
          document.getElementById("text-alert-email").textContent = "";
        }
      }
  });
  

  // if (!emailChecker.test(email.value)) {
  //   preventDefault();
  //   displayWarning();


  //   if (document.getElementById("text-alert-email") == null) {
  //     let divMessageEmail = document.createElement("div");
  //     let divMessageEmailText = document.createTextNode("Email is not valid");
  //     divMessageEmail.appendChild(divMessageEmailText);
  //     divMessageEmail.setAttribute("id", "text-alert-email");
  //     divMessageEmail.className = "text-danger text-center";
  //     document.getElementById("div-input-email").appendChild(divMessageEmail);
  //   } else {
  //     document.getElementById("text-alert-email").textContent =
  //       "Email is not valid";
  //   }
  // } else {
  //   if (document.getElementById("text-alert-email") != null) {
  //     document.getElementById("text-alert-email").textContent = "";
  //   }
  // }
}

let logout = document.getElementById("logout");
if (logout) {
  logout.onclick = (event) => {
    fetch("users/logout", {
      method: "POST",
    }).then((data) => {
      // data.locals.logged = false;
      console.log("logout");
      location.replace("/");
    });
  };
}

searchText.addEventListener("input", checkSearchtext);
searchButton.addEventListener("click", checkSearchtext);



if (postButton) {
  postButton.addEventListener("click", (event)=>{
    
    if(!checkPost(event)){
      console.log("something went wrong");
      return;
    }
    event.preventDefault();
    fetch("posts/logged", {
      method: "POST",
    }).then((data) => {
      return data.json();
  })
  .then((data_json) => {

      console.log(data_json.logged)
      if(data_json.logged===false){
          var myModal = new bootstrap.Modal(document.getElementById('ModalToggle'));
          myModal.toggle();
      }else{
        
        let user_id = data_json.author_id;
        // let author_id = document.getElementById('author_id');
        // author_id.value = user_id;
        console.log("SESSION ID: "+user_id);
        formPost.submit();

      }
      
  })
  .catch((err) => console.log(err));
  
  })
}

function checkPost(event) {
  let file = document.getElementById("formFileLg");
  let checkbox = document.getElementById("checkBoxTos");
  
  if (file.value == null || !checkbox.checked)  {
    console.log("something missing");
    event.preventDefault();
    return false;
  }else{
    console.log("nothing missing");
    event.preventDefault();
    return true;
  }
}

function checkSearchtext(event) {
  let validText = /(\W)|(\w{40,})/;
  if (validText.test(searchText.value)) {
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
  }, 3000);
}

if (password) {
  password.addEventListener("focusout", function () {
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
  if (postData.post_category == 1) {
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
  } else {
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