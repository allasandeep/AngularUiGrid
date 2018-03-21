var app = angular.module("uigridApp", ["ui.grid", "ui.grid.pagination", "ui.grid.selection", "ui.grid.cellNav", "ui.grid.autoResize", "ui.grid.resizeColumns"]);
app.controller("uigridCtrl", function ($scope, $http,studentsFactory,$log, $timeout, uiGridConstants, $templateCache) {
    var rowIndex = [];
    var origdata1, i, dataLen, statesData;
    var fixedSize = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    var pageSize = [];
    $scope.editVisible = false;
    $scope.showAllVisible = false;
    //$http.get("data.json").then(function (response) {
    //    $scope.myData = response.data.students;
    //    $scope.gridOptions.data = $scope.myData;
    //   origdata1 = angular.copy($scope.myData);
    //    dataLen = $scope.myData.length;        
    //    for (i = 0; fixedSize[i] < dataLen; i++) {
    //        var value = fixedSize[i];
    //        pageSize.push(value);
    //    }
    //    pageSize.push(dataLen);
    //});

    studentsFactory.readStudents().then(function successCallback(response) {
        $scope.myData = response.data;
        $scope.gridOptions.data = $scope.myData;
    }, function errorCallback(response) {
        alert("Unable to read record.");
    });
  

    $scope.compareVisible = true;
    $scope.resetVisible = false;
    $scope.resetClearSelectionsVisible = false;
    $scope.gridOptions = {
        paginationPageSize:10,
        paginationPageSizes: pageSize,       
        
        enableFiltering: true,
        multiSelect: true,
        selectionRowHeaderWidth: 30,
        selectionRowHeaderHeight: 50,
        enableVerticalScrollbar: 0,
        enableHorizontalScrollbar: 1,        
        enableColumnResize: true,
        enableColumnReordering: true,
      //enablePaginationControls:false,
        headerTemplate: 'header-template.html',       
        superColDefs: [{
            name: 'name',
            displayName: 'Name'
        }, {
            name: 'other',
            displayName: 'Other Information'
        }],   
         // enableGridMenu:true,
        rowHeight: 30,
        showGridFooter: true,     
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            $scope.countRows = 0;
            $scope.gridApi.grid.registerRowsProcessor($scope.dynamicHeight, 200);
            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                $scope.countRows = $scope.gridApi.selection.getSelectedRows().length;
            });

            gridApi.selection.on.rowSelectionChangedBatch($scope, function (row) {
                $scope.countRows = $scope.gridApi.selection.getSelectedRows().length;
            });

            $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                $scope.resetVisible = true;
            });

            $scope.gridApi.core.on.filterChanged($scope, function () {
                $scope.resetVisible = false;
                var columns = $scope.gridApi.grid.columns;
                for (var i = 0; i < columns.length; i++) {
                    if (columns[i].enableFiltering) {
                        if (!(typeof columns[i].filters[0].term === 'undefined')) {
                            $scope.resetVisible = true;
                            break;
                        }
                    }
                }
            });  

            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                var index = row.grid.renderContainers.body.visibleRowCache.indexOf(row);
                rowIndex.push($scope.gridOptions.data.indexOf(row.entity));
                $scope.resetClearSelectionsVisible = true;
                 // console.log(JSON.stringify(rowIndex));                 
                // locationArray.push({ value: $scope.myData[index]["location"]});
               //  console.log(JSON.stringify(locationArray));                
               // var msg = 'row selected ' + row.isSelected + '  Firstname :' + $scope.myData[index]["firstname"] + '  Lastname :' + $scope.myData[index]["lastname"] + '  Age :' + $scope.myData[index]["age"] + '  location :' + $scope.myData[index]["location"];
              //   $log.log(msg);
             });      
        }

    };   
   

    /* function updatePagination(rowsDifference) {          
         $scope.gridOptions.paginationPageSize = $scope.gridOptions.paginationPageSize + rowsDifference;
     }*/
    
    //$scope.getTableStyle = function () {         
    //    return {
    //        height: (dataLen * $scope.gridOptions.rowHeight ) + 260 + "px"
    //    };   
    //};

    window.onscroll = function () { scrollFunction() };
    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            document.getElementById("myBtn").style.display = "block";
        } else {
            document.getElementById("myBtn").style.display = "none";
        }
    }
  
    $scope.topFunction = function () {        
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;       
    }

    $scope.dynamicHeight = function (renRows) {
        $timeout(function () {
            var newHeight = ($scope.gridApi.grid.getVisibleRowCount() * 30) + 280;
            angular.element(document.getElementsByClassName('grid')[0]).css('height', newHeight + 'px');
        }, 500);
        return renRows;
    }

    function headerCellTemplate() {
        return "<div class='ui-grid-spilt-header-main'><div ng-class=\"{ 'sortable': sortable }\"><div class=\"ui-grid-cell-contents verticalText\" col-index=\"renderIndex\"><p class=\"verticalTextSpan\">{{ col.displayName CUSTOM_FILTERS }}</p><span ui-grid-visible=\"col.sort.direction\" ng-class=\"{ 'ui-grid-icon-up-dir': col.sort.direction == asc, 'ui-grid-icon-down-dir': col.sort.direction == desc, 'ui-grid-icon-blank': !col.sort.direction }\">&nbsp;</span></div></div><div ng-if=\"filterable\" class=\"ui-grid-filter-container\" ng-repeat=\"colFilter in col.filters\"><input type=\"text\" class=\"ui-grid-filter-input\" style=\"padding:0; height:20px;\" ng-model=\"colFilter.term\" ng-attr-placeholder=\"{{colFilter.placeholder || ''}}\"></div></div>";
    }

    var selectionCellTemplate = '<div class="ngCellText ui-grid-cell-contents" ng-click="grid.appScope.rowClick(row)">' + ' <div ng-click="grid.appScope.rowClick(row)" style="margin:auto">{{COL_FIELD}}</div>' + '</div>';

    $scope.rowClick = function (row) {
        var index = row.grid.renderContainers.body.visibleRowCache.indexOf(row);
        if (row.isSelected) {
            $scope.gridApi.selection.unSelectRow($scope.gridOptions.data[index]);
        }
        else {
            $scope.gridApi.selection.selectRow($scope.gridOptions.data[index]);
        }
    }; 

    function headerCellDropdownTemplate() {
        return "<div class='ui-grid-spilt-header-main'><div ng-class=\"{ 'sortable': sortable }\"><div class=\"ui-grid-cell-contents verticalText\" col-index=\"renderIndex\"><p class=\"verticalTextSpan\">{{ col.displayName CUSTOM_FILTERS }}</p><span ui-grid-visible=\"col.sort.direction\" ng-class=\"{ 'ui-grid-icon-up-dir': col.sort.direction == asc, 'ui-grid-icon-down-dir': col.sort.direction == desc, 'ui-grid-icon-blank': !col.sort.direction }\">&nbsp;</span></div></div><div ng-if=\"filterable\" class=\"ui-grid-filter-container\" ng-repeat=\"colFilter in col.filters\"><select ng-model=\"colFilter.term\" style=\"padding:0; height:20px;\" ng-options=\"option.value as option.value for option in colFilter.selectOptions\">  </select></div></div>";
    }

    $scope.gridOptions.columnDefs = [
        { field: 'FirstName', displayName: 'First Name', superCol:'name',minWidth: 150,maxWidth:300, headerCellTemplate: headerCellTemplate() ,cellTemplate: selectionCellTemplate},
        { field: 'LastName', displayName: 'Last Name', superCol: 'name', minWidth: 150, maxWidth: 300, headerCellTemplate: headerCellTemplate(), cellTemplate: selectionCellTemplate },
        { field: 'Age', displayName: 'Age', superCol: 'other', minWidth: 150, maxWidth: 300, headerCellTemplate: headerCellTemplate(), cellTemplate: selectionCellTemplate },
        {
            field: 'Location', displayName: 'Location', superCol: 'other', minWidth: 150, maxWidth: 300, enableColumnResizing: false, headerCellTemplate: headerCellDropdownTemplate(), cellTemplate: selectionCellTemplate,
            filter: {
            term: '',
            type: uiGridConstants.filter.SELECT,
            selectOptions:GetLocationSelectOptions("location")
            }, disableCancelFilterButton: true
        },
    ];

    //select checkboxes
    $templateCache.put('ui-grid/selectionRowHeaderButtons',
       "<div class=\"ui-grid-selection-row-header-buttons \" ng-class=\"{'ui-grid-row-selected': row.isSelected}\" ><input style=\"margin: 3px; vertical-align: middle\" type=\"checkbox\" ng-model=\"row.isSelected\" ng-click=\"row.isSelected=!row.isSelected;selectButtonClick(row, $event)\">&nbsp;</div>"
     );

    //header
    $templateCache.put('ui-grid/selectionSelectAllButtons',
      "<div class=\"ui-grid-selection-row-header-buttons \" ng-class=\"{'ui-grid-all-selected': grid.selection.selectAll}\" ng-if=\"grid.options.enableSelectAll\"><!--<input style=\"margin: 0; vertical-align: middle\" type=\"checkbox\" ng-model=\"grid.selection.selectAll\" ng-click=\"grid.selection.selectAll=!grid.selection.selectAll;headerButtonClick($event)\">--> <span class=\"button\" id=\"compareStudents\" title=\"Compare Students\" ng-disabled=\"grid.appScope.countRows<=1\" ng-if=\"grid.appScope.compareVisible\" ng-click=\"grid.appScope.compare()\" ><i class=\"material-icons\" style=\"position:relative; right:2px;\">&#xe3b9;</i></span><span class=\"glyphicon glyphicon-edit\" style=\"margin:0; vertical-align: middle; padding:8px 2px\" role=\"button\" title=\"Edit Selection\" ng-if=\"grid.appScope.editVisible\" ng-click=\"grid.appScope.edit()\"></span><span class=\"glyphicon glyphicon-list\" style=\"margin:0; vertical-align: middle; padding:2px 2px\" role=\"button\" title=\"Show all Students\" ng-if=\"grid.appScope.showAllVisible\" ng-click=\"grid.appScope.resetDefault()\"></span></div>"
    );
    
   
    //$http.get("States.json").then(function (response) {
    //    $scope.sData = response.data.records;
    //    statesData = angular.copy($scope.sData);
    //});

    
    function GetLocationSelectOptions(type) {
         var locationArray = [], locationSelectOptions = [], value;   
          angular.forEach($scope.myData, function (column, index) {
             value = $scope.myData[index][type];               
              locationArray.push(value);                     
                 
             });

             locationArray.sort();
           
             locationSelectOptions.push({ value: "", selected: "selected"});
             angular.forEach(locationArray, function (content, index) {                 
                 locationSelectOptions.push({ value: content })

             });
             var uniq = new Set(locationSelectOptions.map(e => JSON.stringify(e)));
             var res = Array.from(uniq).map(e => JSON.parse(e));
        return res;
    }

    $scope.clearFilters = function () {
        $scope.gridApi.grid.clearAllFilters();
        $scope.gridApi.grid.resetColumnSorting();
        $scope.resetVisible = false;
    };
    

    $scope.clearSelections = function () {
        $scope.gridApi.selection.clearSelectedRows();
        $scope.resetClearSelectionsVisible = false;
    };



    //$scope.selectAll = function () {
    //    $scope.gridApi.selection.selectAllRows();
    //};
   

    $scope.edit = function () {     
        $scope.gridOptions.data = $scope.myData;
        $scope.editVisible = false;
        $scope.showAllVisible = false;
        $scope.compareVisible = true;
        
    };

    $scope.resetDefault = function () {
        $scope.gridApi.selection.clearSelectedRows();        
        $scope.gridOptions.data = $scope.myData;        
        $scope.editVisible = false;
        $scope.showAllVisible = false;
        $scope.compareVisible = true;
        $scope.resetClearSelectionsVisible = false;        

    };
       

    $scope.compare = function (row) {

        if ($scope.countRows <= 0) {
            window.alert("Select Students first!");
        } else if ($scope.countRows <= 1)
        {
            window.alert("Select atleast two Students!");
        }else
        {
            var filteredData = $scope.gridApi.selection.getSelectedRows();
            $scope.gridOptions.data = filteredData;           
            // console.log(JSON.stringify(res));
            $scope.editVisible = true;
            $scope.showAllVisible = true;
            $scope.compareVisible = false;
        }
       
       
};


});



