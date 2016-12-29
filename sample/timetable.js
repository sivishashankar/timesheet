/*** json object
 * {
 'id':0, 
 // if need use to store primary key value from DB table.
 
 'modified':1,
 //defaule value is mentions as '1' mean that new row created.
  while assiging value from server assign as '0' 
  and when it have 2 then the row data is from server and it has been modified. 
  
 'client':'', 
  //client name.
  
 'project':'',
 // project name.
 
 'sat':0, 
 // saturday worked time. 
 'satR':''
 // saturday review notes.
 'sun':0,
 'sunR':'',
 'mon':0,
 'monR':'',
 'tue':0,
 'tueR':'',
 'wed':0,
 'wedR':'',
 'thu':0,
 'thuR':'',
 'fri':0,
 'friR':''
 }
 */
var app = angular.module("myapp", []);
app.controller("ListController", ['$scope',
function($scope) {
	$scope.reviewIndex = 0;
	$scope.reviewDay = "satR";
	$scope.reviewNotes = "";
	$scope.date = new Date();
	$scope.clickDate = "";//selected date will be stored in this vairable in the format as (mm/dd/yyyy)
	$scope.timetables = [];//time sheet array of data as json object.
	$scope.heads = []; 
	$scope.rowTotal = [];
	$scope.hideReviewPopup = true;
	$scope.add = function() {
		$scope.timetables.push({
			'id' : 0,
			'modified' : 1,
			'client' : '',
			'project' : '',
			'sat' : 0,
			'satR' : '',
			'sun' : 0,
			'sunR' : '',
			'mon' : 0,
			'monR' : '',
			'tue' : 0,
			'tueR' : '',
			'wed' : 0,
			'wedR' : '',
			'thu' : 0,
			'thuR' : '',
			'fri' : 0,
			'friR' : ''
		});
	};
	
	$scope.rowTotal = [0, 0, 0, 0, 0, 0, 0];
	// previous week navigation button function
	$scope.prev = function() {
		$scope.timetables = [];//clearing the existing table
		$scope.date.setDate($scope.date.getDate() - 14);//initiation date for previous date.
		$scope.dayHead();//creating header .
		//call ajax call for previous week data .
	};
	//next week naviagtion buttion function.
	$scope.next = function() {
		$scope.timetables = [];//clearing the existing table
		$scope.dayHead();//creating header .
		//call ajax call for next week data.
	};
	
	$scope.setTimedate = function() {
		var cDate = $scope.clickDate;
		if (cDate.trim() == "") {
			$scope.date = new Date();
		} else {
			var split = $scope.clickDate.split('/');
			$scope.date = new Date(parseInt(split[2]), parseInt(split[0]) - 1, parseInt(split[1]));
		}
		var day = $scope.date.getDay();
		$scope.date.setDate($scope.date.getDate() - (day+1));
	};
	$scope.dayHead = function() {
		$scope.heads = [];
		var days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fir'];
		for ( i = 0; i < 7; i++) {
			$scope.heads.push(days[i] + " " + ($scope.date.getMonth() + 1) + "/" + $scope.date.getDate());
			$scope.date.setDate($scope.date.getDate() + 1);
		}
	};
	
	//this function will get the time sheet for selected date of week.
	$scope.getforDate = function(){
		$scope.setTimedate();
		$scope.dayHead();
		//add ajax call to get the selected week time sheet.
	};
	
	$scope.udpatePerDayWork = function(index, day) {
		$scope.rowTotal = [0, 0, 0, 0, 0, 0, 0];
		$scope.timetables[index].modified=2;
		for ( i = 0; i < $scope.timetables.length; i++) {
			$scope.rowTotal[0] += $scope.timetables[i].sat;
			$scope.rowTotal[1] += $scope.timetables[i].sun;
			$scope.rowTotal[2] += $scope.timetables[i].mon;
			$scope.rowTotal[3] += $scope.timetables[i].tue;
			$scope.rowTotal[4] += $scope.timetables[i].wed;
			$scope.rowTotal[5] += $scope.timetables[i].thu;
			$scope.rowTotal[6] += $scope.timetables[i].fri;
		}
	};
	
	//to open review box popup.
	$scope.openReviewBox = function(index, reviewDay) {
		$scope.reviewIndex = index;
		$scope.reviewDay = reviewDay;
		$scope.reviewNotes = $scope.timetables[$scope.reviewIndex][$scope.reviewDay];
		$scope.hideReviewPopup = false;
	};
	
	//review popup close method.
	$scope.updateReview = function() {
		$scope.timetables[$scope.reviewIndex][$scope.reviewDay] = $scope.reviewNotes;
		$scope.hideReviewPopup = true;
	};
	
	// the function is used to save the modified timesheet data. 
	// $scope.timetables array object have update data.
	$scope.save = function() {
		console.log($scope.timetables);
		// save the table data. The "timetables" have array of data.
		//ajax call.
		$http.post('/someUrl', $scope.timetables)
		.then(
			function mySucces(response) {
				console.log(response.data);
			}, function myError(response) {
				
			}
		);
		
	};
	
	$scope.setTimedate();
	$scope.dayHead();
}]);
