var app = angular.module('quizApp', ['quiz.controllers','quiz.services']);

app.directive('quiz', function(quizFactory) {
	return {
		restrict: 'AE',
		scope: {},
		templateUrl: 'template.html',
		link: function(scope, elem, attrs) {
			scope.getQuestions = quizFactory.getQuestions();
			scope.start = function() {
				scope.id = 0;
				scope.quizOver = false;
				scope.inProgress = true;
				scope.checkNull = false;
				scope.getQuestion();
			};

			scope.reset = function() {
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
					var ans = $('input[name=answer]:checked').val();

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

app.filter('customKeyFormat',function(){
	return function(input){
		var nameStr = input.replace(" ","");
		return nameStr;
	}
})