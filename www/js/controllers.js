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

  console.log($scope.others);

  $scope.back=function()
  {
    $state.go("home");
  }
})
/**
*Controller that does all the Dirty Job for the Game
*/
.controller('Game',function($scope,$state,$ionicModal,Game,MenuItem)
{

  /*###################### Modal Area ######################*/
  $ionicModal.fromTemplateUrl('gameOverModal.html',
  {
    scope: $scope,
    animation: 'slide-in-up'
  })
  .then(function(modal)
  {
    $scope.gameOverModal = modal;
  });

  $scope.$on('$destroy', function()
  {
    $scope.gameOverModal.remove();
  });

  $scope.closeGameOverModal=function()
  {
    $scope.gameOverModal.hide();
    $state.go("menu");
  }
  /*###############################################################*/

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
                  new GameItem('img/icon1.jpg','img/icon1.jpg','img/icon1.jpg','trolley'),
                  new GameItem('img/icon2.jpg','img/icon2.jpg','img/icon2.jpg','metro'),
                  new GameItem('img/icon3.jpg','img/icon3.jpg','img/icon3.jpg','bus'),
                  new GameItem('img/icon4.jpg','img/icon4.jpg','img/icon4.jpg','tram'),
                ];

      /**
      *Callbacks for Game
      */
      var callbacks={
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
                        console.log(MenuItem.items.others);
                      },
                      'over':function()
                      {
                        ionic.EventController.trigger('gameOver',{});
                      }
                    };

      Game.current_game=new GameClass(items,60,5,5,callbacks,$scope);
      Game.current_game.init();
    }
    else // We may need to go to another page and return Therefore we must need a way to resume
    {
      console.log("Here resuming the game");
      Game.current_game.play();
    }
    $scope.timer = Game.current_game.timer;
    $scope.points=Game.current_game.getScore();
    $scope.grid=Game.current_game.grid;

    /*Functions that do all the swipe*/
    $scope.swipeup=function(unique)
    {
      Game.current_game.swapCheck(unique,'up');
    };

    $scope.swipeDown=function(unique)
    {
      Game.current_game.swapCheck(unique,'down');
    };

    $scope.swipeLeft=function(unique)
    {
      Game.current_game.swapCheck(unique,'left');
    };

    $scope.swipeRight=function(unique)
    {
      Game.current_game.swapCheck(unique,'right');
    };
    /*End of: "Functions that do all the swap"*/
  };

  ionic.EventController.on('gameOver',function()
  {
    console.log("GameOver Event");

    MenuItem.items.play.name_="New Game";
    MenuItem.items.others.shift();
    Game.current_game=null;
    $scope.gameOverModal.show();
  });

  init_game();

  $scope.pause=function()
  {
    console.log("Pausing Game");
    Game.current_game.pause();

  }
});
