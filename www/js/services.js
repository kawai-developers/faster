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
                    value:[],
                    loopItems:function(callback)
                    {
                      if(typeof callback!=='function') return;

                      for(var i=0;i<game.grid.value.length;i++)
                      {
                        for(var j=0;j<game.grid.value[i].length;j++)
                        {
                          var item=game.grid.value[i][j];
                          callback(item,i,j,this.value);
                        }
                      }
                    }
                  };

        game.callbacks=callbacks;


        /*############# Functions and methods that perfrorm the swap of the elements and have the main gameplay logic #############*/

        /**
        *Function that does the swap of an element
        *@param unique {Stirng} Thye Unique Id of the element
        *@param direction {String} the direction of swap
        */
        game.swapCheck=function(unique,direction)
        {
          var ij=game.swapById(unique,direction);
          var opposite=opposite_direction(direction);

          //var marked=game.check_columns(ij.i,ij.j)
          if(game.checkGrid())
          {
            game.remove_deleted_items();
          }
          else
          {
            game.swap(ij.i,ij.j,opposite);
          }
        }

        /**
        *Check the grid for same rows and columns
        *and mark them as deleted
        */
        game.checkGrid=function()
        {
          var marked=false;
          game.grid.loopItems(function(item,i,j)
          {
            var marked2=game.check(i,j);
            marked=marked||marked2;
          });
          console.log(marked);
          return marked;
        };

        /**
        *Find an Element By the id
        */
        game.findById=function(unique,callback)
        {
          for(var i=0;i<game.grid.value.length;i++)
          {
            for(var j=0;j<game.grid.value[i].length;j++)
            {
              var item=game.grid.value[i][j];
              if(item.uniqueId()===unique)
              {
                if(typeof callback === 'function') callback(i,j,item);
                return {i,j};
              }
            }
          }
        };

        /**
        *Swaps an element that has a unique into a direction
        *@param unique {String} A unique Identifier for the item
        *@param direction {String} The direction of the swap
        *
        *@return {Object} With the i,j of the element found
        */
        game.swapById=function(unique,direction)
        {
          for(var i=0;i<game.grid.value.length;i++)
          {
            for(var j=0;j<game.grid.value[i].length;j++)
            {
              var item=game.grid.value[i][j];
              if(item.uniqueId()===unique)
              {
                game.swap(i,j,direction);
                return {i,j};
              }
            }
          }
        };

        /**
        *@return The opposite direction of that specified
        */
        var opposite_direction=function(direction)
        {
          switch(direction)
          {
            case 'up':
              return 'down';
            case 'down':
              return 'up';
            case 'left':
              return 'right';
            case 'right':
              return 'left';
          }
        }


        /**
        *Function that does the swap of an element
        *@param i {Int} the i position of the element
        *@param j {Int} the j position of the element
        *@param direction {String} the direction of swap
        */
        game.swap=function(i,j,direction)
        {
          switch(direction)
          {
            case 'up':
              if(i!==0) //Cannot swap first line elements
              {
                console.log("Can swap Up");
                swapAction(i,j,i-1,j);
              }
              break;
            case 'down':
              if(i!==game.grid.value.length-1) //cannot swap last line elements
              {
                console.log("Can swap Down");
                swapAction(i,j,i+1,j);
              }
              break;
            case 'left':
              if(j!==0) //Cannot swap first column elements
              {
                console.log("Can swap Left");
                swapAction(i,j,i,j-1);
              }
              break;
            case 'right':
              if(j!==game.grid.value[i].length-1) //Cannot swap last column elements
              {
                console.log("Can swap Right");
                swapAction(i,j,i,j+1);
              }
              break;
          }
        };

        var swapAction=function(i,j,newi,newj)
        {
          var temp=game.grid.value[i][j];
          game.grid.value[i][j]=game.grid.value[newi][newj];
          game.grid.value[newi][newj]=temp;
        }

        game.remove_deleted_items=function()
        {
          game.grid.loopItems(function(item,i,j,values)
          {
            console.log(item.status);
            if(item.status==='destroyed')
            {
              if(i!==0)
              {
                for(var k=i;k>=0;k--)
                {
                  game.swapById(item.uniqueId(),'up')
                }
              }
              game.addScore(1);
              values[0][j]= game.randomItem();//Replace the item with the new one
            }
          });
        }

        /**
        *Check if item i,j has same elements in the same column
        */
        game.check_columns=function(i,j)
        {
          var item=game.grid.value[i][j];
          item.status="marked";

          var checked_columns=[item];//Store the checked items

          //Check elements before
          if(i!==0)
          {
            for(var i1=i;i1>0;i1--)
            {
              var item2=game.grid.value[i1][j]
              if(item.equals(item2))
              {
                item2.status="marked";
                checked_columns.push(item2);
              }
              else
              {
                break;
              }
            }
          }

          /*Check columns*/
          for(var i1=i;i1<game.grid.value.length;i1++)
          {
            var item2=game.grid.value[i1][j]
            if(item.equals(item2))
            {
              item2.status="marked";
              checked_columns.push(item2);
            }
          }
          /*End of: Check columns*/

          return checked_columns;
        }

        /**
        *Check if item i,j has same elements in the same row
        */
        game.check_rows=function(i,j)
        {
          var item=game.grid.value[i][j];
          item.status="marked";

          var checked_rows=[item];//Store the checked items

          /*Check columns*/
          if(j!==0)
          {
            for(var j1=j;j1>=0;j1--)
            {
              var item2=game.grid.value[i][j1];
              if(item.equals(item2))
              {
                item2.status="marked";
                checked_rows.push(item2);
              }
              else
              {
                break;
              }
            }
          }

          for(var j1=j;j1<game.grid.value[i].length;j1++)
          {
            var item2=game.grid.value[i][j1]
            if(item.equals(item2))
            {
              item2.status="marked";
              checked_rows.push(item2);
            }
            else
            {
              break;
            }
          }
          /*End of: Check columns*/

          return checked_rows;
        }


        /**
        *Perform a check if item in i,j position has the same rows & columns
        *@return {array} Wuth the items to delete
        */
        game.check=function(i,j)
        {
          var rows=unique_array(game.check_rows(i,j));
          var columns=unique_array(game.check_columns(i,j));

          var delete_rows=(rows.length>=3);
          rows.forEach(function(item)
          {
            item.status=(delete_rows)?'destroyed':'start';
          });

          var delete_columns=(columns.length>=3);
          columns.forEach(function(item)
          {
            item.status=(delete_columns)?'destroyed':'start';
          });

          console.log(game.grid.value[i][j].uniqueId(),rows,columns,delete_rows,delete_columns);

          var status=delete_columns||delete_rows;

          return status;
        };

        /*########################################################################################################################*/

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
                var randItemIndex=Math.floor(Math.random() * (items.length-2));
                if(typeof game.grid.value[i]=== 'undefined') game.grid.value[i]=[];//Sometimes we get Undefined array
                game.grid.value[i][j]=game.randomItem();//Not sure if I directly set it it will deep copy the object\

                /*Each time remove athe selected item and put it on the back*/
                // var item=items[randItemIndex];
                // items=items.filter(function(i)
                // {
                //   	return !i.equals(item);
                // });
                //
                // items.push(item);
                /*End of: "Each time remove athe selected item and put it on the back"*/
              }
            }
          }
          console.log(game.grid);
          /*End of: "Generate grid randomly"*/

          if(typeof game.callbacks === 'object' && typeof game.callbacks['afterInit'] === 'function') game.callbacks['afterInit'](game);
          game.play();
        }

        /**
        * Creates a random Item
        *
        * @param item {Object} If item specified it is moved to the end.
        *                      Otherwise is moved the random item to the end
        *
        * @return {Object} with the random item
        */
        game.randomItem=function(item)
        {
          var randItemIndex=Math.floor(Math.random() * (items.length-2));

          var new_item=items[randItemIndex];

          if(!item) item=new_item;

          items=items.filter(function(i)
          {
              return !i.equals(item);
          });

          items.push(item);

          return new_item.clone();
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
      *@param icon_destroyed {String} Icon when The Item is Destroyed (it can be either html or image path)
      *@param icon_marked {String} Icon when The Item is Maked dfor checking (it can be either html or image path)
      *@param unique {Int} A Unique number that determines the element
      */
      function GameItem(icon,icon_destroyed,icon_marked,name,unique)
      {
        var item=this;

        item.icon=icon;//Icon for the normal situations
        item.icon_destroyed=icon_destroyed;//Icon if the item is Destroyed
        item.icon_marked=icon_marked;//Icon when the item is selected

        item.unique=(unique)?unique:0;//A unique number for new items

        /*
        *A Characteristic name of the itemYourFactory
        *It can Be used for comparisons ;)
        */
        item.name=name;

        /**
        *For now takes 2 values:
        *start if the Item is not destroyed
        *marked if on swap tha item was marked for deletion
        *destroyed if the item in destroyed
        *whatever else for status you want
        */
        item.status="start";

        /**
        *The position of the Item
        *Check if you need it
        */
        item.posistion_checked={i:0,j:0};

        /**
        *Generate a specific uniqueId string that makes it recognizable
        */
        item.uniqueId=function()
        {
          return item.name+item.unique;
        }

        /**
        *Clone the Object (used for Initialization)
        */
        item.clone=function()
        {
           var newClone=new GameItem(item.icon,item.icon_destroyed,item.icon_marked,item.name,item.unique);
           item.unique++;//After a clone refresh the unique number in order the next clones to have new name
           return newClone;
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
