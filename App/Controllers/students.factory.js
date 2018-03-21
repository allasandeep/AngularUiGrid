app.factory("studentsFactory", function ($http) {

    var factory = {};

    
    factory.readStudents = function () {
        return $http({
            method: 'GET',
            url: 'http://localhost:60489/api/Students/'
        });
    };

   

    return factory;
});