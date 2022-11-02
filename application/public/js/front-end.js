let searchButton = document.getElementById('search-button');

let input = document.getElementById("search-text");

let dropdowns = document.querySelectorAll('.search-panel');

dropdowns.forEach(dropdown=>{
    let select = dropdown.querySelector('.select');
    let caret = dropdown.querySelector('.caret');
    let menu = dropdown.querySelector('.dropdown-menu');
    let options = dropdown.querySelectorAll('.dropdown-menu li');
    let selected = dropdown.querySelector('.selected');

    console.log('here is the list of elements select:'+select+' , caret: ' +caret+ ',  menu: '+menu+' , options: '+options+', selected: '+selected);

    select.addEventListener('click',()=>{
        caret.classList.toggle('open-caret');
    });
    options.forEach(option => {


        option.addEventListener('click', ()=>{

            selected.innerText = option.innerText;

            options.forEach(option => {
                option.classList.remove('active-item');
                        });
            option.classList.add('active-item');
            

        })
    })

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
        }, 50)
    }, 3000)
}

function addFlashFromFrontEnd(message) {
    let flashMessageDiv = document.createElement('div');
    let innerFlashDiv = document.createElement('div');
    let innerTextNode = document.createTextNode(message);
    innerFlashDiv.appendChild(innerTextNode);
    flashMessageDiv.appendChild(innerFlashDiv);
    flashMessageDiv.setAttribute('id','flashMessage');
    innerFlashDiv.setAttribute('class', 'alert alert-success');
    document.getElementsByTagName('body')[0].appendChild(flashMessageDiv);
    console.log(document.getElementsByTagName('body')[0]);
    // setflashMessageFadeOut(flashMessageDiv);
}

function createResultMessage(messageData) {
    let innerTextNode = document.createTextNode(messageData);
    let photoCount = document.getElementById('photo-count');
    photoCount.innerText='';
    photoCount.appendChild(innerTextNode);
    return;

}

function createCard(postData) {
    return `
    <div id="post-${postData.post_id}" class="card">
    <img class="card-image" src="${postData.post_thumbnail}" alt="Missing Image">
    <div class="card-body">
        <p class="card-title">${postData.title}</p>
        <p clas="card-text">${postData.post_description}</p>
        <a href="/post/${postData.post_id}" class="anchor-buttons">Post Details</a>
    </div>
</div>`;
}




function executeSearch() {
    console.log('searching...');
    let searchTerm = document.getElementById('search-text').value;
    let categorySearch = document.getElementById("search_concept selected").innerText;
    
    categorySearch.toString();
    console.log('cat:'+categorySearch);
    // if (!searchTerm) {
    //     searchTerm = '';
    //     // location.replace('/');
    //     // return;
    // }
    let mainContent = document.getElementById('main-content');
    searchTerm+= '-'+categorySearch;
    let searchURL = `/posts/search?search=${searchTerm}`;
    fetch(searchURL)
        .then((data) => {
            
            console.log(data);
            return data.json();

        }).then((data_json) => {
            if (data_json.message) {
                // addFlashFromFrontEnd(data_json.message);
                createResultMessage(data_json.message);
            }
            let newMainContentHTML = '';
            data_json.results.forEach((row) => {
                newMainContentHTML += createCard(row);
            });
            mainContent.innerHTML = newMainContentHTML;
            
        })
        .catch((err) => console.log(err));
}


if (searchButton) {
    searchButton.onclick = executeSearch;
}

if(input)
{
    input.addEventListener('keydown', function(event) {
    if(event.key === 'Enter'){
        console.log("Enter pressed");
        executeSearch();
        
    }
})
}