const container = document.getElementById('container');
const loadmore = document.getElementById('loadmore');
const url = 'https://www.eliftech.com/school-task';
const urlSecond = 'https://u0byf5fk31.execute-api.eu-west-1.amazonaws.com/etschool/task';

// load first block with expression and result
ready(GetServerData);

// add event to Load More button
loadmore.addEventListener('click', GetServerData);

/////
// MAIN FUNCTIONALITY //
/////

// get expressions from server
function GetServerData() {

  fetch(url)
    .then((resp) => resp.json())
    .then(function(data) {
      let htmlContainer = CreateResult(data);
      container.innerHTML = htmlContainer;
    })
    .catch(function(error) {
      console.log(error);
    });

}

// create new node with expressions
function CreateResult(data) {
  let arr = [];
  let html = `
    <div class="container-result col-md-12">
      <h2>ID: ${data.id}</h2>
        <ul>`;

  data.expressions.map(function(expression) {
    let rpn = ReversePolishNotation(expression);
    html += `<li>${expression} = ${rpn}</li>`;
    arr.push(rpn);
  })

  let response = CheckResult(data.id, arr);

  html += `</ul>
    <p>Results: [${arr}]</p>
    <p>Server Check: <span dataid="${data.id}" id="${data.id}"></span></p>
  </div>`;
  return html;
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// https://www.thepolyglotdeveloper.com/2015/04/evaluate-a-reverse-polish-notation-equation-with-javascript/ //
// calculate expression                                                                                      //
// + mean "a - b"
// - mean "a + b + 8"
// * mean "a % b" (if b == 0 >> result = 42)
// / mean "a / b" (if b == 0 >> result = 42)
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
function ReversePolishNotation(input) {

  let resultStack = [];
  expression = input.split(" ");

  for (let i = 0; i < expression.length; i++) {
    if (expression[i].isNumeric()) {
      resultStack.push(expression[i]);
    } else {
      let b = resultStack.pop();
      let a = resultStack.pop();
      let x;

      if (expression[i] === "+") {
        x = parseInt(a) - parseInt(b);
      } else if (expression[i] === "-") {
        x = parseInt(a) + parseInt(b) + parseInt(8);
      } else if (expression[i] === "*") {
        if (parseInt(b) != 0) {
          x = parseInt(a) % parseInt(b);
        } else {
          x = 42;
        }
      } else if (expression[i] === "/") {
        if (parseInt(b) != 0) {
          x = parseInt(a) / parseInt(b);
        } else {
          x = 42;
        }
      }
      resultStack.push(parseInt(x));

    }
  }
  if (resultStack.length > 1) {
    return "error";
  } else {
    return resultStack.pop();
  }
}

// Ckeck server response
function CheckResult(id, results) {

  let payload = {
    "id": id,
    "results": results
  }
  let passed;

  fetch(url, {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(function(data) {
      passed = data.passed;

      let CheckSelector = document.querySelector('[dataid="' + data.id + '"]');

      CheckSelector.innerHTML = passed;

      if (passed == true) {
        CheckSelector.style.color = "green";
      } else {
        CheckSelector.style.color = "red";
      }

    });



}

//////
// ADDITIONAL FUNCTIONALITY //
//////

// document ready without jquery function
function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}
// create node short name
function createNode(element) {
  return document.createElement(element);
}
// append node short name
function append(parent, element) {
  return parent.appendChild(element);
}
// check if the string is numeric
// https://www.thepolyglotdeveloper.com/2015/04/evaluate-a-reverse-polish-notation-equation-with-javascript/
String.prototype.isNumeric = function() {
  return !isNaN(parseFloat(this)) && isFinite(this);
}
