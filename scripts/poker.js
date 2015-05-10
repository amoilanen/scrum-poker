(function(host) {

  function Card(options) {
    this.label = options.label;
    this.icon = options.icon;
    this.deck = null;
    this.cardElement = null;
  }

  Card.prototype.render = function() {
    var self = this;
    var rendition = document.createElement('div');
    this.cardElement = document.createElement('span');
    var cardLabel = document.createElement('span');

    rendition.setAttribute('class', 'card-cell');
    cardLabel.setAttribute('class', 'card-label');
    this.cardElement.setAttribute('class', 'card');
    this.cardElement.appendChild(cardLabel);
    if (this.label) {
      var text = document.createTextNode(this.label);

      cardLabel.appendChild(text);
    } else if (this.icon) {
      var cardImage = document.createElement('img');

      cardImage.setAttribute('src', this.icon);
      cardLabel.appendChild(cardImage);
    }
    rendition.appendChild(this.cardElement);
    this.cardElement.addEventListener('click', function(event) {
      self.toggle();
    });
    return rendition;
  };

  Card.prototype.toggle = function() {
    this.cardElement.classList.toggle('selected');
    if (this.cardElement.classList.contains('selected')) {
      this.deck.activeCard = this;
    }
  };

  host.Card = Card;
})(this);

(function(host) {

  function Deck(cards) {
    var self = this;

    this.activeCard = null;
    this.cards = cards;
    this.cards.forEach(function(card) {
      card.deck = self;
    });
  }

  Deck.prototype.init = function() {
    var self = this;
    var touchStart;

    document.addEventListener('touchstart', function(event) {
      //console.log('touch start', event.touches[0]);
      touchStart = event.targetTouches[0];
    });
    document.addEventListener('touchmove', function(event) {
      //console.log('touch move', event.touches[0]);
      var touchCurrent = event.touches[0];
      //self.activeCard.cardElement.style.left = (touchCurrent.clientX - touchStart.clientX) + 'px';
    });
    document.addEventListener('touchend', function(event) {
      var currentCardIndex = self.cards.indexOf(self.activeCard);
      var nextCardIndex;
      //console.log('touch end', event.touches[0]);
      var touchEnd = event.changedTouches[0];

      var swipeDeltaX = touchEnd.clientX - touchStart.clientX;

      if (swipeDeltaX > 15) {
        console.log('left');
        nextCardIndex = currentCardIndex - 1;
        if (nextCardIndex < 0) {
          nextCardIndex = self.cards.length - 1;
        }
        self.activeCard.toggle();
        self.cards[nextCardIndex].toggle();
      } else if (swipeDeltaX < -15) {
        console.log('right');
        nextCardIndex = currentCardIndex + 1;
        if (nextCardIndex >= self.cards.length) {
          nextCardIndex = 0;
        }
        self.activeCard.toggle();
        self.cards[nextCardIndex].toggle();
      }
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