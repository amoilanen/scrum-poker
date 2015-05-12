(function(host) {

  function Card(deck, cardElement) {
    this.deck = deck;
    this.cardElement = cardElement;
  }

  Card.prototype.init = function() {
    var self = this;

    this.cardElement.addEventListener('click', function(event) {
      self.toggle();
    });
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
    this.cards = [];
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
      //var shiftX = Math.min(touchCurrent.clientX - touchStart.clientX, 5);

      //self.activeCard.cardElement.style.left = shiftX + 'px';
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
    this._readCards();
  };

  Deck.prototype._readCards = function() {
    var self = this;
    var cardElements = [].slice.call(document.querySelectorAll('#cardsContainer span.card'));

    cardElements.forEach(function(cardElement) {
      var card = new Card(self, cardElement);

      card.init();
      self.cards.push(card);
    });
  };

  host.Deck = Deck;
})(this);

var deck = new Deck();

document.addEventListener('DOMContentLoaded', function(event) {
  deck.init();
}, false);