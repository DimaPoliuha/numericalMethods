function matrixArray(rows,columns){
    var arr = new Array();
    for(var i=0; i<rows; i++){
      arr[i] = new Array();
    }
    return arr;
}

function F(x, y){
    return (y / x) * Math.log(y / x);
}

function decision(x){
    return x * Math.exp(1 - x);
}

function prediction( k, i ){
    return Y[k][i-1] + step[k] * F(X[k][i-1], Y[k][i-1]);
}

function trapeziumMethod( k, i ){
    return Y[k][i-1] + step[k] / 2 * ( F(X[k][i-1], Y[k][i-1]) + F( X[k][i], prediction( k, i ) ) );
}

function rungeKutta( k, i ){
    var k1 = K1(k, i);
    var k2 = K2(k, i, k1);
    var k3 = K3(k, i, k2);
    var k4 = K4(k, i, k3);
    return Y[k][i-1] + 1/6 * (k1 + 2 * k2 + 2 * k3 + k4);
}

function K1( k, i ){
    return step[k] * F(X[k][i-1], Y[k][i-1]);
}

function K2( k, i,  k1 ){
    return step[k] * F(X[k][i-1] + step[k]/2, Y[k][i-1] + k1/2);
}

function K3( k, i,  k2 ){
    return step[k] * F(X[k][i-1] + step[k]/2, Y[k][i-1] + k2/2);
}

function K4( k, i,  k3 ){
    return step[k] * F(X[k][i-1] + step[k], Y[k][i-1] + k3);
}

var a = 1.0;
var b = 3.0;
var n = new Array();

var step = [ 0.2, 0.04, 0.008];

for(var k = 0; k < 3; k++){
    n[k] =  (b - a) / step[k];
}

    var X = matrixArray(3, 0);
    var Y = matrixArray(3, 0);
    var Ycheck = matrixArray(3, 0);
    var err = matrixArray(3, 0);
    var err1 = matrixArray(3, 0);
    var e = matrixArray(3, 10);

for(var k = 0; k < 3; k++){
    X[k][0] = a;
    Y[k][0] = 1.0;

    for(var i = 1; i <= n[k]; i++){
        X[k][i] = a + i * step[k];
        Y[k][i] = trapeziumMethod(k, i);
        //Y[k][i] = rungeKutta(k, i);
    }
    
    for(var i = 0; i <= n[k]; i++){
        Ycheck[k][i] = decision(X[k][i]);
        err[k][i] = Math.abs( Ycheck[k][i] - Y[k][i] );
        err1[k][i] = Math.abs( 100 * err[k][i] / Y[k][i] );
    }

    var it = 0;
    var itt = 0;
    for(var i = 0; i <= n[0]; i++){
        if(k == 0){
            e[k][i] = Math.abs( Ycheck[k][i] - Y[k][i] );
        }
        if(k == 1){
            e[k][i] = Math.abs( Ycheck[k][it] - Y[k][it] );
            it+=5;
        }
        if(k == 2){
            e[k][i] = Math.abs( Ycheck[k][itt] - Y[k][itt] );
            itt+=25;
        }
    }

    for(var i = 0; i <= n[k]; i++){
        //console.log("X[" + k + "][" + i + "] = " + X[k][i] + " ");
        //console.log("Y[" + k + "][" + i + "] = " + Y[k][i] + " ");
        //console.log(e);
    }
}

//Tables

google.charts.load('current', {'packages':['table']});
google.charts.setOnLoadCallback(drawTable);

function drawTable() {
data = new google.visualization.DataTable();
data.addColumn('string', 'Xk');
data.addColumn('string', 'Y(Xk)');
data.addColumn('string', 'Yk');
data.addColumn('string', 'e = Y(Xk) - Yk');
data.addColumn('string', '100 * e / Yk');
data.addColumn('number', 'Step');
for(var k = 0; k < 3; k++) {
    for(var i = 0; i <= n[k]; i++){
        if(i == 0){
            data.addRows([
                [ "---------------------------", "---------------------------","---------------------------", "---------------------------", "---------------------------", 0 ]
                ]);
        }
        data.addRows([
            [ ""+X[k][i], ""+Ycheck[k][i],""+Y[k][i], ""+err[k][i], ""+err1[k][i], i ]
            ]);
    }
}
var tempName = 'table_div'
table = new google.visualization.Table(document.getElementById(tempName));

table.draw(data, {showRowNumber: false, width: '100%', height: '100%'});
}



// Graphs
/*
var l = 0;

google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(drawBackgroundColor);

function drawBackgroundColor() {
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'X');
    data.addColumn('number', 'Y');
    data.addColumn('number', 'Y check');

    for(var i = 0; i <= n[l]; i++){
        data.addRows([
            [ X[l][i], Y[l][i], Ycheck[l][i] ]
            ]);
    }

    var options = {
    hAxis: {
        title: 'X'
    },
    vAxis: {
        title: 'Y'
    },
    backgroundColor: 'white'
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
    chart.draw(data, options);
}
*/
///
var l = 0;

google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(drawBackgroundColor);

function drawBackgroundColor() {
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'X');
    data.addColumn('number', '1');
    data.addColumn('number', '2');
    data.addColumn('number', '3');

    for(var i = 0; i <= n[l]; i++){
        data.addRows([
            [X[0][i],  e[0][i], e[1][i], e[2][i]]
            ]);
    }

    var options = {
    hAxis: {
        title: 'X',
        minValue: 1,
        maxValue: 3,
        format: 'decimal',
        gridlines: { count: 20 },
    },
    vAxis: {
        title: 'E(X)',
        minValue: 0,
        format: 'scientific',
        gridlines: { count: 10 }
    },
    backgroundColor: 'white',
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
    chart.draw(data, options);
}