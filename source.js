
const canvas = document.getElementById('glcanvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    console.error("WebGL not supported");
}


const vsSource = `
    attribute vec4 aVertexPosition;
    void main(void) {
        gl_Position = aVertexPosition;
    }
`;


const fsSource = `
    void main(void) {
        gl_FragColor = vec4(0.8, 0.95, 0.25, 1.0);
    }
`;


const shaderProgram = initShaderProgram(gl, vsSource, fsSource);


const programInfo = {
    program: shaderProgram,
    attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
    },
};


const buffers = {
    position: gl.createBuffer(),
    positions: [],
};


function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}


function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}


function drawScene(gl, programInfo, buffers) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(buffers.positions), gl.STATIC_DRAW);


    {
        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }

    gl.useProgram(programInfo.program);


    {
        const offset = 0;
        const vertexCount = buffers.positions.length / 2;
        gl.drawArrays(gl.TRIANGLES, offset, vertexCount);
    }
}



function drawTriangle(ver) {
    const vertices = ver;
    buffers.positions.push(...vertices);
    drawScene(gl, programInfo, buffers);
}








function scaleTriangleVertices(sx, sy, ver) {
    var scaleMatrix = new Float32Array([
        sx, 0, 0,
        0, sy, 0,
        0, 0, 1
    ]);
    const vertices = ver;
    const scaledVertices = [];
    for (let i = 0; i < vertices.length; i += 2) {
        const x = vertices[i];
        const y = vertices[i + 1];
        const newX = scaleMatrix[0] * x + scaleMatrix[1] * y + scaleMatrix[2] * 1;
        const newY = scaleMatrix[3] * x + scaleMatrix[4] * y + scaleMatrix[5] * 1;
        scaledVertices.push(newX, newY);
    }

    return (scaledVertices)

}


function drawScaledTriangle(sx, sy, ver) {
    const scaledVertices = scaleTriangleVertices(sx, sy, ver)
    buffers.positions.push(...scaledVertices);
    drawScene(gl, programInfo, buffers);

}








function drawTranslatedTriangle(a, b, ver) {
    const scaledVertices = translateTriangleVertices(a, b, ver)


    buffers.positions.push(...scaledVertices);
    drawScene(gl, programInfo, buffers);
}
function translateTriangleVertices(a, b, ver) {

    var scaleMatrix = new Float32Array([
        1, 0, a,
        0, 1, b,
        0, 0, 1
    ]);
    const vertices = ver;
    const scaledVertices = [];
    for (let i = 0; i < vertices.length; i += 2) {
        const x = vertices[i];
        const y = vertices[i + 1];
        const newX = scaleMatrix[0] * x + scaleMatrix[1] * y + scaleMatrix[2] * 1;
        const newY = scaleMatrix[3] * x + scaleMatrix[4] * y + scaleMatrix[5] * 1;
        scaledVertices.push(newX, newY);
    }

    return scaledVertices
}










function drawRotatedTriangle(angle, ver) {
    const rotatedVertices = rotateTriangleVertices(angle, ver)


    buffers.positions.push(...rotatedVertices);
    drawScene(gl, programInfo, buffers);
}
function rotateTriangleVertices(angle, ver) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);

    const rotateMatrix = [
        c, -s, 0,
        s, c, 0,
        0, 0, 1
    ];
    const vertices = ver;
    const rotatedVertices = [];
    for (let i = 0; i < vertices.length; i += 2) {
        const x = vertices[i];
        const y = vertices[i + 1];
        const newX = rotateMatrix[0] * x + rotateMatrix[1] * y + rotateMatrix[2] * 1;
        const newY = rotateMatrix[3] * x + rotateMatrix[4] * y + rotateMatrix[5] * 1;
        rotatedVertices.push(newX, newY);
    }

    return rotatedVertices;
}












function drawReflectedTriangle(axis, ver) {
    const reflectedVertices = reflectTriangleVertices(axis, ver)


    buffers.positions.push(...reflectedVertices);
    drawScene(gl, programInfo, buffers);
}
function reflectTriangleVertices(axis, ver) {

    let reflectMatrix = []
    if (axis == "x") {

        reflectMatrix = [
            -1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ];
    }
    else {
        reflectMatrix = [
            1, 0, 0,
            0, -1, 0,
            0, 0, 1
        ];

    }
    const vertices = ver;
    const reflectedVertices = [];
    for (let i = 0; i < vertices.length; i += 2) {
        const x = vertices[i];
        const y = vertices[i + 1];
        const newX = reflectMatrix[0] * x + reflectMatrix[1] * y + reflectMatrix[2] * 1;
        const newY = reflectMatrix[3] * x + reflectMatrix[4] * y + reflectMatrix[5] * 1;
        reflectedVertices.push(newX, newY);
    }


    return reflectedVertices;
}















