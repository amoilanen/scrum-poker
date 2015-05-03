var cards = ['?', '0', '1/2', '1', '2', '3', '5', '8', '13', '20', '40', '100', 'inf', 'coffee'];

document.addEventListener('DOMContentLoaded', function(event) {
  var cardsContainer = document.querySelector('#cardsContainer');

  cards.forEach(function(card) {

    var cardElementContainer = document.createElement('div');
    cardElementContainer.setAttribute('class', 'card-cell');

    var cardElement = document.createElement('span');
    cardElement.setAttribute('class', 'card');

    var cardLabel = document.createElement('span');
    cardLabel.setAttribute('class', 'card-label');

    var textElement = document.createTextNode(card);
    cardLabel.appendChild(textElement);

    cardElement.appendChild(cardLabel);
    cardElementContainer.appendChild(cardElement);
    cardsContainer.appendChild(cardElementContainer);
  });

  console.log('Document loaded. event = ', event);
}, false);