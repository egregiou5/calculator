function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

function operate(operator, num1, num2) {
  switch (operator) {
    case '+':
      return add(num1, num2);
    case '-':
      return subtract(num1, num2);
    case '*':
      return multiply(num1, num2);
    case '/':
      return divide(num1, num2);
  }
}

let calc_display = document.querySelector('.calc-display');
calc_display.textContent = '0';
let calc_display_exp = document.querySelector('.calc-display-exp');

let current_calculation = 0;  // Holds the 'final' answer
let current_expression = {};  // Follows the format = {num1: 0, operator: '', num2: 0}
let current_number = '';  // Holds the the current number before the user clicks an operator

//  Adds click event listeners to each numbered button which adds them to the calculator display
let nums = document.querySelectorAll('.num');
nums.forEach(num => {
  if (num.classList.contains('b-one')) {
    addNumberEvent(num, 1);
  } else if (num.classList.contains('b-two')) {
    addNumberEvent(num, 2);
  } else if (num.classList.contains('b-three')) {
    addNumberEvent(num, 3);
  } else if (num.classList.contains('b-four')) {
    addNumberEvent(num, 4);
  } else if (num.classList.contains('b-five')) {
    addNumberEvent(num, 5);
  } else if (num.classList.contains('b-six')) {
    addNumberEvent(num, 6);
  } else if (num.classList.contains('b-seven')) {
    addNumberEvent(num, 7);
  } else if (num.classList.contains('b-eight')) {
    addNumberEvent(num, 8);
  } else if (num.classList.contains('b-nine')) {
    addNumberEvent(num, 9);
  } else if (num.classList.contains('b-zero')) {
    addNumberEvent(num, 0);
  }
});

const point = document.querySelector('.b-point');
addNumberEvent(point, '.');

function addNumberEvent(button, digit) {
  button.addEventListener('click', () => {
    if (digit === '.' && current_number === '') {
      updateBackground('0');
      current_number += 0;
    } else if (current_number === '') {
      updateBackground('');
    } else if (calc_display.textContent === '0' || current_number === '0') {
      updateBackground('');
      current_number = '';
    } else if (calc_display.textContent.length >= 12) {
      return;
    } else if (digit === '.' && current_number.includes('.')) {
      return;
    }
    calc_display.textContent += digit;
    bg_items.forEach(item => item.textContent += digit);
    current_number += digit;
  });
}

let ops = document.querySelectorAll('.operator');
ops.forEach(op => {
  if (op.classList.contains('o-plus')) {
    addOperatorEvent(op, '+');
  } else if (op.classList.contains('o-minus')) {
    addOperatorEvent(op, '-');
  } else if (op.classList.contains('o-multiply')) {
    addOperatorEvent(op, '*');
  } else if (op.classList.contains('o-divide')) {
    addOperatorEvent(op, '/');
  }
});

function addOperatorEvent(button, operator) {
  button.addEventListener('click', () => {
    // Checks if anything is in current_expression and sets .num1 and .operator
    // (this condition should only be true the first time an operator
    // is clicked in a calculation)
    if (!('num1' in current_expression)) {
      current_expression.num1 = Number(current_number);
      current_expression.operator = operator;
      current_number = '';
    } else if ('operator' in current_expression && current_number === '') {
      current_expression.operator = operator;
    } else {
      // Sets .num2 in current_expression and calls operate() with the values
      // in current_expression, then sets .num1 with the new calcalution and
      // .operator with the new operator
      current_expression.num2 = Number(current_number);
      if (checkZeroDivision()) {
        return;
      }
      current_calculation = operate(current_expression.operator, current_expression.num1, current_expression.num2);
      current_expression.num1 = current_calculation;
      current_expression.operator = operator;
      // Deletes .num2 in current_expression and resets the current_number
      delete current_expression.num2;
      current_number = '';
      updateBackground(checkDigits(current_calculation));
    }
    calc_display_exp.textContent = `${current_expression.num1} ${current_expression.operator}`;
  });
}

const equals = document.querySelector('.b-equals');
equals.addEventListener('click', () => {
  // If there's currently a number but no operator pressed, do nothing
  if (Object.keys(current_expression).length === 0 && !(current_number === '')) {
    return;
  } else if (('num1' in current_expression && 'operator' in current_expression) &&
      current_number === '') {
    // If there's a number and operator but no current number: (num1 operator num1 = )
    current_expression.num2 = current_expression.num1;
    if (checkZeroDivision()) {
      return;
    }
    current_calculation = operate(current_expression.operator, current_expression.num1, current_expression.num2);
    updateBackground(checkDigits(current_calculation));
    current_expression = {};
    current_number = '';
  } else if (('num1' in current_expression && 'operator' in current_expression) &&
      !(current_number === '')) {
    // If there's 2 numbers and operator: (num1 operator num2 = )
    current_expression.num2 = Number(current_number);
    if (checkZeroDivision()) {
      return;
    }
    current_calculation = operate(current_expression.operator, current_expression.num1, current_expression.num2);
    updateBackground(checkDigits(current_calculation));
    current_expression = {};
    current_number = '';
  } else {
    updateBackground(current_calculation);
  }
  calc_display_exp.textContent = '';
});

const clear = document.querySelector('.b-clear');
clear.addEventListener('click', () => {
  current_expression = {};
  current_number = '';
  current_calculation = 0;
  calc_display.textContent = '0';
  calc_display_exp.textContent = '';
  bg_items.forEach(item => item.textContent = '');
});

const backspace = document.querySelector('.b-backspace');
backspace.addEventListener('click', () => {
  if (current_number === '') {
    return;
  } else {
    current_number = current_number.slice(0, -1);
    if (current_number === '') {
      current_number = '0';
    }
    updateBackground(current_number);
  }
})

function checkDigits(num) {
  let numString = num.toString();
  if (numString.length > 12) {
    numString = num.toExponential(6);
  }
  return numString;
}

function checkZeroDivision() {
  if (current_expression.operator === '/' && current_expression.num2 === 0) {
    updateBackground("Nice try.");
    current_calculation = 0;
    current_expression = {};
    current_number = '';
    calc_display_exp.textContent = '';
    return true;
  } else { return false }
}

const bg_items = document.querySelectorAll('.bg-item');

function updateBackground(string) {
  calc_display.textContent = string;
  bg_items.forEach(item => {
    item.textContent = string;
  });
}