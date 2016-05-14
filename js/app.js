var app = angular.module('quizApp', ['quiz.controllers','quiz.services']);

// Custom directive
app.directive('quiz', function(quizFactory,$compile,$timeout) {
	return {
		restrict: 'AEC',
		scope: {
			inputValue: '='
		},
		templateUrl: 'template.html',
		link: function(scope, elem, attrs) {
			var timer;

			scope.getQuestions = quizFactory.getQuestions();
			
			scope.start = function() {
				scope.id = 0;
				scope.quizOver = false;
				scope.inProgress = true;
				scope.checkNull = false;
				scope.getQuestion();

				//Start counter 
				scope.second = 0;
				scope.minute = formatDigi(0);
				scope.hour = formatDigi(0);

				var updateCounter = function() {
					if(scope.second == 60) {
						scope.second = 0;
						scope.minute++;
						scope.minute = formatDigi(scope.minute);
					}
					if(scope.minute == 60 ){
						scope.minute = formatDigi(0);
						scope.hour++;
						scope.hour = formatDigi(scope.hour);	
					}
					scope.second++;
					scope.second = formatDigi(scope.second);
		            timer = $timeout(updateCounter, 1000);
		        };
		        updateCounter();

			};
			
			scope.calcTimer = function() {
				var 
					hours = scope.hour * 3600;
					minutes = scope.minute * 60;
					seconds = scope.second;
					total = 0;
				// if(hours > 0)
				// 	total += hours; 
				// if(minutes > 0)
				// 	total += minutes;
				// total += seconds;

				total = hours + minutes + seconds;
				return formatDigi(total);
			}

			//Format
			function formatDigi(d) {
				return (d < 10) ? '0' + d.toString() : d.toString();
			}

			scope.reset = function() {
				scope.quizOver = false;
				scope.inProgress = false;
				scope.score = 0;

				scope.second = 0;
				scope.minute = 0;
				scope.hour = 0;

			}

			//Stop counter
			scope.stopCounter = function() {
    		    $timeout.cancel(timer);
    		};

			scope.getQuestion = function() {
				var q = quizFactory.getQuestion(scope.id);
				if(q) {
					scope.question = q.question;
					scope.options = q.options;
					scope.answer = q.answer;
					scope.answerMode = true;
				} else {
					scope.quizOver = true;
				}
			};

			scope.checkAnswer = function() {
				if(!$('input[name=answer]:checked').length) {
					scope.checkNull = true;
					return;
				} else {
					//disable all options
					$('input[name=answer]').attr('disabled','disabled');

					var $checkedOpt = $('input[name=answer]:checked'),
					    		ans = $checkedOpt.val();

					if(ans == scope.options[scope.answer]) {
						scope.score++;
						scope.correctAns = true;
					} else {
						scope.correctAns = false;
					}
					scope.answerMode = false;
					scope.checkNull = false;
				}

			};

			scope.nextQuestion = function() {
				scope.id++;
				scope.getQuestion();
				if(scope.quizOver == true ) {
					$timeout.cancel(timer);
				}
			}

			scope.reset();
		}
	}
});

// Filter: Replace item for unique name
app.filter('customKeyFormat',function() {
	return function(input){
		var nameStr = input.replace(" ","");
		return nameStr;
	}
})