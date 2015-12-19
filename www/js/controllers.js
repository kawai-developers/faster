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
                    $scope.time=time;
                  }
                };

  Game.cunnent_game=new GameClass(items,60,5,10,callbacks);
})
.controller('Pause',function($scope)
{

});
