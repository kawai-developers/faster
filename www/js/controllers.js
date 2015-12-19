angular.module('starter.controllers', ['ionic'])

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
.controller('Game',function($scope,$interval,$ionicModal,Game)
{

  /*################### Controller Initialization ####################*/
  var GameItem=Game.item;
  var GameClass=Game.game;

  $ionicModal.fromTemplateUrl('modals/pausedGame-modal.html',{
     scope:$scope,
     animation: 'slide-in-up'
  })
  .then(function(modal)
  {
      console.log("Init Modal");
      $scope.pauseMenu = modal;
  });
  /*##################### End Controller Initialization ##############*/

  /**
  *Items for the Game
  */
  var items=[
              new GameItem('./img/icon1.png','./img/icon1.png','./img/icon1.png','trolley'),
              new GameItem('./img/icon2.png','./img/icon2.png','./img/icon2.png','metro'),
              new GameItem('./img/icon3.png','./img/icon3.png','./img/icon3.png','bus'),
              new GameItem('./img/icon4.png','./img/icon4.png','./img/icon4.png','tram'),
            ];

  /**
  *Callbacks for Game
  */
  var callbacks={
                  'timerUpdate':function(time)
                  {
                    $interval(function(){$scope.time=time;});
                  },
                  'pause':function(time)
                  {
                    console.log("Game Paused");
                  }
                };

  if(typeof Game.current_game === 'undefined' || Game.current_game === null)
  {
    console.log("Making the Game");
    Game.current_game=new GameClass(items,60,5,10,callbacks);
    Game.current_game.init();
  }

  $scope.pause=function()
  {
    console.log("Pausing Game");
    Game.current_game.pause();
    $scope.pauseMenu.show();
  }

  $scope.continue=function()
  {
    Game.current_game.play();
    $scope.pauseMenu.hide();
  }

  $scope.$on('$destroy', function()
  {
    $scope.modal.remove();
  });
});
