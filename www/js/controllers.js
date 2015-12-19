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
.controller('Game',function($scope,$interval,Game)
{
  console.log("Entered Game");
  console.log(Game.current_game);

  var GameItem=Game.item;
  var GameClass=Game.game;

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
                    console.log(time);
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
    console.log("Pauseing Game");
    Game.current_game.pause();
  }

  $scope.continue=function()
  {
    Game.current_game.play();
  }

})
.controller('Pause',function($scope)
{

});
