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

var module=angular.module('starter.services', ['ionic', 'ui.router']);
module.factory('Game', function($interval)
{
      /**
      *Class we need for the game
      *@param items {Array} with the items the game consisted of
      *@param time {Int} How many seconds tis the duration of game
      *@param grid_width How many Items each row will have
      *@param grid_height How many items the grid will have vertically
      */
      function Game(items,time,grid_width,grid_height,callbacks)
      {
        var game=this;

        //The total Items The game is consisted of
        game.items=items;

        //The grid of the items that will be swapped
        game.grid={
                    value:[]
                  };

        game.callbacks=callbacks;


        /**
        *Function that performs the logic
        *and does the comparisons between Items
        */
        game.swap=function()
        {

        };

        /**
        *Method that Initialises and starts the game
        *Why I used this function and not game.start()
        *is because this way the code for initializing the grid is saparate from the code that initialises the clock
        */
        game.init=function()
        {
          game.timer.value=time;
          points.value=0;

          /*Generate grid randomly*/
          if(angular.isArray(items)) //check if array
          {
            for(i=0;i<grid_width;i++)
            {
              for(j=0;j<grid_height;j++)
              {
                var randItemIndex=Math.floor(Math.random() * (items.length-1));

                if(typeof game.grid.value[i]=== 'undefined') game.grid.value[i]=[];//Sometimes we get Undefined array

                game.grid.value[i][j]=items[randItemIndex].clone();//Not sure if I directly set it it will deep copy the object
                game.grid.value[i][j].posistion={x:i,y:j};//Perhaps may need to depricate
              }
            }
          }
          console.log(game.grid);
          /*End of: "Generate grid randomly"*/

          if(typeof game.callbacks === 'object' && typeof game.callbacks['afterInit'] === 'function') game.callbacks['afterInit'](game);
          game.play();
        }

        /*####################### Starting a pausing and overing the game #############*/
        /**
        *The Game has the Foillowing Status
        *'uninitialised': When the game has Not Been Started yet
        *'play': When gameplay is on progress
        *'paused': When the game is paused
        *'over': When Game Over
        */
        game.status='uninitialised';


        /**
        *We inplemented timer like that because
        *this its the only way to get the timer update
        *Into the Controller
        */
        game.timer= {
                      value: time
                     };

        var started=false;
        /**
        *Function that starts the timer
        */
        var startTimer=function()
        {
          if(game.timer.value>0 && !started)
          {
            started=true;
            //Better to Use Angular's Interval
            interval=$interval(function()
            {
              if(game.status==='play')
              {
                game.timer.value--;
                console.log(game.timer.value);

                if(game.timer.value==0) game.over();
              }
            },1000);
          }
        }

        /**
        *Function that stops the timer
        */
        var stopTimer=function()
        {
          if(interval!==null) $interval.cancel(interval);
        }


        /**
        *The Interval of the setInterval();
        */
        var interval=null;

        /**
        *Method that Pauses the game
        *Enter here code that tell what will be executed when the game is paused
        */
        game.pause=function()
        {
          game.status='paused';
          if(typeof game.callbacks === 'object' && typeof game.callbacks['pause'] === 'function') game.callbacks['pause'](game.timer);
          //stopTimer();
        }


        /**
        *Method that starts the game
        *Enter code here to be executer when the game is started
        */
        game.play=function()
        {
          console.log("Game Started");
          game.status='play';

          //Start the counter
          startTimer();
        }

        /**
        *Method that ends the game
        *Enter code here to be executer when the game is ended
        */
        game.over=function()
        {
          game.status='over';
          if(interval!==null) $interval.cancel(interval);
          if(typeof game.callbacks === 'object' && typeof game.callbacks['over'] === 'function') game.callbacks['over']();
        }

        game.isOver=function()
        {
          return game.status==='over';
        }

        game.isPaused=function()
        {
          return game.status==='paused';
        }

        game.isNotPausedOrOver=function()
        {
          return game.status==='play';
        }
        /*##############################################################################*/

        /*######################### For Scoring system #######################*/
        var points={value:0};

        game.addScore=function(points)
        {
          points.value+=points;
        }

        game.removeScore=function(points)
        {
          points.value-=points;
        }

        game.getScore=function()
        {
          return points;
        }
        /*#####################################################################*/

        /*########### Functions for Game Saving and Loading ###################*/
        game.save=function()
        {
          console.log("Game Saving");
          //Code for game saving
        }

        game.load=function()
        {
          //Code for game loading
        }
        /*########### End of Functions ddor Game saving and Loading ###########*/

      };//End Of Game Class

      /**
      *Function we need for the Game Item
      *@param icon {String} Normal Icon For the Item (it can be either html or image path)
      *@param icon_destroyed {String} Icon when The Game is Destroyed (it can be either html or image path)
      *@param icon_marked {String}
      */
      function GameItem(icon,icon_destroyed,icon_marked,name)
      {
        var item=this;

        item.icon=icon;//Icon for the normal situations
        item.icon_destroyed=icon_destroyed;//Icon if the item is Destroyed
        item.icon_marked=icon_marked;//Icon when the item is selected

        /*
        *A Characteristic name of the itemYourFactory
        *It can Be used for comparisons ;)
        */
        item.name=name;

        /**
        *For now takes 2 values:
        *start if the Item is not destroyed
        *destroyed if the item in destroyed
        *whatever dtatus you want
        */
        item.status="start";

        /**
        *The position of the Item
        *Check if you need it
        */
        item.posistion={x:0,y:0};

        /**
        *Clone the Object (used for Initialization)
        */
        item.clone=function()
        {
          return new GameItem(item.icon,item.icon_destroyed,item.icon_marked,item.name)
        }

        /**
        *Check if this item is equal with another one
        */
        item.equals=function(other)
        {
          return other.name===item.name;
        };

        /**
        *Gets The icon regarding the status of the Item is
        */
        item.getIcon=function()
        {
          var icon="";
          //Add here the status of the
          switch(item.status)
          {
            case 'destroyed':
              icon=item.icon_destroyed;
            break;

            case 'start':
              icon=item.icon;
            break;

            default:
              icon=item.icon;
          }
          return icon;
        }
      };//End of Item Class

      return {
              game:Game,
              item:GameItem,
              current_game:null
             };
});

/**
*Content for main Page
*In order to avoid it from setting it into Html content
*/
module.factory('Main',function()
{
  return {
           content:"Can YOU arrive at your destination fast enough by choosing the best means of tranport?\nPrepare for the fastest and most exciting riddle game that will keep you company on your every outing!",
           button:"continue",
          };
});

/**
*Data For Main Menu
*/
module.factory('MenuItem',function($state)
{
    /**
    *Class for menu Item
    *@param text {String} Text for the menu item
    *@param class_ {String} CSS class for the item
    *@param icon {String} Path for button Icon
    *@param font {Boolean} Whether the icon will be a webfont or not
    *@param clickFunction {Function} Of What to Be called when the Button Is Clicked
    */
   function MenuItem(name,class_,icon,icon_font,clickFunction)
   {
     console.log("Item Made");
      var item=this;
      item.name_=name;
      item.class=class_;
      item.icon_font=icon_font;

      //Generate the html to show the image
      if(!icon_font) icon="<img src=\""+icon+"\">"

      item.icon=icon;
      item.clickFunction=clickFunction;
   };

   var items={
                'play': new MenuItem('Play','play-btn',"<i class=\"fa fa-play\"></i>",true,function()
                {
                  $state.go('game');
                }),
                'others':[],
             };


   return {
            'MenuItem':MenuItem,
            'items':items
          };
})
