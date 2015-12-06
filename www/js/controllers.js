angular.module('starter.controllers', [])

/**
*Controller for the First Page
*/
.controller('Home',function($scope){})

/**
*Controller for main menu
*/
.controller('Menu',function($scope)
{
  console.log("Menu Called");
  $scope.items=[];
})
/**
*Controller that does all the Dirty Job for the Game
*/
.controller('Game',function($scope,Game)
{

});
