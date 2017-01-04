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
app.controller("ListController", ['$scope','$http',
function($scope, $http) {
	$scope.reviewIndex = 0;
	$scope.reviewDay = "satR";
	$scope.reviewNotes = "";
	$scope.date = new Date();
	$scope.clickDate = "";//selected date will be stored in this vairable in the format as (mm/dd/yyyy)
	$scope.timetables = [];//time sheet array of data as json object.
	$scope.heads = []; 
	$scope.rowTotal = [];
	$scope.hideReviewPopup = true;
	$scope.rowTotal = ['00:00', '00:00', '00:00', '00:00', '00:00', '00:00', '00:00'];
	$scope.deletedIDs = [];
	
	$scope.add = function() {
		$scope.addTimetablejsontoTimesheetArray();
	};
	
	$scope.addTimetablejsontoTimesheetArray = function(){
		var timesheet = {
			'modified' : 1,
			'client' :{'id':0,'name':''},
			'project' : {'id':0,'name':''},
			'location' : '',
			'category':'',
			'sat' : {'id':0,'time':'00:00','remark':''},
			'sun' : {'id':0,'time':'00:00','remark':''},
			'mon' : {'id':0,'time':'00:00','remark':''},
			'tue' : {'id':0,'time':'00:00','remark':''},
			'wed' : {'id':0,'time':'00:00','remark':''},
			'thu' : {'id':0,'time':'00:00','remark':''},
			'fri' : {'id':0,'time':'00:00','remark':''}
		};
		$scope.timetables.push(timesheet);
	};
	var timeCalculation = function(time1, time2){
		var totalMin = parseInt(time1.split(':')[1])
						+parseInt(time2.split(':')[1]);
		console.log(totalMin);
		var min = totalMin % 60;
		var hour = parseInt(time1.split(':')[0])
					+parseInt(time2.split(':')[0]);
		return (hour<10?('0'+hour):hour)+":"+(min<10?('0'+min):min) ;
	};
	
	$scope.calculateTimePerWeek =function(sun, mon, tue, wed, thu, fri, sat){
		return timeCalculation(
				timeCalculation(
					timeCalculation(
					timeCalculation(
						timeCalculation(
							timeCalculation(sun, mon)
							,tue)
							,wed)
							,thu)
							,fri)
							,sat);
	};
	$scope.createInitialBean = function(jsonDatafromserver){
		var days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fir', 'sat'];
		angular.forEach(beanDatafromserver, function(jsonData) { 
		  var flag = false;
		  var datefromserver = jsonData.TaskDate.split(' ')[0].split('-');
		  var taskDate  = new Date(paseInt(datefromserver[0]),(datefromserver(jsonDate[1])-1),datefromserver(jsonDate[2]));
		  angular.forEach($scope.timetables, function(time){
		  	if(time.client.name==jsonData.GOCName && time.project.name==jsonData.ProjectName ){
		  		var day = time[days[taskDate.getDay()]];
		  		if(day.id==0){
			  		day.id = jsonData.uid;
			  		day.remark = josnData.Remarks;
			  		day.time = jsonData.Task_Hrs+":"+jsonData.Task_Mins;
			  		flag = true;
			  	}
		  	}
		  	
		  	if(flag) return;
		  });
		  if(!flag){
		  	var time = $scope.addTimetablejsontoTimesheetArray();
		  	var day = time[days[taskDate.getDay()]];
		  	day.id = jsonData.uid;
			day.remark = josnData.Remarks;
			day.time = jsonData.Task_Hrs+":"+jsonData.Task_Mins;
		  }
		});

	};
	
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
		$scope.rowTotal = ['00:00', '00:00', '00:00', '00:00', '00:00', '00:00', '00:00'];
		$scope.timetables[index].modified=2;
		for ( i = 0; i < $scope.timetables.length; i++) {
			$scope.rowTotal[0] =timeCalculation($scope.rowTotal[0], $scope.timetables[i].sat.time);
			$scope.rowTotal[1] =timeCalculation($scope.rowTotal[1], $scope.timetables[i].sun.time);
			$scope.rowTotal[2] =timeCalculation($scope.rowTotal[2], $scope.timetables[i].mon.time);
			$scope.rowTotal[3] =timeCalculation($scope.rowTotal[3], $scope.timetables[i].tue.time);
			$scope.rowTotal[4] =timeCalculation($scope.rowTotal[4], $scope.timetables[i].wed.time);
			$scope.rowTotal[5] =timeCalculation($scope.rowTotal[5], $scope.timetables[i].thu.time);
			$scope.rowTotal[6] =timeCalculation($scope.rowTotal[6], $scope.timetables[i].fri.time);
		}
	};
	
	//to open review box popup.
	$scope.openReviewBox = function(index, reviewDay) {
		$scope.reviewIndex = index;
		$scope.reviewDay = reviewDay;
		$scope.reviewNotes = $scope.timetables[$scope.reviewIndex][$scope.reviewDay].remark;
		$scope.hideReviewPopup = false;
	};
	
	//review popup close method.
	$scope.updateReview = function() {
		$scope.timetables[$scope.reviewIndex][$scope.reviewDay].remark = $scope.reviewNotes;
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
	$scope.remove = function(index){
		console.log(index);
		
		var time = $scope.timetables[index];
		console.log(time);
		if(time.client.id !=0){
			$scope.deletedIDs.push(time);
		}
		$scope.timetables.splice(index, 1);
	};
	$scope.calculateTotalProject = function(){
		return timeCalculation(
				timeCalculation(
					timeCalculation(
					timeCalculation(
						timeCalculation(
							timeCalculation($scope.rowTotal[0], $scope.rowTotal[1])
							,$scope.rowTotal[2])
							,$scope.rowTotal[3])
							,$scope.rowTotal[4])
							,$scope.rowTotal[5])
							,$scope.rowTotal[6]);
	};
	$scope.setTimedate();
	$scope.dayHead();
}]);
