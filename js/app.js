var app = angular.module('quizApp', ['quiz.controllers','quiz.services']);


// Custom directive
app.directive('quiz', function(quizFactory) {
	return {
		restrict: 'AE',
		scope: {
			inputValue: '='
		},
		templateUrl: 'template.html',
		 // bindToController: true,
	  //    controllerAs: 'ctrl',
	  //    controller: function(){
	  //        this.getClass(){
	  //          return (ctrl.inputValue === 'something' ? "myButton1" : "myButton2");
	  //        }
	  //    },
		link: function(scope, elem, attrs) {
			scope.getQuestions = quizFactory.getQuestions();
			scope.ClassName = "test";

			scope.start = function() {
				scope.id = 0;
				scope.quizOver = false;
				scope.inProgress = true;
				scope.checkNull = false;
				scope.getQuestion();
			};

			scope.reset = function() {
				scope.quizOver = false;
				scope.inProgress = false;
				scope.score = 0;
			}

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
			}

			scope.reset();
		}
	}
});

// Filter: Replace item for unique name
app.filter('customKeyFormat',function(){
	return function(input){
		var nameStr = input.replace(" ","");
		return nameStr;
	}
})