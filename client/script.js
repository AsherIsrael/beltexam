var myApp = angular.module("myApp", ["ngRoute"]);

myApp.config(function($routeProvider){
   $routeProvider
   .when("/index", {
      templateUrl: "static/partials/landing.html"
   })
   .when("/dashboard", {
      templateUrl: "static/partials/dashboard.html"
   })
   .when("/new_question", {
      templateUrl: "static/partials/question.html"
   })
   .when("/questions/:id", {
      templateUrl: "static/partials/show.html"
   })
   .when("/question/:id/new_answer", {
      templateUrl: "static/partials/answer.html"
   })
   .otherwise({
      redirectTo: "/index"
   })
})

//FACTORIES
myApp.factory("userFactory", function($http){
   var factory = {};
   var currentUser = null;

   factory.login = function(user, callback){
      $http.post("/users", user).then(function(result){
         currentUser = result.data;
         callback(currentUser);
      })
   }
   factory.logout = function(){
      currentUser = null;
   }

   factory.currentUser = function(callback){
      callback(currentUser);
   }

   return factory;
})

myApp.factory("questionFactory", function($http){
   var factory = {};
   var questions = [];

   factory.index = function(callback){
      $http.get("/questions").then(function(results){
         questions = results.data;
         callback(questions);
      })
   }

   factory.create = function(newQuestion, callback){
      $http.post("/questions", newQuestion).then(function(results){
         callback();
      })
   }

   factory.show = function(params, callback){
      $http.get("/questions/"+params.id).then(function(result){
         callback(result.data);
      })
   }

   return factory;
})

myApp.factory("answerFactory", function($http){
   var factory = {};

   factory.create = function(newAnswer, callback){
      $http.post("/answers", newAnswer).then(function(results){
         callback();
      })
   }

   factory.like = function(answer, callback){
      var sendMe = {answer: answer};
      $http.post("/like", sendMe).then(function(results){
         callback();
      })
   }

   return factory;
})


//CONTROLLERS
myApp.controller("usersController", function(userFactory, $location){
   var that = this;

   userFactory.currentUser(function(user){
      if(user){
         userFactory.logout();
      }
   })

   this.login = function(){
      userFactory.login(this.userInfo, function(loggedIn){
         that.userInfo = {};
         $location.url("/dashboard");
      })
   }
})

myApp.controller("dashboardController", function(userFactory, questionFactory, $location){
   var that = this;

   userFactory.currentUser(function(user){
      if(!user){
         $location.url("/index");
      }else{
         that.currentUser = user;
      }
   })

   questionFactory.index(function(questions){
      that.questions = questions;
   })
})

myApp.controller("questionsController", function(userFactory, questionFactory, $location){
   var that = this;

   userFactory.currentUser(function(user){
      if(!user){
         $location.url("/index");
      }else{
         that.currentUser = user;
      }
   })

   this.create = function(){
      // if(!this.newQuestion.description){
      //    this.newQuestion.description = "";
      // }
      questionFactory.create(this.newQuestion, function(){
         that.newQuestion = {};
         $location.url("/dashboard");
      })
   }
})

myApp.controller("answersController", function(userFactory, questionFactory, answerFactory, $routeParams, $location){
   var that = this;

   userFactory.currentUser(function(user){
      if(!user){
         $location.url("/index");
      }else{
         that.currentUser = user;
      }
   })

   questionFactory.show($routeParams, function(question){
      that.displayQuestion = question;
   })

   this.create = function(){
      this.newAnswer.user = this.currentUser.name;
      this.newAnswer.question = $routeParams.id;
      answerFactory.create(this.newAnswer, function(){
         that.newAnswer = {};
         $location.url("/dashboard");
      })
   }

})

myApp.controller("showController", function(userFactory, questionFactory, answerFactory, $routeParams, $location){
   var that = this;

   userFactory.currentUser(function(user){
      if(!user){
         $location.url("/index");
      }else{
         that.currentUser = user;
      }
   })

   questionFactory.show($routeParams, function(question){
      that.displayQuestion = question;
   })

   this.like = function(answer){
      answerFactory.like(answer, function(){
         var idx = that.displayQuestion.answers.map(function(item){return item._id;}).indexOf(answer);
         that.displayQuestion.answers[idx].likes++;
      })
   }

})
