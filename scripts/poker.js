'use strict';
(function(host) {

  var MAX_SWIPE_DELTA_PX = 50;

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
    this.deck.activeCard = (this.cardElement.classList.contains('selected') ? this : null);
  };

  Card.prototype.moveHorizontally = function(deltaX) {
    if (deltaX > 0) {
      this.cardElement.style.paddingLeft = Math.min(deltaX, MAX_SWIPE_DELTA_PX) + 'px';
    } else {
      this.cardElement.style.paddingRight = Math.min(-deltaX, MAX_SWIPE_DELTA_PX) + 'px';
    }
  };

  Card.prototype.moveToDefaultPosition = function() {
    this.cardElement.style.paddingRight = null;
    this.cardElement.style.paddingLeft = null;
  };

  host.Card = Card;
})(this);

(function(host) {

  var MIN_SWIPE_DELTA_PX = 15;

  function Deck(cards) {
    var self = this;

    this.activeCard = null;
    this.cards = [];
  }

  Deck.prototype.init = function() {
    var self = this;
    var touchStart;

    document.addEventListener('touchstart', function(event) {
      if (!self.activeCard) {
        return;
      }
      touchStart = event.targetTouches[0];
    });
    document.addEventListener('touchmove', function(event) {
      if (!self.activeCard) {
        return;
      }
      var touchCurrent = event.touches[0];
      self.activeCard.moveHorizontally(touchCurrent.clientX - touchStart.clientX);
    });
    document.addEventListener('touchend', function(event) {
      if (!self.activeCard) {
        return;
      }
      var touchEnd = event.changedTouches[0];

      self._handleSwipe(touchEnd.clientX - touchStart.clientX);
    });
    this._readCards();
  };

  Deck.prototype._handleSwipe = function(swipeDeltaX) {
    var nextCard;

    if (Math.abs(swipeDeltaX) < MIN_SWIPE_DELTA_PX) {
      return;
    }
    if (swipeDeltaX > 0) {
      nextCard = this._getLeftNeighborCard(this.activeCard);
    } else {
      nextCard = this._getRightNeighborCard(this.activeCard);
    }
    this.activeCard.moveToDefaultPosition();
    this.activeCard.toggle();
    nextCard.toggle();
  };

  Deck.prototype._getLeftNeighborCard = function(card) {
    var currentIndex = this.cards.indexOf(card);
    var neighborIndex = currentIndex - 1;

    if (neighborIndex < 0) {
      neighborIndex = this.cards.length - 1;
    }
    return this.cards[neighborIndex];
  };

  Deck.prototype._getRightNeighborCard = function(card) {
    var currentIndex = this.cards.indexOf(card);
    var neighborIndex = currentIndex + 1;

    if (neighborIndex >= this.cards.length) {
      neighborIndex = 0;
    }
    return this.cards[neighborIndex];
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