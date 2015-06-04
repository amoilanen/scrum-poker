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

    this.container = null;
    this.activeCard = null;
    this.cards = [];
  }

  Deck.prototype.init = function() {
    var self = this;
    var touchStart;

    this.container = document.querySelector('#cardsContainer');
    document.addEventListener('theme.selected', function(event) {
      var theme = event.detail;

      self.container.setAttribute('class', theme);
    });
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

(function(host) {

  function SettingsBar(aboutDialog, settingsDialog) {
    this.aboutDialog = aboutDialog;
    this.settingsDialog = settingsDialog;
    this.minimizedSettingsBar = null;
    this.settingsBar = null;
    this.maximizeMenuButton = null;
    this.aboutMenuButton = null;
    this.settingsDialogButton = null;
  }

  SettingsBar.prototype.init = function() {
    var self = this;
    this.minimizedSettingsBar = document.querySelector('#minimizedSettingsBar');
    this.settingsBar = document.querySelector('#settingsBar');
    this.maximizeMenuButton = document.querySelector('#maximizeMenuButton');
    this.aboutMenuButton = document.querySelector('#aboutMenuItem');
    this.settingsDialogButton = document.querySelector('#settingsMenuItem');

    this.aboutMenuButton.addEventListener('click', function(event) {
      self.aboutDialog.open();
    }, false);
    this.settingsDialogButton.addEventListener('click', function(event) {
      self.settingsDialog.open();
    }, false);
    this.maximizeMenuButton.addEventListener('click', function(event) {
      self.maximize();
      setTimeout(function() {
        self.minimize();
      }, 2000);
    }, true);
  };

  SettingsBar.prototype.maximize = function() {
    this.minimizedSettingsBar.classList.remove('shown');
    this.settingsBar.classList.add('shown');
  };

  SettingsBar.prototype.minimize = function() {
    this.minimizedSettingsBar.classList.add('shown');
    this.settingsBar.classList.remove('shown');
  };

  host.SettingsBar = SettingsBar;
})(this);

(function(host) {

  function AboutDialog() {
    this.dialog = null;
    this.acceptButton = null;
  }

  AboutDialog.prototype.init = function() {
    var self = this;
    this.dialog = document.querySelector('#aboutDialog');
    this.acceptButton = this.dialog.querySelector('.button');

    this.acceptButton.addEventListener('click', function() {
      self.close();
    });
  };

  AboutDialog.prototype.open = function() {
    this.dialog.classList.add('shown');
  };

  AboutDialog.prototype.close = function() {
    this.dialog.classList.remove('shown');
  };

  host.AboutDialog = AboutDialog;
})(this);

(function(host) {

  function SettingsDialog() {
    this.dialog = null;
    this.acceptButton = null;
    this.cancelButton = null;
    this.previousSelectedTheme = 'blue';
    this.selectedTheme = 'blue';
  }

  SettingsDialog.prototype.init = function() {
    var self = this;
    this.dialog = document.querySelector('#settingsDialog');
    this.acceptButton = this.dialog.querySelector('.ok-button');
    this.cancelButton = this.dialog.querySelector('.cancel-button');

    this.acceptButton.addEventListener('click', function() {
      self.confirm();
    });
    this.cancelButton.addEventListener('click', function() {
      self.cancel();
    });

    this.dialog.querySelector('ul').addEventListener('click', function(event) {
      var themeElement = self._findParentThemeElement(event.target);

      if (themeElement) {
        self.selectedTheme = themeElement.getAttribute('theme');
        self._renderSelection();
      }
    });
  };

  SettingsDialog.prototype._findParentThemeElement = function(domElement) {
    var current = domElement;

    while (!current.getAttribute('theme') && current.parentNode) {
      current = current.parentNode;
    }
    return current;
  };

  SettingsDialog.prototype._renderSelection = function() {
    var oldSelectedThemes = this.dialog.querySelectorAll('li.selected');
    var currentSelectedTheme = this.dialog.querySelector('li[theme=' + this.selectedTheme + ']');

    [].slice.call(oldSelectedThemes).forEach(function(selectedTheme) {
      selectedTheme.classList.remove('selected');
    });
    if (currentSelectedTheme) {
      currentSelectedTheme.classList.add('selected');
    }
  };

  SettingsDialog.prototype.open = function() {
    this._renderSelection();
    this.dialog.classList.add('shown');
  };

  SettingsDialog.prototype.confirm = function() {
    var event = new CustomEvent('theme.selected', {
      'detail': this.selectedTheme
    });

    this.previousSelectedTheme = this.selectedTheme;
    document.dispatchEvent(event);
    this.close();
  };

  SettingsDialog.prototype.cancel = function() {
    this.selectedTheme = this.previousSelectedTheme;
    this.close();
  };

  SettingsDialog.prototype.close = function() {
    this.dialog.classList.remove('shown');
  };

  host.SettingsDialog = SettingsDialog;
})(this);

var deck = new Deck();
var aboutDialog = new AboutDialog();
var settingsDialog = new SettingsDialog();
var settingsBar = new SettingsBar(aboutDialog, settingsDialog);

document.addEventListener('DOMContentLoaded', function(event) {
  deck.init();
  settingsBar.init();
  aboutDialog.init();
  settingsDialog.init();
}, false);


//TODO: Theme is stored in the local storage so that even after app restart it stays unchanged

//TODO: Bug. Landscape orientation, maximizing/minimizing menu, the maximize button is briefly shown at the left corner

//TODO: Test plan
 //- Navigatine left/right
 //- Opening/closing cards by clicking on them
 //- Menu bar should automatically hide if inactive
 //- About menu
 //- Settings menu
 // -- Selecting a color, OK
 // -- Selecting a color, Cancel
 //- Landscape/portrait mode for the device