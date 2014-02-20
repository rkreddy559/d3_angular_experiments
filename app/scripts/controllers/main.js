'use strict';
var petasenseControllers = angular.module('petasenseControllers', []);

petasenseControllers.controller('MainCtrl', function ($scope, $http, dateFilter) {
    $scope.acc_data = [];
    $scope.data = [];
    $scope.temp_data = [];
    var live_url = "http://petasense.com/api/configuration/time_series?q={%22filters%22:[{%22name%22:%22channel_id%22,%22op%22:%22eq%22,%22val%22:101}],%22order_by%22:[{%22field%22:%22id%22,%22direction%22:%22desc%22}]}";
    $http({
        method: 'GET',
        url: live_url

    })
    .success(function(data){
        for (var i=0; i< data.objects.length; i++)
        {
            $scope.temp_data.push({time: dateFilter(new Date(data.objects[i].time), $scope.format), temp: data.objects[i].value1});
        }
        //console.log($scope.temp_data);
    })
    .error(function(data, status){
            if (status == 404) {
                console.log('Petasesnse website does not exist');
            } else{
                console.log('Error' + status);
            }
     });

    $scope.format = 'M/d/yy h:mm:ss a';
    $scope.printFFT = function(coordinate){
        $scope.data = [];
        $http.get('json/'+coordinate+'-coordinate.json').success(function(data){
            $scope.acc_data = data;

            var fft = new FFT($scope.acc_data.length);
            var signal = [];
            for (var i=0; i < $scope.acc_data.length; i++)
            {
                signal.push($scope.acc_data[i].data);
            }

            var fout = fft.forward(signal);
            var real = fout.real;
            var imag = fout.imag;
            for (var i=0; i<real.length; i++)
            {
                //console.log({magnitude:(Math.sqrt(real[i] * real[i] + imag[i] * imag[i])), frequency: (i * 60 / real.length)});
                $scope.data.push([ (i * 60 / real.length), (Math.sqrt(real[i] * real[i] + imag[i] * imag[i]))]);

            }
            console.log($scope.data);

        });
    };
    $scope.printFFT('x');




  });
