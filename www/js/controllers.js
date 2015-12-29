/**
Copyright 2016 Desyllas Dimitrios - Katerina Mprani - Andreas Xoukas

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

angular.module('starter.controllers', ['ionic','ui.router'])

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
.controller('Menu',function($scope,$state,Game,MenuItem)
{
  var items=MenuItem.items;
  $scope.play=items.play;
  $scope.others=items.others;

  $scope.back=function()
  {
    $state.go("home");
  }
})
/**
*Controller that does all the Dirty Job for the Game
*/
.controller('Game',function($scope,$interval,$state,Game,MenuItem)
{

  /*################### Controller Initialization ####################*/
  var GameItem=Game.item;
  var GameClass=Game.game;
  /*##################### End Controller Initialization ##############*/

  /**
  *Function That does all the dirty job for initialization
  */
  var init_game=function()
  {
    console.log(Game.current_game);
    if(typeof Game.current_game === 'undefined' || Game.current_game === null)
    {
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
                        $state.go('menu');
                      },
                      'afterInit':function(game)
                      {
                        MenuItem.items.play.name_="Continue Game";
                        MenuItem.items.play.clickFunction=function()
                        {
                          console.log("clicked");
                          $state.go('game');
                          Game.current_game.play();//Do not comment unlsess game will not resume
                        };

                        /*Making An Option For saving*/
                        var saveItem=new MenuItem.MenuItem("Save Game",'regular-btn',"",false,function()
                        {
                          game.save();
                        });
                        //Add on the top an Option to save the game
                        MenuItem.items.others.unshift(saveItem);
                      }
                    };

      Game.current_game=new GameClass(items,60,5,10,callbacks);
      Game.current_game.init();
    }
    else // We may need to go to another page and return Therefore we must need a way to resume
    {
      console.log("Here resuming the game");
      Game.current_game.play();
    }
  };


  init_game();

  $scope.pause=function()
  {
    console.log("Pausing Game");
    Game.current_game.pause();
  }
});
