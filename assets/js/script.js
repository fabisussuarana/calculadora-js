const result = document.querySelector(".result");
const buttons = document.querySelectorAll(".buttons button");

// número atual
let currentNumber = "";
// o primeiro número
let firstOperand = null;
// o operador atual
let operator = null;
// reseta
let restart = false;

// função de reset
function updateResult(originClear = false) {
    // condição onde se for true mostrará 0, resetando, se for false mostrará o valor clicado
    result.innerText = originClear ? 0 : currentNumber.replace(",", ".");
}

// parâmetro digit contém o valor do botão clicado
function addDigit(digit) {
    // vai dar o return se o valor do botão for uma vírgula e ela estiver incluída com outros números
    // ou se for uma vírgula e não tiver um número atual, apenas ela
    if (digit === "," && (currentNumber.includes(",") || !currentNumber)) return;

    // se a variável restart for igual a true, ou seja, quando for calculado os valores,
    // a variável currentNumber recebe o valor de digit e o restart passa a ser false;
    if (restart) {
        currentNumber = digit;
        restart = false;
    }
    else {
        // concatenando um número no outro
        currentNumber += digit;
    }

    updateResult();
}

function setOperator(newOperator) {
    if (currentNumber) {
        // caso tenha clicado em um operador e nos números para o calculo e resolva continuar 
        // fazendo calculos em cima desse, daí vai calcular
        calculate();

        firstOperand = parseFloat(currentNumber.replace(",", "."));
        currentNumber = "";
    }

    operator = newOperator;
}

function calculate() {
    // se um dos dois forem null vai dar return e parar aqui
    if (operator === null || firstOperand === null) return;

    let secondOperand = parseFloat(currentNumber.replace(",", "."));
    let resultValue;

    switch (operator) {
        case "+":
            resultValue = firstOperand + secondOperand;
            break;
        case "-":
            resultValue = firstOperand - secondOperand;
            break;
        case "x":
            resultValue = firstOperand * secondOperand;
            break;
        case "÷":
            resultValue = firstOperand / secondOperand;
            break;
        default:
            return;
    }

    // LIMITA AS CASAS DECIMAIS DO RESULTADO
    // passa o resultado para string, divide em substrings com base no separador ponto,
    // pega a substring na posição 1, e verifica se essa parte decimal ela é maior que 5
    if (resultValue.toString().split(".")[1]?.length > 5) {
        // fixa as casas decimais após o ponto com no máximo 5 dígitos arredondados
        currentNumber = parseFloat(resultValue.toFixed(5)).toString();
    }
    else {
        currentNumber = resultValue.toString();
    }

    operator = null;
    firstOperand = null;
    restart = true;
    updateResult();
}

// limpa a tela e os cálculos atuais
function clearCalculator(){
    currentNumber = "";
    firstOperand = null;
    operator = null;
    updateResult(true);
}

// calcula a porcentagem
function setPercentage(){
    let result = parseFloat(currentNumber) / 100;

    if(["+", "-"].includes(operator)){
        result = result * (firstOperand || 1);
    }

    if (result.toString().split(".")[1]?.length > 5){
        result = result.toFixed(5).toString();
    }

    currentNumber = result.toString();
    updateResult();
}

// foreach que passa por cada botão pegando o valor do botão que for clicado e colocando em uma variável
buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const buttonText = button.innerText;

        // se o texto clicado for de 0 a 9 ou for vírgula, daí passa no teste
        if (/^[0-9,]+$/.test(buttonText)) {
            // função que adiciona o valor do botão clicado na tela
            addDigit(buttonText);
        }
        // se o botão clicado é um dos operadores
        else if (["+", "-", "x", "÷"].includes(buttonText)) {
            setOperator(buttonText);
        }
        else if (buttonText === "=") {
            calculate();
        }
        else if(buttonText === "C"){
            clearCalculator();
        }
        else if(buttonText === "±"){
            currentNumber = (parseFloat(currentNumber || firstOperand) * -1).toString();
            updateResult();
        } else if(buttonText === "%"){
            setPercentage();
        }
    });
});

