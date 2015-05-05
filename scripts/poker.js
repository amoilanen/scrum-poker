(function(host) {

  function Card(options) {
    this.label = options.label;
    this.icon = options.icon;
  }

  Card.prototype.render = function() {
    var rendition = document.createElement('div');
    var cardElement = document.createElement('span');
    var cardLabel = document.createElement('span');

    rendition.setAttribute('class', 'card-cell');
    cardLabel.setAttribute('class', 'card-label');
    cardElement.setAttribute('class', 'card');
    cardElement.appendChild(cardLabel);
    if (this.label) {
      var text = document.createTextNode(this.label);

      cardLabel.appendChild(text);
    } else if (this.icon) {
      var cardImage = document.createElement('img');

      cardImage.setAttribute('src', this.icon);
      cardLabel.appendChild(cardImage);
    }
    rendition.appendChild(cardElement);

    cardElement.addEventListener('click', function(event) {
      cardElement.classList.toggle('selected');
    });
    cardElement.addEventListener('touchend', function(event) {
      cardElement.classList.toggle('selected');
    });

    //TODO: Swipe left/right

    return rendition;
  };

  host.Card = Card;
})(this);

var cards = [
  new Card({label: '?'}),
  new Card({label: '0'}),
  new Card({label: '1/2'}),
  new Card({label: '1'}),
  new Card({label: '2'}),
  new Card({label: '3'}),
  new Card({label: '5'}),
  new Card({label: '8'}),
  new Card({label: '13'}),
  new Card({label: '20'}),
  new Card({label: '40'}),
  new Card({label: '100'}),
  new Card({icon: 'images/infinity.svg'}),
  new Card({icon: 'images/coffee_cup.svg'})
];

document.addEventListener('DOMContentLoaded', function(event) {
  var cardsContainer = document.querySelector('#cardsContainer');

  cards.forEach(function(card) {
    cardsContainer.appendChild(card.render());
  });
}, false);