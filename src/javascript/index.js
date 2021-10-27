import '../sass/styles.scss';

//https://openexchangerates.org/api/latest.json?app_id=

const EXC_URL = 'https://openexchangerates.org/api/latest.json?app_id=b7f9fbd991654516aa91dae9e0319953';

const catMen = `https://fakestoreapi.com/products/category/electronics`;
const catWomen = `https://fakestoreapi.com/products/category/women's clothing`;


/**
 * Get API CALLS
 */

function request(method, url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = resolve;
    xhr.onerror = reject;
    xhr.send();
  });
}

/**
 * Build DOM List on Carousels
 */

function carouselBuilder(data, element, currency) {

    let currSymbol = currency;
      switch (currSymbol) {
      case "USD":
        currSymbol = "$";
        break;
      case "EUR":
        currSymbol = "€";
        break;
      default:
        currSymbol = "$";
    }
  
    const HTMLResponse = document.querySelector(`${element}`);
    const tpl = data.map((product) => `
          <div class="item">
              <img class="img-fluid" src="${product.image}">
              <h3>${product.title}</h3>
              <div class="data">
                <div class="price"><span class="currency">${currSymbol}</span>${product.price}</div>
                <div>
                    <span class="rate">${product.rating['rate']}</span>
                    <span class="comments">(${product.rating['count']})</span>
                </div>
              </div>
          </div>
      `);
    HTMLResponse.innerHTML = `<div class="carousel-inner">${tpl.join("")}</div>
      <span class="carousel-button button-left"></span>
      <span class="carousel-button button-right"></span>`;
  
    buildCarousel(element)
}


/**
 * Change currency
 */

 function changeCurrency(currency){
  
  const currencies = JSON.parse(localStorage.getItem("currencies"));
  const exchange = currencies.rates[currency]
  
  var carousels = [
    {'element' : '#carousel-1', 'data' : JSON.parse(localStorage.getItem("catMen"))}, 
    {'element' : '#carousel-2', 'data' : JSON.parse(localStorage.getItem("catWomen"))}
  ]


  for (const element of carousels) {
    const newPrice = element.data.map( item => {
      return {...item, price: Math.round(item.price*exchange * 100) / 100}
    })
    
    carouselBuilder(newPrice, element.element, currency) 
    
  }
}

// API Call to Woman Cat 

request('GET', catMen)
.then(function (e) {
  const data = JSON.parse(e.target.response);
  carouselBuilder(data, '#carousel-1', 'USD')
  localStorage.setItem("catMen", e.target.response);
}, function (e) {
  console.log('error');
});

// API Call to Men Cat 

request('GET', catWomen)
.then(function (e) {
  const data = JSON.parse(e.target.response);
  carouselBuilder(data, '#carousel-2', 'USD')
  localStorage.setItem("catWomen", e.target.response);
}, function (e) {
  console.log('error');
});

// API Call to Currencies 

request('GET', EXC_URL)
.then(function (e) {
  localStorage.setItem("currencies", e.target.response);
}, function (e) {
  console.log('error');
});




////////////////////

const divs = document.querySelectorAll('.currency-change');

divs.forEach(el => el.addEventListener('click', event => {
  var currency = el.getAttribute("curr")
  changeCurrency(currency);
  document.getElementById("current-currency").innerHTML = currency;

}));


////////////////////////////////////////////////////////////////

function buildCarousel(element) {

  let carouselContainer = document.querySelector(element);

  let span = carouselContainer.getElementsByClassName('carousel-button');

  let product = carouselContainer.getElementsByClassName('item')
  let product_page = Math.ceil(product.length / 4);
  let sss = product.length

  let l = 0;
  let movePer = 26;
  let maxMove = movePer * (product.length - 4);


  // mobile_view	
  let mob_view = window.matchMedia("(max-width: 768px)");
  if (mob_view.matches) {
    movePer = 50.36;
    maxMove = movePer * (product.length - 2);;
  }

  let right_mover = () => {
    l = l + movePer;
    if (product == 1) { l = 0; }
    for (const i of product) {
      if (l > maxMove) { l = l - movePer; }
      i.style.left = '-' + l + '%';
    }

  }
  let left_mover = () => {
    l = l - movePer;
    if (l <= 0) { l = 0; }
    for (const i of product) {
      if (product_page > 1) {
        i.style.left = '-' + l + '%';
      }
    }
  }

  span[0].onclick = () => { left_mover(); }
  span[1].onclick = () => { right_mover(); }


}


