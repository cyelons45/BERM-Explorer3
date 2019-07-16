var highlight;

require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/Graphic",
    "esri/tasks/QueryTask", 
    "esri/tasks/support/Query",

  ], function(Map, MapView, FeatureLayer, GraphicsLayer, Graphic,QueryTask, Query) {
  
  var map = new Map({
    basemap: "satellite"
  });
  
  var view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-118.71511, 34.09042], // longitude, latitude
    zoom: 11,
    highlightOptions: {
      color: [255, 0, 5, 1],
      haloOpacity: 0.9,
      fillOpacity: 0.2
    }
  });

 
  
  var trailheadsLayer = new FeatureLayer({
    url:  "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails_Styled/FeatureServer/0",
    outFields:'*'
  });
  
  map.add(trailheadsLayer);
  // console.log(trailheadsLayer )


// ------------------------------------------------------------------------------------------------------
// HOVER ON FEATURE
  // var activeGraphic;

  // function EmptyGraphic(event) {
  //   return view.hitTest(event).then(function (response) {
  //   //  console.log(response.results.length)
  //     if (response.results.length===0) {
  //       $('#viewDiv').css('cursor','default')
  //       if (highlight) {
  //         highlight.remove();
  //       }
  //     }
 
  //   });
  // }


  // function findNearestGraphic(event) {
  //   return view.hitTest(event).then(function (response) {
  //     var graphic;
  //     // Get the Trail graphics only
  //     if (response.results.length) {
  //       graphic = response.results.filter(function (result) {
  //         return (result.graphic.layer === trailheadsLayer);
  //       })[0].graphic;
  //     }
  //     if (graphic) {
  //       if (!activeGraphic || (activeGraphic.attributes.OBJECTID !== graphic.attributes.OBJECTID)) {
  //         return graphic;
  //       } else {
  //         return null;
  //       }
  //     } else {
  //       return null;
  //     }
  //   });
  // }


  // view.on("pointer-move", function(event){
  //   findNearestGraphic(event).then(function(graphic){
  //     if (graphic) {
  //       activeGraphic = graphic;  
  // $(graphic).ready(function(){
  //  $('#viewDiv').css('cursor','pointer')
  // })
 
  //   view.whenLayerView(graphic.layer).then(function(layerView){          
  //         if (highlight) {
  //           highlight.remove();
  //         }
  //         highlight=layerView.highlight(graphic);
      
  //       })
       
  //     }
  //   });
  // });

  // view.on("pointer-move", function(event){
  //   EmptyGraphic(event)
  
  // });

  // ------------------------------------------------------------------------------------------------------

  // FOR CLICK

  view.on("click", function (event) {

    view.hitTest(event).then(function (response) {
      // console.log(response)
      if (response.results.length) {
        var graphic = response.results.filter(function (result) {
         
          // check if the graphic belongs to the layer of interest
          return result.graphic.layer === trailheadsLayer;
        })[0].graphic;
        console.log('hey')
        view.whenLayerView(graphic.layer).then(function(layerView){
         
          if (highlight) {
            highlight.remove();
          }
          highlight=layerView.highlight(graphic);
          graphicsLayer.removeAll()
      
        })
        console.log(graphic.attributes['OBJECTID']);
        console.log(graphic.attributes['TRL_NAME']);
      }
    });
  });



  var activeGraphic;

  function notOnGraphic(event) {
    return view.hitTest(event).then(function (response) {
    //  console.log(response.results.length)
      if (response.results.length===0) {
        $('#viewDiv').css('cursor','default')
      }
    });
  }


   view.on("pointer-move", function(event){
    notOnGraphic(event)
  
  });

  
  function findNearestGraphic(event) {
    return view.hitTest(event).then(function (response) {
      var graphic;
      // Get the Trail graphics only
      if (response.results.length) {
        graphic = response.results.filter(function (result) {
          return (result.graphic.layer === trailheadsLayer);
        })[0].graphic;
      }
      if (graphic) {
        if (!activeGraphic || (activeGraphic.attributes.OBJECTID !== graphic.attributes.OBJECTID)) {
          return graphic;
        } else {
          return null;
        }
      } else {
        return null;
      }
    });
  }


  view.on("pointer-move", function(event){
    findNearestGraphic(event).then(function(graphic){
      if (graphic) {
        activeGraphic = graphic;  
  $(graphic).ready(function(){
   $('#viewDiv').css('cursor','pointer')
  })
 
      }
    });
  });

  

  // ------------------------------------------------------------------------------------------------------



  
  
  var graphicsLayer = new GraphicsLayer();
  map.add(graphicsLayer);
  
  function addGraphics(result) {
      graphicsLayer.removeAll();
      if (highlight) {
        highlight.remove();
      }
      result.features.forEach(function(feature){
        var g = new Graphic({
          geometry: feature.geometry,
          attributes: feature.attributes,
          symbol: {
           type: "simple-line",
            color: [0, 255, 255],
            outline: {
             width: 9,
             color: [0, 255, 255],
           },
            // size: "20px"
            width: 9,
          },
          popupTemplate: {
           title: "{TRL_NAME}",
          //  content: "This a {PARK_NAME} trail located in {CITY_JUR}."
          }
        });
        graphicsLayer.add(g);
        view.goTo(g)
      });
    }
  
  
    // ------------------------------------------------------------------------------------------------------------------------
    // // var pointUrl = "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails_Styled/FeatureServer/0";
    // var queryTask = new QueryTask({
    //   url: pointUrl 
    // });
    // var sql = "TRL_NAME like '%Canyon%'";
    // var query = new Query();
    // query.returnGeometry = true;
    // query.outFields = ["*"];
    // query.where =sql
    // queryTask.execute(query).then(function(results){
    //   // addGraphics(results)
    //   console.log(results);
  
    // });
  
  // -----------------------------------------------------------------------------------------------------------------
  
  
  
  
  
  
  
  
  
  let t=document.querySelector('.nav').addEventListener('click',function(e){
    let list=e.target.closest('.b-list')
    let down=e.target.closest('.b-down')
    let print=e.target.closest('#print')
    if(list){
      // var pointUrl = "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer/0";
      var pointUrl = "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails_Styled/FeatureServer/0";
    var queryTask = new QueryTask({
      url: pointUrl 
    });
   
    // console.log(queryTask)
    var query = new Query();
    query.returnGeometry = true;
    query.outFields = ["*"];
  
    query.where = `TRL_NAME ='${list.innerHTML}'`;
  
  
    queryTask.execute(query).then(function(results){
      addGraphics(results)
      console.log(results);
    
    
  
   
    });
  
  
  
      console.log(list.innerHTML)
    }else if(down){
      console.log(down.innerHTML)
    }else if(print){
        let chrt=document.getElementById('toggle-chart').classList.toggle('close-chart')
      
        // console.log(chrt)

    }
   
   
  })
  
  
  
  });