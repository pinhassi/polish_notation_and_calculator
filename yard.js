// helper, top element of an array w/o removing it
Array.prototype.peek = function () {
    return this[this.length - 1];
};

// operators set
const operators = {"+": 1, "-": 1, "*": 1, "/": 1};

// associations (left / right) sets
const leftAssoc =  {"*": 1, "/": 1, "%": 1, "+": 1, "-": 1};
const rightAssoc = {"=": 1, "!": 1};

/**
 * precedenceOf
 *
 * precedence   operators       associativity
 * 1            !               right to left
 * 2            * / %           left to right
 * 3            + -             left to right
 * 4            =               right to left
 */

const precedenceOf = {
    "!": 4,

    "*": 3,
    "/": 3,
    "%": 3,

    "+": 2,
    "-": 2,

    "=": 1
};

/**
 * Shunting_yard_algorithm
 * @param {String} string
 *
 * TODO:
 *    - support digits > 10
 *    - functions
 */
function shuntingYard(string) {

    const output = [];
    const stack = [];

    for (let k = 0, length = string.length; k < length;  k++) {

        // current char
        const ch = string[k];

        // skip whitespaces
        if (ch == " ")
            continue;

        // if it's a number, add it to the output queue
        if (/\d/.test(ch))
            output.push(ch);

        // TODO: if the token is a function token, then push it onto the stack

        // TODO: if the token is a function argument separator (e.g., a comma):

        // if the token is an operator, op1, then:
        else if (ch in operators) {

            const op1 = ch; // just for readability

            // while ...
            while (stack.length) {

                // ... there is an operator token, op2, at the top of the stack
                const op2 = stack.peek();

                if (op2 in operators && (
                    // and op1 is left-associative and its precedence is less than or equal to that of op2,
                    (op1 in leftAssoc && (precedenceOf[op1] <= precedenceOf[op2])) ||
                    // or op1 is right-associative and its precedence is less than that of op2,
                    (op1 in rightAssoc && (precedenceOf[op1] < precedenceOf[op2]))
                )) {

                    // push op2 onto the output queue (it's already popped from the stack);
                    output.push(stack.pop()); // op2

                } else {
                    break;
                }

            }

            // push op1 onto the stack
            stack.push(op1);

        }

        // if the token is a left parenthesis, then push it onto the stack.
        else if (ch == "(")
            stack.push(ch);

        // if the token is a right parenthesis:
        else if (ch == ")") {

            let foundLeftParen = false;

            // until the token at the top of the stack is a left parenthesis,
            // pop operators off the stack onto the output queue
            while (stack.length) {
                const c = stack.pop();
                if (c == "(") {
                    foundLeftParen = true;
                    break;
                } else {
                    output.push(c);
                }
            }

            // if the stack runs out without finding a left parenthesis, then there are mismatched parentheses.
            if (!foundLeftParen)
                throw "Error: parentheses mismatched";

            // pop the left parenthesis from the stack, but not onto the output queue.
            stack.pop();

            // TODO: if the token at the top of the stack is a function token, pop it onto the output queue.

        }

        else throw "Unknown token " + ch;

    }

    // when there are no more tokens to read:
    // while there are still operator tokens in the stack:
    while (stack.length) {

        const c = stack.pop();

        if (c == "(" || c == ")")
            throw "Error: parentheses mismatched";

        // push it to the output
        output.push(c);

    }

    return output.join(" ");

}

String.prototype.isNumeric = function() {
    return !isNaN(parseFloat(this)) && isFinite(this);
};

function calc(postfix) {
        const resultStack = [];
        postfix = postfix.split(" ");
        for(let i = 0; i < postfix.length; i++) {
            if(postfix[i].isNumeric()) {
                resultStack.push(postfix[i]);
            } else {
                const a = resultStack.pop();
                const b = resultStack.pop();
                if(postfix[i] === "+") {
                    resultStack.push(parseInt(a) + parseInt(b));
                } else if(postfix[i] === "-") {
                    resultStack.push(parseInt(b) - parseInt(a));
                } else if(postfix[i] === "*") {
                    resultStack.push(parseInt(a) * parseInt(b));
                } else if(postfix[i] === "/") {
                    resultStack.push(parseInt(b) / parseInt(a));
                } else if(postfix[i] === "^") {
                    resultStack.push(Math.pow(parseInt(b), parseInt(a)));
                }
            }
        }
        if(resultStack.length > 1) {
            return "error";
        } else {
            return resultStack.pop();
        }
    }


let prompt = require('cli-input');
let ps = prompt({infinite: false});
ps.on('value', function(value, options, ps) {
    const inputStr = value.join("");
    const yardSrt = shuntingYard(inputStr);
    const result = calc(yardSrt);
    console.log(`inputStr: ${yardSrt}\nPolish notation: ${yardSrt}\nResult: ${result}`);

});
ps.run();