var module=angular.module('starter.services', []);
module.factory('Game', function()
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
        game.grid=[];

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

          //Possibly may needed to call
          //game.start();
        }

        /*####################### Starting apausing and overing the game #############*/
        /**
        *The Game has the Foillowing Status
        *'uninitialised': When the game has Not Been Started yet
        *'play': When gameplay is on progress
        *'paused': When the game is paused
        *'over': When Game Over
        */
        game.status='uninitialised';
        game.timer=time;

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
        }

        /**
        *Method that starts the game
        *Enter code here to be executer when the game is started
        */
        game.start=function()
        {
          game.status='play';

          //Start the counter
          if(typeof interval !== 'undefined' && interval!==null)
          {
            interval=setInterval(function()
            {
              if(game.status==='play')
              {
                game.timer--;
                if(game.timer==0) game.over();
                if(typeof callbacks === 'object' && typeof callbacks['timerUpdate'] === 'function') callbacks['timerUpdate'](game.timer);
              }
            },100000);
          }
        }

        /**
        *Method that ends the game
        *Enter code here to be executer when the game is ended
        */
        game.over=function()
        {
          game.status='over';
          if(interval!==null) clearInterval(interval);
        }

        game.isOver=function()
        {
          return game.status==='over';
        }

        game.isPaused=function()
        {
          return game.status==='over';
        }

        game.isNotPausedOrOver=function()
        {
          return game.status==='play';
        }
        /*##############################################################################*/

        /*######################### For Scoring system #######################*/
        game.points=0;

        game.addScore=function(points)
        {
          game.points+=points;
        }

        game.removeScore=function(points)
        {
          game.points-=points;
        }
        /*#####################################################################*/

      };//End Of Game Class

      /**
      *Function we need for the Game Item
      */
      function GameItem(icon,icon_destroyed,icon_marked,name)
      {
        var item=this;

        item.icon=icon;//Icon for the normal situations

        item.icon_destroyed=icon_destroyed//Icon if the item is Destroyed

        /*
        *A Characteristic name of the item
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
              cunnent_game:null
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

module.factory('MenuItem',function()
{
    /**
    *Class for menu Item
    *@param text {String} Text for the menu item
    *@param class_ {String} CSS class for the item
    *@param icon {String} Path for button Icon
    *@param font {Boolean} Whether the icon will be a webfont or not
    */
   function MenuItem(text,class_,icon,icon_font)
   {
      var item=this;
      item.name=name;
      item.class=class_;
      item.icon=icon;
      item.icon_font=icon_font;
   };

   return MenuItem;
})
