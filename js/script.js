var api_key='7b1e8f20';
var api_url=`https://www.omdbapi.com/?apikey=${api_key}`;

let pagination = {
    page:1,
    totalResults:0,
    pages:0
};

let favourites = JSON.parse(localStorage.getItem('favourites'));
if(!favourites){
    favourites = [];
}
var search = (query,page)=>{
    if(!query && page){
        pagination.page = parseInt(page);
        query = document.querySelector('#search-input').value;
    }
    console.log(`${api_url}&s=${query}`);
    fetch(`${api_url}&s=${query}&page=${pagination.page}`).then(response=>response.json()).then(response=>{
        console.log(response);
        if(response.Error){
            alert(response.Error);
            return;
        }
        var movies = response.Search;
        pagination.totalResults = parseInt(response.totalResults);
        pagination.pages = Math.ceil(pagination.totalResults/10);
        document.querySelector('#results').innerHTML = `Το σύνολο των ταινιών που βρέθηκαν είναι: ${pagination.totalResults}`;
        console.log(pagination);
        createPagination(pagination.pages,pagination.page);
        createMovies(movies);
    })
}

var createMovies = (movies)=>{
    document.querySelector('#movies').innerHTML = '';
    movies.forEach(m => {
        var movie = `<div class='col'><div class="card" style="width: 18rem;">
        <img src="${m.Poster}" class="card-img-top" alt="...">
        <div class="card-body">
        <h5 class="card-title">${m.Title}</h5>
        <ul class="list-group list-group-flush">
        <li class="list-group-item">${m.Type}</li>
        <li class="list-group-item">${m.Year}</li>
        </ul>
        <a href="javascript:;" onclick="extraData('${m.imdbID}')" class="btn btn-primary">Show More</a>
        <a href="javascript:;" onclick="toggleFavourite('${m.imdbID}')" class="btn btn-primary ${favourites.includes(m.imdbID)?'btn-danger':''}">Favourites</a>
        </div>
      </div></div>`;
        document.querySelector('#movies').innerHTML += movie;
    });
}

let toggleFavourite = (id)=>{
    var favourites = localStorage.getItem('favourites');
    if(!favourites){
        localStorage.setItem('favourites',JSON.stringify([id]));
    } else{
        let storageFavourites = JSON.parse('favourites');
        console.log(storageFavourites);
        if(storageFavourites.includes(id)){
            storageFavourites = storageFavourites.filter(f=>f!=id);
        }else {
            storageFavourites.push(id);
        }
        localStorage.setItem('favourites',JSON.stringify(storageFavourites));
            return;
    }
    console.log(localStorage.getItem('favourites'));
}

var extraData = (id)=>{
    console.log(id);
    document.querySelector('#staticBackdrop .modal-body ul').innerHTML = '';
    fetch(`${api_url}&i=${id}&plot=full`).then(data=>data.json()).then(data=>{
        console.log(data);
        for(key in data){
            console.log(typeof data[key]);
            if (typeof data[key] == 'string' && key != 'Poster'){
                document.querySelector('#staticBackdrop .modal-body ul').innerHTML += `<li class="list-group-item"><strong>${key}: </strong> ${data[key]}</li>`;
            } else if(key == 'Poster') {
                document.querySelector('#staticBackdrop .modal-body ul').innerHTML += `<li class="list-group-item"><img src="${data[key]}"/></li>`;
            }
            
        }
        extraModal.show();
    })
}

document.querySelector('#search-input').addEventListener('keyup',function(e){
    //console.log(e);
    //console.log(e.target.value);
    //console.log(this.value);
    if(e.key == 'Enter'){
        if(this.value.length < 1){
            alert('θέλουμε και άλλους χαρακτήρες');
            return;
        }
        pagination.page =1;
        search(this.value);
    }
})
document.querySelector('#search-button').addEventListener('click',function(e){
    var query = document.querySelector('#search-input').value;
    if(query.length < 1){
        alert('θέλουμε και άλλους χαρακτήρες');
        return;
    }
    pagination.page =1;
    search(query);
})

var extraModal = new bootstrap.Modal(document.querySelector('#staticBackdrop'));

let createPagination = (pages,page)=>{
    let html = `<nav aria-label="Page navigation example"><ul class="pagination">`;
    if(page > 1){
        html+=`<li class="page-item"><a class="page-link" href="javascript:;">Previous</a></li>`;
    }
    for (let i=1;i<=pages;i++){
        if(i>=page -4 && i<=page+4){
            html+= `<li class="page-item ${page==i?'active':''}"><a class="page-link" href="javascript:;">${i}</a></li>`;
        }
       
    }
    if(page < pages){
        html+=`<li class="page-item"><a class="page-link" href="javascript:;">Next</a></li>`;
    }
  html+=`</ul></nav>`;
  document.querySelector('#pagination').innerHTML =html;
  createPaginationEvents();
}

let createPaginationEvents = ()=>{
    document.querySelectorAll('ul.pagination a').forEach(a=>{
        a.addEventListener('click',function(e){
            if(this.innerHTML == 'Previous'){
                search(false,pagination.page-1);
                return;
            } else if (this.innerHTML == 'Next'){
                search(false,pagination.page+1);
                return;
            }
            search(false,this.innerHTML);
        });
    });
}
