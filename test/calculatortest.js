var launch = require(__dirname + '/../examples/launch');


suite('launch', function() {
  var client, subject;

  setup(function() {

  });

  test('#launchtest', function() {
    
    var Apps = require(__dirname + '/../index'),
    BootWatcher = require(__dirname + '/../lib/bootwatcher'),
    Host = require('marionette-host-environment'),
    Marionette = require('marionette-client'),
    path = require('path');

    var calc_path = path.resolve(__dirname, '../b2g/Contents/MacOS/calculator/app/');
    /**
     * Options to setup our b2g instance with.
     * @type {Object}
     */
    var OPTIONS = {
      settings: {
        'ftu.manifestURL': null,
        'lockscreen.enabled': false
      },
      packagedApps: {
        'calculator.gaiamobile.org': calc_path
      }
    };


    /**
     * File path to B2G.
     * @const {string}
     */
    var B2G_PATH = path.resolve(__dirname, '../b2g');


    /**
     * Origin URL for the calendar app.
     * @const {string}
     */
    var CALENDAR_URL = 'app://calculator.gaiamobile.org';

    Host.spawn(B2G_PATH, OPTIONS, function(err, port, childProcess) {
      
      if (process.env.DEBUG) {
        childProcess.stdout.pipe(process.stdout);
      }

      // Connect to the marionette server.
      var driver = new Marionette.Drivers.Tcp({ port: port });
      driver.connect(function() {
        // Wrap the marionette connection with a client that we can pass
        // to our plugin.
        var client = new Marionette.Client(driver);

        // Make a bootwatcher to tell us when we're done booting.
        BootWatcher.setup(client, function(err, bootwatcher) {
          function onBoot(evt) {
            bootwatcher.removeListener(BootWatcher.EventType.BOOT, onBoot);
            //demo(client, childProcess);
            Apps.setup(client, function(err, apps) {
              // Ask for all of the apps.
              var req = apps.mgmt.getAll();
              req.onsuccess = function(evt) {
                // Prove that we got them by logging them!
                evt.target.result.forEach(function(app) {
                  console.log(app.origin);

                  // If this is the calendar app, try launching it!
                  if (app.origin === CALENDAR_URL) {
                    app.launch();
                    
                    client.findElements('iframe[mozapp]', function(err, element) {
                      
                       if (err) {
                        console.log('error',err);
                         // handle case where element was not found
                       }
                       console.log('element',element.length);
                       for (var i = 0 ; i < element.length ; i++) {
                        
                        element[i].getAttribute('src',function(err,param){
                          
                          if (param.indexOf(CALENDAR_URL)!=-1)  {
                            client.switchToFrame(this,function(err,param){
                              client.findElements('input',function(err,element){
                                assert.equal(element.length,18);
                                 for (var i = 0 ; i < element.length ; i++ ) {
                                    element[i].getAttribute('value',function(err,val){
                                      if (val === '1')  {
                                        
                                        this.click(function(){
                                            
                                        });
                                        client.findElement('#display', function(err, element) {
                                            element.findElement('b',function(err,param){
                                              param.getAttribute('innerHTML',function(err,param){
                                                
                                                assert.equal(param,'1');
                                                client.findElements('input',function(err,element){
                                                  for (var i = 0 ; i < element.length ; i++ ) {
                                                    element[i].getAttribute('value',function(err,val){
                                                      if (val === '+')  {
                                                        this.click(function(){
                                            
                                                        });
                                                        client.findElement('#display', function(err, element) {
                                                          element.findElement('b',function(err,param){
                                                            param.getAttribute('innerHTML',function(err,param){
                                                              assert.equal(param,'1');
                                                              client.findElements('input',function(err,element){
                                                                for (var i = 0 ; i < element.length ; i++ ) {
                                                                  element[i].getAttribute('value',function(err,val){
                                                                    if (val === '1')  {
                                                                      this.click(function(){
                                                          
                                                                      });
                                                                      client.findElement('#display', function(err, element) {
                                                                        element.findElement('b',function(err,param){
                                                                          param.getAttribute('innerHTML',function(err,param){
                                                                            assert.equal(param,'1');
                                                                            client.findElements('input',function(err,element){
                                                                              for (var i = 0 ; i < element.length ; i++ ) {
                                                                                element[i].getAttribute('value',function(err,val){
                                                                                  if (val === '=')  {
                                                                                    this.click(function(){
                                                                        
                                                                                    });
                                                                                    client.findElement('#display', function(err, element) {
                                                                                      element.findElement('b',function(err,param){
                                                                                        param.getAttribute('innerHTML',function(err,param){
                                                                                          assert.equal(param,'2');
                                                                                        });
                                                                                      });
                                                                                    });
                                                                                  }
                                                                                }.bind(element[i]));
                                                                              }
                                                                            });
                                                                          });
                                                                        });
                                                                      });
                                                                    }
                                                                  }.bind(element[i]));
                                                                }
                                                              });
                                                            });
                                                          });
                                                        });
                                                      }
                                                    }.bind(element[i]));
                                                  }
                                                });

                                              });
                                            });
                                          });
                                      }      
                                    }.bind(element[i]));
                                 }
                              });
                            });
                          }
                        }.bind(element[i]));
                       }
                    });
                  }
                });
              };
            });
          }

          bootwatcher.addListener(BootWatcher.EventType.BOOT, onBoot);
          client.startSession(function() {
            bootwatcher.start();
          });
        });
      });
    });
  });
});