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

    var touchStart;
    var touchEnd;

    cardElement.addEventListener('click', function(event) {
      cardElement.classList.toggle('selected');
    });
    return rendition;
  };

  host.Card = Card;
})(this);

(function(host) {

  function Deck(cards) {
    this.cards = cards;
  }

  Deck.prototype.init = function() {
    document.addEventListener('touchstart', function(event) {
      console.log('touch start', event.touches[0]);
      touchStart = event.targetTouches[0];
    });
    document.addEventListener('touchend', function(event) {
      console.log('touch end', event.touches[0]);
      touchEnd = event.changedTouches[0];

      var swipeDeltaX = touchEnd.clientX - touchStart.clientX;

      if (swipeDeltaX > 5) {
        console.log('left');
      } else if (swipeDeltaX < -5) {
        console.log('right');
      }
      //TODO: Do the actual swiping
    });
  };

  Deck.prototype.render = function() {
    var cardsContainer = document.querySelector('#cardsContainer');

    this.cards.forEach(function(card) {
      cardsContainer.appendChild(card.render());
    });
  };

  host.Deck = Deck;
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
var deck = new Deck(cards);

deck.init();
document.addEventListener('DOMContentLoaded', function(event) {
  deck.render();
}, false);