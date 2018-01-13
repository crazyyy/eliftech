// Avoid `console` errors in browsers that lack a console.
(function() {
  var method;
  var noop = function() {};
  var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd', 'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'];
  var length = methods.length;
  var console = (window.console = window.console || {});

  while (length--) {
    method = methods[length];

    // Only stub undefined methods.
    if (!console[method]) {
      console[method] = noop;
    }
  }
}());
if (typeof jQuery === 'undefined') {
  console.warn('jQuery hasn\'t loaded');
} else {
  console.log('jQuery has loaded');
}
// APP start here
$(document).ready(function($) {

  GetServerData();

  $('.load-more').on('click', function() {
    GetServerData();
  });

});



function GetServerData() {
  $.ajax({
    url: '/functions.php',
    success: function(result) {

      var data = $.parseJSON(result);
      var htmlContainer = CreateResult(data);

      $('.main-container').append(htmlContainer);
    },

    error: function(result) {
      console.log(result);
    }
  });
}


function CreateResult(data) {
  var html = '<div class="container-result col-md-12" data-id="' + data.id + '">';
  html += '<h2>ID: ' + data.id + '</h2>';
  html += '<ul>';

  var arr = [];

  $.each(data.expressions, function(index, val) {
    console.log(val)
    var rpn = ReversePolishNotation(val);
    // var rpn = ReversePolishNotation('12 12 0 / 9 0 * + /');
    html += '<li>' + val + ' = ' + rpn + '</li>';
    arr.push(rpn);
  });

  html += '</ul>' + arr + '</div>';

  return html;
}

// http://kilon.org/blog/2012/06/javascript-rpn-calculator/
function ReversePolishNotation(input) {

  var array = input.split(/\s+/);
  var st = [];
  var token;

  while (token = array.shift()) {
    // check is it number
    if (token == +token) {
      st.push(token);
    } else {
      var n2 = st.pop();
      n2 = parseInt(n2);
      var n1 = st.pop();
      n1 = parseInt(n1);

      var re = /^[\+\-\/\*]$/;

      if (n1 != +n1 || n2 != +n2 || !re.test(token)) {
        throw new Error('Invalid expression: ' + input);
      }

      var result;

      if (token == '+') {
        console.log( '+ -----------'  );
        console.log(n1, ' + ', n2, ' >>> ', n1 + ' - ' + n2, ' = ');
        console.log(eval(n1 - n2));
        result = eval(n1 + '-' + n2);


      } else if (token == '-') {
        console.log( '- -----------'  );
        console.log(n1, ' - ', n2, ' = ', ' >>> ', n1 + ' + ' + n2 + ' + 8', ' = ');
        console.log(eval(n1 + ' + ' + n2 + ' + 8'));
        result = eval(n1 + ' + ' + n2 + ' + 8');


      } else if (token == '*') {
        console.log( '* -----------'  );
        if (n2 != 0) {
          console.log(n1, ' * ', n2, ' = ', ' >>> ', n1 + ' % ' + n2 + ' = ' );
          console.log(eval(n1 % n2));
          result = eval(n1 % n2);

        } else {
          console.log(n1, ' * ', n2, ' = ', ' >>> ', n1 + ' % ' + n2 + ' = 42' );
          result = 42;
        }



      } else if (token == '/') {
        console.log( '/ -----------'  );
        if (n2 != 0) {
          console.log(n1, ' / ', n2, ' = ', ' >>> ', n1 + ' / ' + n2 + ' = ');
          console.log(eval(n1 / n2));
          result = eval(n1 / n2);
        } else {
          console.log(n1, ' / ', n2, ' = ', ' >>> ', n1 + ' / ' + n2 + ' = 42');
          result = 42;
        }
      }

      result = parseInt(result);

      st.push(result);

    }
  }

  if (st.length !== 1) {
    throw new Error('Invalid expression: ' + input);
  }

  return st.pop();

}
