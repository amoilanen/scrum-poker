var cards = ['?', '0', '1/2', '1', '2', '3', '5', '8', '13', '20', '40', '100', 'inf', 'coffee'];

document.addEventListener('DOMContentLoaded', function(event) {
  var cardsContainer = document.querySelector('#cardsContainer');

  cards.forEach(function(card) {

    var cardElement = document.createElement('div');
    cardElement.setAttribute('class', 'card');

    var cardLabel = document.createElement('span');
    cardLabel.setAttribute('class', 'card-label');

    var textElement = document.createTextNode(card);
    cardLabel.appendChild(textElement);

    cardElement.appendChild(cardLabel);
    cardsContainer.appendChild(cardElement);
  });

  console.log('Document loaded. event = ', event);
}, false);