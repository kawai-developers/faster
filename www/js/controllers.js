angular.module('starter.controllers', [])

/**
*Controller for the First Page
*/
.controller('Home',function($scope,Main)
{
  $scope.content=Main.content;
  $scope.buttonText=Main.button;
})

/**
*Controller for main menu
*/
.controller('Menu',function($scope,MenuItem){})
/**
*Controller that does all the Dirty Job for the Game
*/
.controller('Game',function($scope,Game)
{
  console.log("GAme Started");

})
.controller('Pause',function($scope)
{

});
