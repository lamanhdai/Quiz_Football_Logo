var app = angular.module('quiz.services',[]);

app.factory('quizFactory', function($http) {
	var questions = [];
    return {
      getQuestions: function(){
        return $http.get('js/data/quiz.json').then(function(response){
          questions = response.data.results;
          return questions;
        });
      },
      getQuestion: function(id) {
		if(id < questions.length) {
				return questions[id];
			} else {
				return false;
			}
		}
    };
});