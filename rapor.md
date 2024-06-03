# BİLGİSAYAR GRAFİKLERİ ÖDEVİ

## MURAT ŞAHİN - 1306210014

Ekranın ortasında yer alan başlangıç üçgeninin köşelerinin matrisi:
```
const defaultMatrix =
    [
        -0.1, -0.1,
        0.1, -0.1,
        0.0, 0.1,
    ];
```
Bu matris çarpılarak geometrik dönüşümler yapılacak.

Üçgenin köşelerinin koordinatlarını içeren diziyi parametre alan, üçgeni çizen fonksiyon:

```
function drawTriangle(ver) {
    const vertices = ver;
    buffers.positions.push(...vertices);
    drawScene(gl, programInfo, buffers);
}

```

Üçgenin köşeleriyle, ölçeklendirmeyi sağlayan matrisi çarpıp ölçeklendirilmiş köşe koordinatları dizisini dönen fonksiyon:
```
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

```
Bu fonksiyonun benzerlerini taşıma, döndürme, yansıtma, bükme için de oluşturdum. 


Harfleri oluşturken kare kullanacağım için bu fonksiyonu oluşturdum.
Bir kare dört üçgenden oluşuyor. Fonksiyon bu üçgenlerin koordinatlarını dönüyor.
```
function square() {

    //Birinci Üçgen
    let triangle1 = scaleTriangleVertices(0.5, 0.5, defaultMatrix)
    triangle1 = reflectTriangleVertices("y", triangle1)

    //İkinci Üçgen
    let triangle2 = scaleTriangleVertices(0.5, 0.5, defaultMatrix)
    triangle2 = rotateTriangleVertices(Math.PI / 2, triangle2)

    //Üçüncü Üçgen
    let triangle3 = scaleTriangleVertices(0.5, 0.5, defaultMatrix)
    triangle3 = rotateTriangleVertices(Math.PI * 3 / 2, triangle3)

    //Dördüncü Üçgen
    let triangle4 = scaleTriangleVertices(0.5, 0.5, defaultMatrix)

    
    let triangles = []
    triangles.push(triangle1)
    triangles.push(triangle2)
    triangles.push(triangle3)
    triangles.push(triangle4)

    //Üçgen koordinatları içeren dizi dizisi dönüyor.
    return triangles;
}
```

Harfleri oluştururken gerekeceği için dik çizgi oluşturan üçgenlerin koordinatlarını dönen fonksiyon oluşturdum. 

```

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

    //items çizginin içindeki tüm üçgenlerin koordinatlarını tutuyor.
    let items = []
    items = items.concat(square1)
    items = items.concat(square2)
    items = items.concat(square3)

    return items


}

```
Aynı yöntemle yatay çizgi fonksiyonunu oluşturdum.



M harfini oluştururken bükme ve ölçeklendirme ile üçgenin şeklini ayarladım. Yansıtma ile ikinci bir üçgen oluşturup yan yana yerleştirdim.
```
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
```

U harfini oluştururken line ve horizontalline fonksiyonunu çağırıp üçgenleri öteledim.

```
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


```

R'yi oluştururken bir üçgenlerden oluşan çizgi iki üçgen kullandım. Üçgenlere öteleme, bükme, ölçeklendirme, döndürme işlemlerini uyguladım.

```
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


```

A'yı ötelenmiş ve ölçeklendirilmiş bir üçgenden oluşturdum.

T'yi üçgenlerden oluşan bir çizgi ve üçgenden oluşturdum.

```
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
```


