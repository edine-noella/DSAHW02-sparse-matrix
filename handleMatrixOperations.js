const fs = require('fs');

// Function to load a sparse matrix from a file
function loadSparseMatrix (fileName) {
    const data = fs.readFileSync(fileName, 'utf8').split('\n').filter(line => line.trim());
    const rows = parseInt(data[0].split('=')[1].trim());
    const cols = parseInt(data[1].split('=')[1].trim());
    const matrix = {};
    for (let i = 2; i < data.length; i++) {
        const match = data[i].match(/\((\d+),\s*(\d+),\s*(-?\d+)\)/);
       
        if (!match) {
            throw new Error('Input file has wrong format');
        }
        const [_, row, col, value] = match.map(Number);
        if (!matrix[row]) {
            matrix[row] = {};
        }
        matrix[row][col] = value;
    }
    return { rows, cols, matrix };
}



// Function to get the element at a specific position (return 0 if not set)
function getElement(matrix, row, col) {
    if (!matrix[row] || !matrix[row][col]) {
        return 0;
    } else {
        return matrix[row][col];
    }
}

// Function to set an element in the matrix
function setElement(matrix, row, col, value) {
    if (!matrix[row]) {
        matrix[row] = {};
    }
    matrix[row][col] = value;
}

// Matrix addition
function addMatrices(matrix1, matrix2) {
    if (matrix1.rows !== matrix2.rows || matrix1.cols !== matrix2.cols) {
        throw new Error('Matrix dimensions do not match for addition');
    }

    const result = { rows: matrix1.rows, cols: matrix1.cols, matrix: {} };

    for (let row in matrix1.matrix) {
        for (let col in matrix1.matrix[row]) {
            const sum = getElement(matrix1.matrix, row, col) + getElement(matrix2.matrix, row, col);
            if (sum !== 0) setElement(result.matrix, row, col, sum);
        }
    }
    for (let row in matrix2.matrix) {
        for (let col in matrix2.matrix[row]) {
            if (!matrix1.matrix[row] || !matrix1.matrix[row][col]) {
                const sum = getElement(matrix1.matrix, row, col) + getElement(matrix2.matrix, row, col);
                if (sum !== 0) setElement(result.matrix, row, col, sum);
            }
        }
    }

    return result;
}

// Matrix subtraction
function subtractMatrices(matrix1, matrix2) {
    if (matrix1.rows !== matrix2.rows || matrix1.cols !== matrix2.cols) {
        throw new Error('Matrix dimensions do not match for subtraction');
    }

    const result = { rows: matrix1.rows, cols: matrix1.cols, matrix: {} };

    for (let row in matrix1.matrix) {
        for (let col in matrix1.matrix[row]) {
            const diff = getElement(matrix1.matrix, row, col) - getElement(matrix2.matrix, row, col);
            if (diff !== 0) setElement(result.matrix, row, col, diff);
        }
    }
    for (let row in matrix2.matrix) {
        for (let col in matrix2.matrix[row]) {
            if (!matrix1.matrix[row] || !matrix1.matrix[row][col]) {
                const diff = getElement(matrix1.matrix, row, col) - getElement(matrix2.matrix, row, col);
                if (diff !== 0) setElement(result.matrix, row, col, diff);
            }
        }
    }

    return result;
}

// Matrix multiplication
function multiplyMatrices(matrix1, matrix2) {
    if (matrix1.cols !== matrix2.rows) {
        throw new Error('Matrix dimensions do not match for multiplication');
    }

    const result = { rows: matrix1.rows, cols: matrix2.cols, matrix: {} };

    for (let row in matrix1.matrix) {
        for (let col in matrix2.matrix) {
            let sum = 0;
            for (let k = 0; k < matrix1.cols; k++) {
                sum += getElement(matrix1.matrix, row, k) * getElement(matrix2.matrix, k, col);
            }
            if (sum !== 0) setElement(result.matrix, row, col, sum);
        }
    }

    return result;
}

// Function to print matrix
function printSparseMatrix(matrix) {
    console.log(`Matrix (${matrix.rows}x${matrix.cols})`);
    for (let row in matrix.matrix) {
        for (let col in matrix.matrix[row]) {
            console.log(`(${row}, ${col}, ${matrix.matrix[row][col]})`);
        }
    }
}


const matrix1 = loadSparseMatrix('matrix1.txt');
const matrix2 = loadSparseMatrix('matrix2.txt');

const sumMatrix = addMatrices(matrix1, matrix2);
const differenceMatrix = subtractMatrices(matrix1, matrix2);
const productMatrix = multiplyMatrices(matrix1, matrix2);

console.log('sum: ');
console.log("-----------------");
printSparseMatrix(sumMatrix);

console.log('difference: ');
console.log("-----------------");
printSparseMatrix(differenceMatrix);

console.log('product: ');
console.log("-----------------");
printSparseMatrix(productMatrix);