/**
 * This file contains the Backbone models that are used to represent different
 * objects in the web app.
 */

/**
 * Representation of the customer and their associated data.
 * This object stores all data associated with the user including
 * maskedWalletResponse and fullWalletResponse.
 */
var bikeStore = bikeStore || {};

(function(models) {

  /**
  * Model representing user information.
  * @type {Backbone.Model}
  */
  models.User = Backbone.Model.extend({
  defaults: {
    loggedIn: false,
    email: null,
    shortEmail: null,
    maskedWallet: null,
    fullWallet: null
    }
  });

  /**
   * Model representing purchaseable items.
   * @type {Backbone.Model}
   */
  models.Item = Backbone.Model.extend({
    defaults: {
      id: '',
      name: 'Bike',
      unitPrice: 0,
      totalPrice: 0,
      quantity: 0,
      description: 'Description.',
      image: 'img/wallet.jpg'
    },
    initialize: function() {
    }
  });

  /**
  * Representation of the currently selected item.
  * This is binded with ItemInfoView
  * @type {Backbone.Model}
  */
  models.CurrentItem = Backbone.Model.extend({
    defaults: {
      defined: false,
      item: new models.Item()
    },
    initialize: function() {
      _.bindAll(this, 'setItem');
    },
    setItem: function(currItem) {
      if (currItem)
        {
        this.set({
          defined: true,
          item: currItem
        });
      bikeStore.Cookie.setCurrentItem(currItem);
      }
    }
  });

  /**
   * Collection of purchaseable items.
   * @type {Backbone.Collection}
   */
  models.Items = Backbone.Collection.extend({
    model: models.Item
  });

  /**
   * Collection of items in the shopping cart.
   * @type {Backbone.Collection}
   */
  models.Cart = Backbone.Collection.extend({
    model: models.Item
  });
})(window.bikeStore.Models = window.bikeStore.Models || {});
