var uiController = (function() {

  var DOMstrings = {
      inputType: '.add__type',
      inputDescription: '.add__description',
      inputValue: '.add__value',
      inputBtn: '.add__btn',
      incomeContainer: '.income__list',
      expensesContainer: '.expenses__list',
      budgetLabel: '.budget__value',
      incomeLabel: '.budget__income--value',
      expensesLabel: '.budget__expenses--value',
      percentageLabel: '.budget__expenses--percentage',
      container: '.container',
      expensesPercLabel: '.item__percentage',
      dateLabel: '.budget__title--month'
  };
  var formatNumber = function(num, type) {
      var numSplit, int, dec, type;
      /*
          + or - before number
          exactly 2 decimal points
          comma separating the thousands

          2310.4567 -> + 2,310.46
          2000 -> + 2,000.00
          */
      num = Math.abs(num);
      num = num.toFixed(2);
      numSplit = num.split('.');
      int = numSplit[0];
      if (int.length > 3) {
          int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
      }
      dec = numSplit[1];
      return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

  };
  return {
    getInput: function() {
      return {
          type: document.querySelector(".add__type").value, // Will be either inc or exp
          description: document.querySelector(".add__description").value,
          value: parseFloat(document.querySelector(".add__value").value)
      };
    },
    addItemToUi: function(type, obj) {
      var html, newHtml, element;
      // Create HTML string with placeholder text
      if (type === 'inc') {
          element = DOMstrings.incomeContainer;
          html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
          element = DOMstrings.expensesContainer;

          html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace the placeholder text with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    }
  }
})();
var budgetController = (function() {
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  }
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
  return {
    addItem: function(input_type, input_description, input_value) {
      var newItem, ID;
      if (data.allItems[input_type].length > 0) {
          ID = data.allItems[input_type][data.allItems[input_type].length - 1].id + 1;
      } else {
          ID = 0;
      }
      if (input_type === "inc") {
        newItem = new Income(ID, input_description, input_value);
      } else {
        newItem = new Expense(ID, input_description, input_value);
      }
      data.allItems[input_type].push(newItem);
      return newItem;
    }
  }

})();

// CONTROLLER
var controller = (function(uiCtrl, budgetCtrl) {
  setUpEventListeners = function() {
    document.querySelector(".add__btn").addEventListener("click", ctrlAddItem);
    document.addEventListener('keypress', function(event) {
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }
    });
  }

  var ctrlAddItem = function() {
    var input, newItem;
    input = uiCtrl.getInput();
    if (input.description !== "" && !isNaN(input.value) && input.value > 0)  {
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      uiCtrl.addItemToUi(input.type, newItem);
    }

  }

  return {
    init: function() {
        console.log("Application has started.");
        setUpEventListeners();
    }
  };
})(uiController, budgetController);


controller.init();