function drawShearedTriangle(shx, shy, ver) {
    const shearedVertices = shearTriangleVertices(shx, shy, ver)


    buffers.positions.push(...shearedVertices);
    drawScene(gl, programInfo, buffers);
}
function shearTriangleVertices(shx, shy, ver) {

    const shearMatrix = [
        1, shx, 0,
        shy, 1, 0,
        0, 0, 1
    ];


    const vertices = ver;
    const shearedVertices = [];
    for (let i = 0; i < vertices.length; i += 2) {
        const x = vertices[i];
        const y = vertices[i + 1];
        const newX = shearMatrix[0] * x + shearMatrix[1] * y + shearMatrix[2] * 1;
        const newY = shearMatrix[3] * x + shearMatrix[4] * y + shearMatrix[5] * 1;
        shearedVertices.push(newX, newY);
    }


    return shearedVertices;
}






const defaultMatrix =
    [
        -0.1, -0.1,
        0.1, -0.1,
        0.0, 0.1,
    ];


function square() {
    let triangle1 = scaleTriangleVertices(0.5, 0.5, defaultMatrix)
    triangle1 = reflectTriangleVertices("y", triangle1)


    let triangle2 = scaleTriangleVertices(0.5, 0.5, defaultMatrix)
    triangle2 = rotateTriangleVertices(Math.PI / 2, triangle2)


    let triangle3 = scaleTriangleVertices(0.5, 0.5, defaultMatrix)
    triangle3 = rotateTriangleVertices(Math.PI * 3 / 2, triangle3)


    let triangle4 = scaleTriangleVertices(0.5, 0.5, defaultMatrix)


    let triangles = []
    triangles.push(triangle1)
    triangles.push(triangle2)
    triangles.push(triangle3)
    triangles.push(triangle4)


    return triangles;
}


function line() {
    let square1 = square()
    let square2 = square()
    let square3 = square()

    for (i = 0; i < square2.length; i++) {
        square2[i] = translateTriangleVertices(0.0, 0.1, square2[i])
    }

    for (i = 0; i < square3.length; i++) {
        square3[i] = translateTriangleVertices(0.0, 0.2, square3[i])
    }


    let items = []
    items = items.concat(square1)
    items = items.concat(square2)
    items = items.concat(square3)

    return items


}

function horizontalline() {
    let square1 = square()
    let square2 = square()

    for (i = 0; i < square2.length; i++) {
        square2[i] = translateTriangleVertices(0.1, 0.0, square2[i])
    }


    let items = []
    items = items.concat(square1)
    items = items.concat(square2)

    return items


}





function drawM() {
    let triangle = shearTriangleVertices(-0.5, 0.0, defaultMatrix)


    triangle = scaleTriangleVertices(0.75, 1.5, triangle)

    let triangle2 = reflectTriangleVertices("x", triangle)

    triangle2 = translateTriangleVertices(0.225, 0, triangle2)
    triangle = translateTriangleVertices(-0.9, 0.10, triangle)
    triangle2 = translateTriangleVertices(-0.9, 0.10, triangle2)

    drawTriangle(triangle)
    drawTriangle(triangle2)

}

function drawU() {
    items = line()
    for (i = 0; i < items.length; i++) {
        items[i] = translateTriangleVertices(-0.55, 0.0, items[i])
    }
    for (i = 0; i < items.length; i++) {
        drawTriangle(items[i])
    }
    items = horizontalline()
    for (i = 0; i < items.length; i++) {
        items[i] = translateTriangleVertices(-0.45, 0.0, items[i])
    }
    for (i = 0; i < items.length; i++) {
        drawTriangle(items[i])
    }
    items = line()
    for (i = 0; i < items.length; i++) {
        items[i] = translateTriangleVertices(-0.35, 0.0, items[i])
    }
    for (i = 0; i < items.length; i++) {
        drawTriangle(items[i])
    }


}

function drawR() {
    items = line()
    for (i = 0; i < items.length; i++) {
        items[i] = translateTriangleVertices(-0.22, 0.0, items[i])
    }
    for (i = 0; i < items.length; i++) {
        drawTriangle(items[i])
    }

    let triangle1 = rotateTriangleVertices(Math.PI * 3 / 2, defaultMatrix)
    triangle1 = scaleTriangleVertices(0.8, 0.8, triangle1)
    triangle1 = translateTriangleVertices(-0.09, 0.17, triangle1)

    let triangle2 = shearTriangleVertices(-0.8, 0, defaultMatrix)
    triangle2 = translateTriangleVertices(-0.10, 0.05, triangle2)
    triangle2 = scaleTriangleVertices(1, 0.8, triangle2)




    drawTriangle(triangle1)
    drawTriangle(triangle2)



}
function drawA() {

    let triangle = translateTriangleVertices(0.24, 0.066, defaultMatrix)
    triangle = scaleTriangleVertices(0.75, 1.48, triangle)

    drawTriangle(triangle)


}

function drawT() {

    items = line()
    for (i = 0; i < items.length; i++) {
        items[i] = translateTriangleVertices(0.45, 0.0, items[i])

    }

    for (i = 0; i < items.length; i++) {
        drawTriangle(items[i])
    }

    let triangle1 = scaleTriangleVertices(1.7, 0.35, defaultMatrix)
    triangle1 = translateTriangleVertices(0.45, 0.24, triangle1)
    drawTriangle(triangle1)


}





gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

drawScene(gl, programInfo, buffers);



drawM()
drawU()
drawR()
drawA()
drawT()


