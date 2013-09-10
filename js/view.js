/**
 * Backbone view templates and view-model binding.
 */
var bikeStore = bikeStore || {};

(function(views) {

  /**
   * Splash page item template.
   * @type {String}
   */
  var itemSelectionSubTemplate = [
    '<a class="item" href="#item<%=itemId%>" data-ajax="false">',
    '<div class="product" style = "background-image: url(<%=image%>);">',
    '</div>',
    '<footer>',
    '<var class="name"><%=name%></var>',
    '<var class="price">$<%=unitPrice%></var>',
    '</footer>',
    '</a>'
    ].join('');

  /**
   * Item details template.
   * @type {String}
   */
  var itemInfoTemplate = [
    '<li id="item<%=itemId%>">',
    '<div>',
    '<a href="#main" class="close" data-ajax="false"></a>',
    '<div class="product" style="background-image: url(<%=image%>);"></div>',
    '<footer>',
    '<div class="product-details">',
    '<var class="name"><%=name%></var>',
    '<var class="price">$<%=unitPrice%></var>',
    '</div>',
    '<a href = "#" id = "add_to_cart" class = "button add-to-cart"',
    'data-ajax="false">Add to Cart</a>',
    '</footer>',
    '</div>',
    '</li>'
    ].join('');

  /**
   * Total order details top template.
   * @type {String}
   */
  var orderInfoTemplate = [
    '<tr class="row-height">',
    '<td class = "product-table-bg" style = ',
    '"background-image:url(<%=image%>);"></td>',
    '<td class="text-left">',
    '<div class="product-name">',
    '<%= name %>',
    '<p class="desc" id="order-<%=id %>"><%=description %></p>',
    '<ul><li>',
    '<a class="remove-link" value ="<%=positionIndex %>" href = "">Remove</a>',
    '</li></ul>',
    '</div>',
    '</td>',
    '<td class="text-center"><%= quantity %></td>',
    '<td class="text-right">$<%= unitPrice %></td>',
    '</tr>'
    ].join('');

  /**
   * Total order details bottom template.
   * @type {String}
   */
  var orderInfoBottomTemplate = [
    '<tr>',
    '<td class="text-right" colspan="3"> Subtotal:</td>',
    '<td class="text-right">$<%= subtotal %></td>',
    '</tr>',
    '<tr>',
    '<td class="text-right" colspan="3"> Tax:</td>',
    '<td class="text-right" >$<%= tax %></td>',
    '</tr>',
    '<tr>',
    '<td class="text-right" colspan="3"> Shipping:</td>',
    '<td class="text-right">$<%= shipping %></td>',
    '</tr>',
    '<tr class="total">',
    '<td class="text-right" colspan="3">Total:</td>',
    '<td class="text-right">$<%= total %></td>',
    '</tr>'
    ].join('');

  /**
   * Purchase confirmation page top template.
   * @type {String}
   */
  var confirmationTemplate = [
    '<tr class="row-height">',
    '<td class = "product-table-bg" style = ',
    '"background-image:url(<%=image%>);"></td>',
    '<td class="text-left">',
    '<div class="product-name">',
    '<%= name %>',
    '<p class="desc" id="confirm-<%=id %>"><%=description %></p>',
    '</div>',
    '</td>',
    '<td class="text-center"><%=quantity %></td>',
    '<td class="text-right">$<%= unitPrice %></td>',
    '</tr>'
    ].join('');

  /**
   * Purchase confirmation page bottom template.
   * @type {String}
   */
  var confirmationBottomTemplate = [
    '<tr>',
    '<td class="text-right" colspan="3"> Subtotal:</td>',
    '<td class="text-right">$<%= confirmSubtotal %></td>',
    '</tr>',
    '<tr>',
    '<td class="text-right" colspan="3"> Tax:</td>',
    '<td class="text-right" >$<%= tax %></td>',
    '</tr>',
    '<tr>',
    '<td class="text-right" colspan="3"> Shipping:</td>',
    '<td class="text-right">$<%= shipping %></td>',
    '</tr>',
    '<tr class="total">',
    '<td class="text-right" colspan="3">Total:</td>',
    '<td class="text-right">$<%= confirmTotal %></td>',
    '</tr>'
    ].join('');

  /**
   * Receipt page top template.
   * @type {String}
   */
  var receiptTemplate = [
    '<tr class="row-height">',
    '<td class = "product-table-bg" style = ',
    '"background-image:url(<%=image%>);"></td>',
    '<td class="text-left">',
    '<div class="product-name">',
    '<%= name %>',
    '<p class="desc" id="receipt-<%=id %>"><%=description %></p>',
    '</div>',
    '</td>',
    '<td class="text-center"><%=quantity %></td>',
    '<td class="text-right">$<%= unitPrice %></td>',
    '</tr>'
    ].join('');

  /**
   * Receipt page bottom template.
   * @type {String}
   */
  var receiptBottomTemplate = [
    '<tr>',
    '<td class="text-right" colspan="3"> Subtotal:</td>',
    '<td class="text-right">$<%= receiptSubtotal %></td>',
    '</tr>',
    '<tr>',
    '<td class="text-right" colspan="3"> Tax:</td>',
    '<td class="text-right" >$<%= tax %></td>',
    '</tr>',
    '<tr>',
    '<td class="text-right" colspan="3"> Shipping:</td>',
    '<td class="text-right">$<%= shipping %></td>',
    '</tr>',
    '<tr class="total">',
    '<td class="text-right" colspan="3">Total:</td>',
    '<td class="text-right">$<%= receiptTotal %></td>',
    '</tr>',
    '<tr>',
    '<td colspan=4>',
    '<hr />',
    '<div id="item_name"><strong>Confirmation details</strong></div>',
    '<table>',
    '<tr>',
    '<td class="content-indent">Secured by ',
    '<span class="gwallet-icon">',
    '<img src="img/GreyLogo124_26.png" alt="Google Wallet" />',
    '</span>',
    '</td>',
    '</tr>',
    '<tr>',
    '<td class="content-indent">Your order confirmation number is ',
    '<strong><%= orderNumber %></strong>.<br/>',
    'Your purchase will be shipped within two business days, your tracking ',
    'number will be sent to you via email at ',
    '<strong><%= receiptEmail %></strong>.',
    '</td>',
    '</tr>',
    '</table>',
    '<br/>',
    '<div class="button" id="back_to_shopping" style="float:left">',
    '<b>Back to Shopping</b></div>',
    '<td>',
    '<tr>'
    ].join('');

  /**
   * Rendering item details view on home page.
   * @type {Backbone.View}
   */
  views.ItemInfoView = Backbone.View.extend({
    el: '#item-content',
    initialize: function() {
      _.bindAll(this, 'render');
      this.model.on('change', this.render);
      this.render();
    },
    events: {
      'click #add_to_cart' : function() {
        $("#item-selection").css('height', 'auto');
        $('#item-selection').css('overflow', 'visible');
        $("body").css('overflow', 'auto');
        bikeStore.App.addToCart();
      },
      'click .close' : function() {
        $("#item-selection").css('height', 'auto');
        $('#item-selection').css('overflow', 'visible');
        $("body").css('overflow', 'auto');
      }
    },
   render: function() {
     var item = this.model.get('item');
     var variables = {
         itemId: item.get('id'),
         image: item.get('image'),
         name: item.get('name'),
         quantity: item.get('quantity'),
         unitPrice: parseFloat(item.get('unitPrice')).toFixed(2)
       };
      var template = _.template(itemInfoTemplate, variables);
      this.$el.html(template).trigger('create');
    }
  });

  /**
   * Shopping cart view that displays the items in a cart.
   * @type {Backbone.View}
   */
  views.CartView = Backbone.View.extend({
    el: '#product-list',
    initialize: function() {
      // Bind this as this object instead of the calling object.
      _.bindAll(this, 'render');
      // We'll re-render this view on any change to the cart.
      this.collection.bind('add', this.render);
      this.collection.bind('reset', this.render);
      this.collection.bind('remove', this.render);
    },
    events: {
      'click #continue_shopping' : function() {
        $.mobile.changePage('#item-selection', {
          transition: transitionType
        });
      },
      'click #continue_checkout' : function() {
        bikeStore.Wallet.requestMaskedWallet();
      },
      'click .remove-link' : function(event) {
        if(confirm('Are you sure, you want to delete?')) {
          bikeStore.Cookie.updateCartItem($(event.target).attr('value'),
            this.collection);
        }
       },
      'click .more-text' : function(event) {
        $(event.target).hide();
        var pTag = $(event.target).parents('p.summary');
        $(pTag).find('a.less-text').show();
        $(pTag).find('span.secondHalf').show();
      },
      'click .less-text' : function(event) {
        $(event.target).hide();
        var pTag = $(event.target).parents('p.summary');
        $(pTag).find('a.more-text').show();
        $(pTag).find('span.secondHalf').hide();
      }
    },
    render: function() {
      var i = 0;
      var total = 0;
      var description = '';
      this.$el.html('');
      if (this.collection.length == 0) {
        $.mobile.changePage('#item-selection', {
          transition: transitionType
        });
        return;
      }
      // Fetch all items in the cart.
      for (i = 0; i < this.collection.length; i++) {
        var item = this.collection.at(i);
        var unitPrice = parseFloat(item.get('unitPrice'));
        if (windowWidth >= WIDTH_360) {
          description = item.get('description');
        }
        // Set rendering variable.
        var variables = {
          id: item.get('id'),
          image: item.get('image'),
          name: item.get('name'),
          quantity: item.get('quantity'),
          unitPrice: unitPrice.toFixed(2),
          description: description,
          positionIndex: i
        };
        total += unitPrice;
        // generate html from template.
        var template = _.template(orderInfoTemplate, variables);
        if (i < this.collection.length) {
          this.$el.append('<br/>');
        }
        this.$el.append(template);
        if(windowWidth < WIDTH_515) {
          bikeStore.App.setMoreLess('order',item.get('id'));
        }
      }
      var variables = {
        subtotal: total.toFixed(2),
        shipping: bikeStore.App.SHIPPING.toFixed(2),
        tax: bikeStore.App.TAX.toFixed(2),
        total: total + bikeStore.App.SHIPPING + bikeStore.App.TAX
      };
      var template = _.template(orderInfoBottomTemplate, variables);
      this.$el.append(template);
      if (description == '') {
        $('.desc').hide();
      }
    }
  });

  /**
   * Order confirmation view.
   * @type {Backbone.View}
   */
  views.ConfirmationView = Backbone.View.extend({
    el: '#review-product-list',
    initialize: function() {
      _.bindAll(this, 'render');
      this.collection.view = this;
      this.collection.on('add', this.render);
      this.model.on('change', this.render);
    },
    events: {
      'click .more-text' : function(event) {
        $(event.target).hide();
        var pTag = $(event.target).parents('p.summary');
        $(pTag).find('a.less-text').show();
        $(pTag).find('span.secondHalf').show();
      },
      'click .less-text' : function(event) {
        $(event.target).hide();
        var pTag = $(event.target).parents('p.summary');
        $(pTag).find('a.more-text').show();
        $(pTag).find('span.secondHalf').hide();
      }
    },
    render: function() {
      var i = 0;
      var total = 0;
      var item;
      var description = '';
      this.$el.html('');
      // Fetch all items in the cart.
      for (i = 0; i < this.collection.length; i++) {
        item = this.collection.at(i);
        var unitPrice = parseFloat(item.get('unitPrice'));
        if (windowWidth >= WIDTH_360) {
          description = item.get('description');
        }
        if (item && this.model.get('maskedWallet')) {
          variables = {
            id: item.get('id'),
            name: item.get('name'),
            image: item.get('image'),
            description: description,
            quantity: item.get('quantity'),
            unitPrice: unitPrice.toFixed(2)
          };
          total += unitPrice;
          var maskedWallet = this.model.get('maskedWallet');
          $('#conbilling').html(maskedWallet.email + '<br />' +
            maskedWallet.pay.description[0]);
          $('#conshipping').html(maskedWallet.ship.shippingAddress.name +
            '<br />' +
            maskedWallet.ship.shippingAddress.address1 + '<br />' +
            maskedWallet.ship.shippingAddress.city + ', ' +
            maskedWallet.ship.shippingAddress.state + '  ' +
            maskedWallet.ship.shippingAddress.postalCode);
          var template = _.template(confirmationTemplate, variables);
          if (i < this.collection.length) {
            this.$el.append('<br/>');
          }
          this.$el.append(template);
          if(windowWidth < WIDTH_515) {
            bikeStore.App.setMoreLess('confirm',item.get('id'));
          }
        }
      }
      variables = {
        confirmSubtotal: total.toFixed(2),
        shipping: bikeStore.App.SHIPPING.toFixed(2),
        tax: bikeStore.App.TAX.toFixed(2),
        confirmTotal: total + bikeStore.App.SHIPPING + bikeStore.App.TAX
      };
      var template = _.template(confirmationBottomTemplate, variables);
      this.$el.append(template);
      if (description == '') {
        $('.desc').hide();
      }
    }
  });

  /**
   *  View to display the receipt of the order.
   *  @type {Backbone.View}
   */
  views.ReceiptView = Backbone.View.extend({
    el: '#confirm-product-list',
    initialize: function() {
      _.bindAll(this, 'render');
      this.collection.view = this;
      this.collection.on('add', this.render);
      this.model.on('change', this.render);
    },
    events: {
      'click #back_to_shopping' : function() {
        $.cookie('cartItem', {expires: null});
        bikeStore.App.cart.reset('');
        $.mobile.changePage('#item-selection', {
          transition: transitionType
        });
      },
      'click .more-text' : function(event) {
        $(event.target).hide();
        var pTag = $(event.target).parents('p.summary');
        $(pTag).find('a.less-text').show();
        $(pTag).find('span.secondHalf').show();
      },
      'click .less-text' : function(event) {
        $(event.target).hide();
        var pTag = $(event.target).parents('p.summary');
        $(pTag).find('a.more-text').show();
        $(pTag).find('span.secondHalf').hide();
      }
    },
    render: function() {
      var i = 0;
      var total = 0;
      var unitPrice = 0;
      var description = '';
      var email = null;
      var orderNum = null;
      var variables = {
        id: '',
        name: '',
        image: '',
        description: '',
        subtotal: '',
        receiptEmail: '',
        receiptSubtotal: '',
        receiptTotal: '',
        shipping: '',
        tax: '',
        orderNumber: ''
      };
      this.$el.html('');
      if(this.model.get('fullWallet')) {
        email = this.model.get('fullWallet').response.response.email;
        orderNum =
          this.model.get('fullWallet').response.response.googleTransactionId;
      }
      // Fetch all items in the cart.
      for (i = 0; i < this.collection.length; i++) {
        item = this.collection.at(i);
        if (item) {
          unitPrice = parseFloat(item.get('unitPrice'));
          total += unitPrice;
          if (windowWidth >= WIDTH_360) {
            description = item.get('description');
          }
          variables = {
            id: item.get('id'),
            name: item.get('name'),
            image: item.get('image'),
            description: description,
            quantity: item.get('quantity'),
            unitPrice: unitPrice.toFixed(2)
          };
        }
        var template = _.template(receiptTemplate, variables);
        if (i < this.collection.length) {
          this.$el.append('<br/>');
        }
        this.$el.append(template);
        if(windowWidth < WIDTH_515) {
          bikeStore.App.setMoreLess('receipt',item.get('id'));
        }
      }
      variables = {
        receiptEmail: email,
        receiptSubtotal: total.toFixed(2),
        receiptTotal: total + bikeStore.App.SHIPPING + bikeStore.App.TAX,
        shipping: parseFloat(bikeStore.App.SHIPPING).toFixed(2),
        tax: parseFloat(bikeStore.App.TAX).toFixed(2),
        orderNumber: orderNum
      };
      var template = _.template(receiptBottomTemplate, variables);
      this.$el.append(template);
      if (description == '') {
        $('.desc').hide();
      }
    }
  });

  /**
   * View to display all items.
   * @type {Backbone.View}
   */
  views.SelectionView = Backbone.View.extend({
    el: '#category-list',
    initialize: function() {
      _.bindAll(this, 'addItem');
      this.collection.view = this;
      this.collection.bind('add', this.addItem);
      this.render();
    },
    addItem: function(item) {
      this.inner = new views.SelectionSubView({
          model: item
        });
      this.$el.append(this.inner.$el);
      this.$el.append('\n');
      this.inner.render();
      this.$el.trigger('create');
    },
    render: function() {
      _.each(this.collection.models, this.addItem);
    }
  });

  /**
   * Subview used to generate content of the itemlist.
   * @type {Backbone.View}
   */
  views.SelectionSubView = Backbone.View.extend({
    tagName: 'li',
    events: {
      'click': 'onClick'
    },
    render: function() {
      var variables = {
        itemId: this.model.get('id'),
        name: this.model.get('name'),
        image: this.model.get('image'),
        quantity: 1,
        unitPrice: parseFloat(this.model.get('unitPrice')).toFixed(2)
      };
      var template = _.template(itemSelectionSubTemplate, variables);
      this.$el.html(template, variables).trigger('create');
    },
    onClick: function() {
      $('#item-selection').css('height', windowHeight);
      $('#item-selection').css('overflow', 'hidden');
      $('body').css('overflow', 'hidden');
      bikeStore.App.select(this.model.get('id'));
    }
  });
})(window.bikeStore.Views = window.bikeStore.Views || {});
