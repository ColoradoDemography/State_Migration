require([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/smartMapping/renderers/color",
        "esri/smartMapping/statistics/histogram",
        "esri/widgets/smartMapping/ClassedColorSlider",
        "esri/widgets/Legend",
        "esri/core/watchUtils",
        "esri/renderers/support/ClassBreakInfo",
        "esri/Basemap",
        "esri/layers/VectorTileLayer",
        "esri/widgets/Print",
        "esri/widgets/Expand"
      ], function (
        Map,
        MapView,
        FeatureLayer,
        colorRendererCreator,
        histogram,
        ClassedColorSlider,
        Legend,
        watchUtils,
        ClassBreakInfo,
        Basemap,
        VectorTileLayer,
        Print,
        Expand
      ) {
    
    let fieldSelect, classSelect, numClassesInput, slider;

    var popupMigration = {
        title: "<b>2021 ACS Migration between Colorado and {NAME}</b>",
        content: "{ACSNet21} Net Migrants<br>"+
          "{ACSFr21} Migrants to Colorado<br>"+
          "{ACSTo21} Migrants from Colorado",
          
        fieldInfos: [
          {
            fieldName: "ACSNet21",
            format: {digitSeparator: true, places: 0}
          },
          {  
            fieldName: "ACSFr21",
            format: {digitSeparator: true, places: 0}
          },
          {
            fieldName: "ACSTo21",
            format: {digitSeparator: true, places: 0}
          },
          {
            fieldName: "ACSNet19",
            format: {digitSeparator: true, places: 0}
          },
          {  
            fieldName: "ACSFr19",
            format: {digitSeparator: true, places: 0}
          },
          {
            fieldName: "ACSTo19",
            format: {digitSeparator: true, places: 0}
          },
          {
            fieldName: "IndNet21",
            format: {digitSeparator: true, places: 0}
          },
          {  
            fieldName: "IndFr21",
            format: {digitSeparator: true, places: 0}
          },
          {
            fieldName: "IndTo21",
            format: {digitSeparator: true, places: 0}
          },
          {
            fieldName: "IndNet20",
            format: {digitSeparator: true, places: 0}
          },
          {  
            fieldName: "IndFr20",
            format: {digitSeparator: true, places: 0}
          },
          {
            fieldName: "IndTo20",
            format: {digitSeparator: true, places: 0}
          },
          {
            fieldName: "IndNet19",
            format: {digitSeparator: true, places: 0}
          },
          {  
            fieldName: "IndFr19",
            format: {digitSeparator: true, places: 0}
          },
          {
            fieldName: "IndTo19",
            format: {digitSeparator: true, places: 0}
          },
          {
            fieldName: "RetNet21",
            format: {digitSeparator: true, places: 0}
          },
          {  
            fieldName: "RetFr21",
            format: {digitSeparator: true, places: 0}
          },
          {
            fieldName: "RetTo21",
            format: {digitSeparator: true, places: 0}
          },
          {
            fieldName: "RetNet20",
            format: {digitSeparator: true, places: 0}
          },
          {  
            fieldName: "RetFr20",
            format: {digitSeparator: true, places: 0}
          },
          {
            fieldName: "RetTo20",
            format: {digitSeparator: true, places: 0}
          },
          {
            fieldName: "RetNet19",
            format: {digitSeparator: true, places: 0}
          },
          {  
            fieldName: "RetFr19",
            format: {digitSeparator: true, places: 0}
          },
          {
            fieldName: "RetTo19",
            format: {digitSeparator: true, places: 0}
          },
          {
            fieldName: "AIGNet21",
            format: {digitSeparator: true, places: 0}
          },
          {  
            fieldName: "AIGFr21",
            format: {digitSeparator: true, places: 0}
          },
          {
            fieldName: "AIGTo21",
            format: {digitSeparator: true, places: 0}
          },
          {
            fieldName: "AIGNet20",
            format: {digitSeparator: true, places: 0}
          },
          {  
            fieldName: "AIGFr20",
            format: {digitSeparator: true, places: 0}
          },
          {
            fieldName: "AIGTo20",
            format: {digitSeparator: true, places: 0}
          },
          {
            fieldName: "AIGNet19",
            format: {digitSeparator: true, places: 0}
          },
          {  
            fieldName: "AIGFr19",
            format: {digitSeparator: true, places: 0}
          },
          {
            fieldName: "AIGTo19",
            format: {digitSeparator: true, places: 0}
          },
        ]
    };
        
    const labelClass = {
      // autocasts as new LabelClass()
      symbol: {
        type: "text",  // autocasts as new TextSymbol()
        color: "black",
        font: {  // autocast as new Font()
          family: "Playfair Display",
          size: 8,
          weight: "bold"
        },
        haloColor: [255, 255, 255, 255],
        haloSize: 1
      },
      labelPlacement: "above-center",
      labelExpressionInfo: {
        expression: "$feature.NAME"
      }
    };
    
    var layer = new FeatureLayer({
        title: "State to State Migration",
        url: "https://services.arcgis.com/IamIM3RJ5xHykalK/arcgis/rest/services/State_Migration_Multiple/FeatureServer/0",
        popupTemplate: popupMigration,
        labelingInfo: [labelClass]
    });
    
    var basemap = new Basemap({
        baseLayers: [
            new VectorTileLayer({
                portalItem: {
                    id: "3137a21172d841d0b9cb1383a407662c"
                },
                opacity: .1
            })
        ]
    })
    
    var map = new Map({
      basemap:basemap
    });

    var view = new MapView({
      container: "viewDiv",
      map: map,
      center: [-97.55, 37], // longitude, latitude
      zoom: 3
    });
    
    view.ui.move("zoom", "bottom-left");
    
    var legend = new Legend({
        view: view
    })
    
    var expand1 = new Expand({
      view: view,
      content: legend,
      expandIconClass: "esri-icon-documentation",
      expandTooltip: "Legend"
    });
    
    var print = new Print({
        view: view,
        // specify your own print service
        printServiceUrl:
          "https://dola-online.maps.arcgis.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
      });
    
     /* var expand2 = new Expand({
        view: view,
        content: print,
        expandIconClass: "esri-icon-printer",
        expandTooltip: "Print"
    }) 
    
    view.ui.add([expand2], "bottom-right"); */
    
    /*view.ui.add(
          new Legend({
            view: view
          }),
          "bottom-left"
    );*/
    
              
    /*view.when(function () {
          var print = new Print({
            view: view,
            // specify your own print service
            printServiceUrl:
              "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
          });

          // Add widget to the top right corner of the view
          view.ui.add(print, "top-right");
        });
*/
    view.ui.add("infoDiv", "top-right");view.ui.add([expand1], "top-right");

        // Generate a new renderer each time the user changes an input parameter
        view.when().then(function () {
          fieldSelect = document.getElementById("field-select");
          fieldSelect.addEventListener("change", generateRenderer);

          classSelect = document.getElementById("class-select");
          classSelect.addEventListener("change", generateRenderer);

          //numClassesInput = document.getElementById("num-classes");
          //numClassesInput.addEventListener("change", generateRenderer);

          watchUtils.whenFalseOnce(view, "updating", generateRenderer);
        });

        // Generate rounded arcade expression when user
        // selects a field name
        function getValueExpression(field) {
          return (
            "Round( ( $feature." + field + " / 1 ), 1)"
          );
        }

        function generateRenderer() { 
          let fieldLabel = fieldSelect.options[fieldSelect.selectedIndex].text;
          if (fieldSelect.value == "AIGNet21"||fieldSelect.value == "AIGFr21"||fieldSelect.value == "AIGTo21"||
          fieldSelect.value == "AIGNet20"||fieldSelect.value == "AIGFr20"||fieldSelect.value == "AIGTo20"||
          fieldSelect.value == "AIGNet19"||fieldSelect.value == "AIGFr19"||fieldSelect.value == "AIGTo19"){
            fieldLabel = fieldLabel + " (in thousands of dollars)";
          }
          // custom popup depending on migration flow
          console.log(fieldSelect.value);
          if (fieldSelect.value == "ACSNet21"||fieldSelect.value == "ACSFr21"||fieldSelect.value == "ACSTo21"){console.log("ACS");
            layer.popupTemplate.title = "<b>2021 ACS Migration between Colorado and {NAME}</b>";
            layer.popupTemplate.content = 
            "{ACSNet21} Net Migrants<br>"+
            "{ACSFr21} Migrants to Colorado<br>"+
            "{ACSTo21} Migrants from Colorado";
          } else if (fieldSelect.value == "ACSNet19"||fieldSelect.value == "ACSFr19"||fieldSelect.value == "ACSTo19"){console.log("ACS");
            layer.popupTemplate.title = "<b>2019 ACS Migration between Colorado and {NAME}</b>";  
            layer.popupTemplate.content = "{ACSNet19} Net Migrants<br>"+
            "{ACSFr19} Migrants to Colorado<br>"+
            "{ACSTo19} Migrants from Colorado";
          } else if (fieldSelect.value == "IndNet21"||fieldSelect.value == "IndFr21"||fieldSelect.value == "IndTo21"){console.log("IRS");
          layer.popupTemplate.title = "<b>2021 IRS Individual Migration between Colorado and {NAME}</b>";  
          layer.popupTemplate.content = "{IndNet21} Net Migrants<br>"+
            "{IndFr21} Migrants to Colorado<br>"+
            "{IndTo21} Migrants from Colorado";
          } else if (fieldSelect.value == "IndNet20"||fieldSelect.value == "IndFr20"||fieldSelect.value == "IndTo20"){console.log("IRS");
          layer.popupTemplate.title = "<b>2020 Individual IRS Migration between Colorado and {NAME}</b>";  
          layer.popupTemplate.content = "{IndNet20} Net Migrants<br>"+
            "{IndFr20} Migrants to Colorado<br>"+
            "{IndTo20} Migrants from Colorado";
          } else if (fieldSelect.value == "IndNet19"||fieldSelect.value == "IndFr19"||fieldSelect.value == "IndTo19"){console.log("IRS");
          layer.popupTemplate.title = "<b>2019 IRS Individual Migration between Colorado and {NAME}</b>";  
          layer.popupTemplate.content = "{IndNet19} Net Migrants<br>"+
            "{IndFr19} Migrants to Colorado<br>"+
            "{IndTo19} Migrants from Colorado";
          } else if (fieldSelect.value == "RetNet21"||fieldSelect.value == "RetFr21"||fieldSelect.value == "RetTo21"){console.log("IRS");
          layer.popupTemplate.title = "<b>2021 IRS Household Migration between Colorado and {NAME}</b>";  
          layer.popupTemplate.content = "{RetNet21} Net Households<br>"+
            "{RetFr21} Households to Colorado<br>"+
            "{RetTo21} Households from Colorado";
          } else if (fieldSelect.value == "RetNet20"||fieldSelect.value == "RetFr20"||fieldSelect.value == "RetTo20"){console.log("IRS");
          layer.popupTemplate.title = "<b>2020 IRS Household Migration between Colorado and {NAME}</b>";  
          layer.popupTemplate.content = "{RetNet20} Net Households<br>"+
            "{RetFr20} Households to Colorado<br>"+
            "{RetTo20} Households from Colorado";
          } else if (fieldSelect.value == "RetNet19"||fieldSelect.value == "RetFr19"||fieldSelect.value == "RetTo19"){console.log("IRS");
          layer.popupTemplate.title = "<b>2019 IRS Household Migration between Colorado and {NAME}</b>"; 
          layer.popupTemplate.content = "{RetNet19} Net Households<br>"+
            "{RetFr19} Households to Colorado<br>"+
            "{RetTo19} Households from Colorado";
          } else if (fieldSelect.value == "AIGNet21"||fieldSelect.value == "AIGFr21"||fieldSelect.value == "AIGTo21"){console.log("IRS");
          layer.popupTemplate.title = "<b>2021 IRS Adjusted Gross Income Migration between Colorado and {NAME}<br>(in thousands of dollars)</b>";  
          layer.popupTemplate.content = "${AIGNet21} Net Income<br>"+
            "${AIGFr21} Income to Colorado<br>"+
            "${AIGTo21} Income from Colorado";
          } else if (fieldSelect.value == "AIGNet20"||fieldSelect.value == "AIGFr20"||fieldSelect.value == "AIGTo20"){console.log("IRS");
          layer.popupTemplate.title = "<b>2020 IRS Adjusted Gross Income Migration between Colorado and {NAME}<br>(in thousands of dollars)</b>";  
          layer.popupTemplate.content = "${AIGNet20} Net Income<br>"+
            "${AIGFr20} Income to Colorado<br>"+
            "${AIGTo20} Income from Colorado";
          } else if (fieldSelect.value == "AIGNet19"||fieldSelect.value == "AIGFr19"||fieldSelect.value == "AIGTo19"){console.log("IRS");
          layer.popupTemplate.title = "<b>2019 IRS Adjusted Gross Income Migration between Colorado and {NAME}<br>(in thousands of dollars)</b>";  
          layer.popupTemplate.content = "${AIGNet19} Net Income<br>"+
            "${AIGFr19} Income to Colorado<br>"+
            "${AIGTo19} Income from Colorado";
          }

          //determine proper color ramp depending on migration stat
          if (fieldSelect.value == "ACSNet21"||fieldSelect.value == "ACSNet19"||
          fieldSelect.value == "IndNet21"||fieldSelect.value == "IndNet20"||fieldSelect.value == "IndNet19"||
          fieldSelect.value == "RetNet21"||fieldSelect.value == "RetNet20"||fieldSelect.value == "RetNet19"){
            var cRamp = netClasses;
          } else if (fieldSelect.value == "ACSFr21"||fieldSelect.value == "ACSFr19"||fieldSelect.value == "IndFr19"||
          fieldSelect.value == "IndFr20"||fieldSelect.value == "IndFr21"||fieldSelect.value == "RetFr21"||
          fieldSelect.value == "RetFr20"||fieldSelect.value == "RetFr19"){
            var cRamp = frClasses;
          } else if (fieldSelect.value == "ACSTo21"||fieldSelect.value == "ACSTo19"||fieldSelect.value == "IndTo19"||
          fieldSelect.value == "IndTo20"||fieldSelect.value == "IndTo21"||fieldSelect.value == "RetTo21"||
          fieldSelect.value == "RetTo20"||fieldSelect.value == "RetTo19"){
            var cRamp = frClasses; 
          } else if (fieldSelect.value == "AIGFr21"||fieldSelect.value == "AIGFr20"||fieldSelect.value == "AIGFr19"){
            var cRamp = frAIGClasses;
          } else if (fieldSelect.value == "AIGTo21"||fieldSelect.value == "AIGTo20"||fieldSelect.value == "AIGTo19"){
            var cRamp = frAIGClasses;
          } else if (fieldSelect.value == "AIGNet19"||fieldSelect.value == "AIGNet20"||fieldSelect.value == "AIGNet21"){ 
            var cRamp = netAIGClasses;
          }

            
          // default to natural-breaks when manual is selected for classification method
          const classificationMethod =
            classSelect.value === "manual"
              ? "natural-breaks"
              : classSelect.value;
          var fixedrenderer = {
              type: "class-breaks", // autocasts as new ClassBreaksRenderer()
              field: fieldSelect.value,
              numClasses: 7,
              legendOptions: {
                  title: fieldLabel
                },
              classBreakInfos: cRamp
            };

          if (classSelect.value === "fixed") {
           layer.renderer = fixedrenderer;
            map.add(layer);
          } else {   
              const params = {
                layer: layer,
                valueExpression: getValueExpression(fieldSelect.value),
                view: view,
                classificationMethod: classificationMethod,
                numClasses: 7,//parseInt(numClassesInput.value),
                legendOptions: {
                  title: fieldLabel
                },
                colorScheme: {
                  id: "above-and-below/gray/div-blue-red",
                  colors: [[255,0,0],[255,85,85],[255,170,170],[255,255,255],[170,170,255],[85,85,255],[0,0,255]],
                  noDataColor: [0,0,0],
                  colorsForClassBreaks: [
                    {
                      colors: [[255,0,0]],
                      numClasses: 1
                    }, {
                      colors: [[255,0,0],[255,255,255]],
                      numClasses: 2
                    }, {
                      colors: [[255,0,0],[255,255,255],[0,0,255]],
                      numClasses: 3
                    }, {
                      colors: [[255,0,0],[170,0,85],[85,0,170],[0,0,255]],
                      numClasses: 4
                    }, {
                      colors: [[255,0,0],[255,127,127],[255,255,255],[127,127,255],[0,0,255]],
                      numClasses: 5
                    }, {
                      colors: [[255,0,0],[255,85,85],[255,170,170],[255,255,255],[127,127,255],[0,0,255]],
                      numClasses: 6
                    }, {
                      //colors: [[255,0,0],[255,85,85],[255,170,170],[255,255,255],[170,170,255],[85,85,255],[0,0,255]],
                      colors: [[140,81,10],[216,179,101],[246,232,195],[255,255,255],[199,234,229],[90,180,172],[1,102,94]],
                      numClasses: 7
                    }, {
                      colors: [[255,0,0],[255,63,63],[255,127,127],[255,191,191],[255,255,255],[170,170,255],[85,85,255],[0,0,255]],
                      numClasses: 8
                    }, {
                      colors: [[255,0,0],[255,63,63],[255,127,127],[255,191,191],[255,255,255],[191,191,255],[127,127,255],[63,63,255],[0,0,255]],
                      numClasses: 9
                    }, {
                      colors: [[255,0,0],[255,63,63],[255,127,127],[255,191,191],[255,255,255],[204,204,255],[153,153,255],[102,102,255],[51,51,255],[0,0,255]],
                      numClasses: 10
                    }, {
                      colors: ["#67001f","#b2182b","#d6604d","#f4a582","#fddbc7","#f7f7f7","#d1e5f0","#92c5de","#4393c3","#2166ac","#053061"],
                      numClasses: 11
                    }
                  ],
                  outline: {
                    color: {r: 0, g: 0, b: 0, a: 0.25},
                    width: "1px"
                  },
                  opacity: 0.8
                }

              };
        

          // generate the renderer and set it on the layer
          colorRendererCreator
            .createClassBreaksRenderer(params)
            .then(function (rendererResponse) {
              layer.renderer = rendererResponse.renderer;

              if (!map.layers.includes(layer)) {
                map.add(layer);
              }

              if (classSelect.value === "manual") {
                // if manual is selected, then add or update
                // a classed color slider to allow the user to
                // construct manual class breaks
                updateColorSlider(rendererResponse);
              } else {
                destroySlider();
              }
            });

          }
        }

        // If manual classification method is selected, then create
        // a classed color slider to allow user to manually modify
        // the class breaks starting with the generated renderer

        function updateColorSlider(rendererResult) {
          histogram({
            layer: layer,
            valueExpression: getValueExpression(fieldSelect.value),
            view: view,
            numBins: 100
          }).then(function (histogramResult) {
            if (!slider) {
              const sliderContainer = document.createElement("div");
              const container = document.createElement("div");
              container.id = "containerDiv";
              container.appendChild(sliderContainer);
              view.ui.add(container, "bottom-right");

              slider = ClassedColorSlider.fromRendererResult(
                rendererResult,
                histogramResult
              );
              slider.container = container;
              slider.viewModel.precision = 1;

              function changeEventHandler() {
                const renderer = layer.renderer.clone();
                renderer.classBreakInfos = slider.updateClassBreakInfos(
                  renderer.classBreakInfos
                );
                layer.renderer = renderer;
              }

              slider.on(
                ["thumb-change", "thumb-drag", "min-change", "max-change"],
                changeEventHandler
              );
            } else {
              slider.updateFromRendererResult(rendererResult, histogramResult);
            }
          });
        }

        function destroySlider() {
          if (slider) {
            const container = document.getElementById("containerDiv");
            view.ui.remove(container);
            slider.container = null;
            slider = null;
            container = null;
          }
        }

       //symbology for net migration
        netClasses = [{
          minValue: -200000,
          maxValue: -1001,
          symbol: {
            type: "simple-fill",
            style: "solid",
            color: [140,81,10],
            outline: {
              color: [50, 50, 50, 0.6],
              width: 0.4
            }
          },
          label: "> 1,000" // label for symbol in legend
        },
        {
          minValue: -1000,
          maxValue: -501,
           symbol: {
              type: "simple-fill",
              style: "solid",
              color: [216,179,101],
              outline: {
                color: [50, 50, 50, 0.6],
                width: 0.4
              }
            },
          label: "-101 to 1,000" // label for symbol in legend       
        },
        {
          minValue: -500,
          maxValue: -1,
           symbol: {
              type: "simple-fill",
              style: "solid",
              color: [246,232,195],
              outline: {
                color: [50, 50, 50, 0.6],
                width: 0.4
              }
            },
          label: "-1 to -100" // label for symbol in legend
        },
        {
          minValue: 0,
          maxValue: 0,
           symbol: {
              type: "simple-fill",
              style: "solid",
              color: [255,255,255],
              outline: {
                color: [50, 50, 50, 0.6],
                width: 0.4
              }
            },
          label: "0" // label for symbol in legend
        },
        {
          minValue: 1,
          maxValue: 500,
           symbol: {
              type: "simple-fill",
              style: "solid",
              color: [199,234,229],
              outline: {
                color: [50, 50, 50, 0.6],
                width: 0.4
              }
            },
          label: "1 to 100" // label for symbol in legend
        },
        {
          minValue: 501,
          maxValue: 1000,
           symbol: {
              type: "simple-fill",
              style: "solid",
              color: [90,180,172],
              outline: {
                color: [50, 50, 50, 0.6],
                width: 0.4
              }
            },
          label: "101 to 1,000" // label for symbol in legend
        },
        {
          minValue: 1001,
          maxValue: 200000,
           symbol: {
             type: "simple-fill",
              style: "solid",
              color: [1,102,94],
              outline: {
                color: [50, 50, 50, 0.6],
                width: 0.4
              }
            },
          label: "> 1,000" // label for symbol in legend
        }]

        //symbology for net AIG
        netAIGClasses = [{
          minValue: -2000000,
          maxValue: -50001,
           symbol: {
              type: "simple-fill",
              style: "solid",
              color: [140,81,10],
              outline: {
                color: [50, 50, 50, 0.6],
                width: 0.4
              }
            },
          label: "> $1,000" // label for symbol in legend
        },
        {
          minValue: -50000,
          maxValue: -20001,
           symbol: {
              type: "simple-fill",
              style: "solid",
              color: [216,179,101],
              outline: {
                color: [50, 50, 50, 0.6],
                width: 0.4
              }
            },
          label: "-$101 to $1,000" // label for symbol in legend
        },
        {
          minValue: -20000,
          maxValue: -1,
           symbol: {
              type: "simple-fill",
              style: "solid",
              color: [246,232,195],
              outline: {
                color: [50, 50, 50, 0.6],
                width: 0.4
              }
            },
          label: "-$1 to -$100" // label for symbol in legend
        },
        {
          minValue: 0,
          maxValue: 0,
           symbol: {
              type: "simple-fill",
              style: "solid",
              color: [255,255,255],
              outline: {
                color: [50, 50, 50, 0.6],
                width: 0.4
              }
            },
          label: "$0" // label for symbol in legend
        },
        {
          minValue: 1,
          maxValue: 20000,
           symbol: {
              type: "simple-fill",
              style: "solid",
              color: [199,234,229],
              outline: {
                color: [50, 50, 50, 0.6],
                width: 0.4
              }
            },
          label: "$1 to $100" // label for symbol in legend
        },
        {
          minValue: 20001,
          maxValue: 50000,
           symbol: {
              type: "simple-fill",
              style: "solid",
              color: [90,180,172],
              outline: {
                color: [50, 50, 50, 0.6],
                width: 0.4
              }
            },
          label: "$101 to $1,000" // label for symbol in legend
        },
        {
          minValue: 50001,
          maxValue: 2000000,
           symbol: {
             type: "simple-fill",
              style: "solid",
              color: [1,102,94],
              outline: {
                color: [50, 50, 50, 0.6],
                width: 0.4
              }
            },
          label: "> $1,000" // label for symbol in legend
        }]

        //symbology for out and in migration
        frClasses = [{
          minValue: 0,
          maxValue: 0,
           symbol: {
              type: "simple-fill",
              style: "solid",
              color: [255,255,255],
              outline: {
                color: [50, 50, 50, 0.6],
                width: 0.4
              }
            },
          label: "0" // label for symbol in legend
        },
        {
          minValue: 1,
          maxValue: 200,
           symbol: {
              type: "simple-fill",
              style: "solid",
              color: [255,255,204],
              outline: {
                color: [50, 50, 50, 0.6],
                width: 0.4
              }
            },
          label: "1 to 200" // label for symbol in legend
        },
        {
          minValue: 201,
          maxValue: 500,
           symbol: {
              type: "simple-fill",
              style: "solid",
              color: [199,233,180],
              outline: {
                color: [50, 50, 50, 0.6],
                width: 0.4
              }
            },
          label: "201 to 500" // label for symbol in legend
        },
        {
          minValue: 501,
          maxValue: 1000,
           symbol: {
              type: "simple-fill",
              style: "solid",
              color: [127,205,187],
              outline: {
                color: [50, 50, 50, 0.6],
                width: 0.4
              }
            },
          label: "501 to 1,000" // label for symbol in legend
        },
        {
          minValue: 1001,
          maxValue: 5000,
           symbol: {
              type: "simple-fill",
              style: "solid",
              color: [65,182,196],
              outline: {
                color: [50, 50, 50, 0.6],
                width: 0.4
              }
            },
          label: "1,001 to 5,000" // label for symbol in legend
        },
        {
          minValue: 5001,
          maxValue: 10000,
           symbol: {
              type: "simple-fill",
              style: "solid",
              color: [44,127,184],
              outline: {
                color: [50, 50, 50, 0.6],
                width: 0.4
              }
            },
          label: "5,001 to 10,000" // label for symbol in legend
        },
        {
          minValue: 10001,
          maxValue: 100000,
           symbol: {
             type: "simple-fill",
              style: "solid",
              color: [37,52,148],
              outline: {
                color: [50, 50, 50, 0.6],
                width: 0.4
              }
            },
          label: "> 10,000" // label for symbol in legend
        }]

        //symbology for out and in AIG
        frAIGClasses = [{
          minValue: 0,
          maxValue: 0,
           symbol: {
              type: "simple-fill",
              style: "solid",
              color: [255,255,255],
              outline: {
                color: [50, 50, 50, 0.6],
                width: 0.4
              }
            },
          label: "$0" // label for symbol in legend
        },
        {
          minValue: 1,
          maxValue: 20000,
           symbol: {
              type: "simple-fill",
              style: "solid",
              color: [255,255,204],
              outline: {
                color: [50, 50, 50, 0.6],
                width: 0.4
              }
            },
          label: "$1 to $20,000" // label for symbol in legend
        },
        {
          minValue: 20001,
          maxValue: 50000,
           symbol: {
              type: "simple-fill",
              style: "solid",
              color: [199,233,180],
              outline: {
                color: [50, 50, 50, 0.6],
                width: 0.4
              }
            },
          label: "$20,001 to $50,000" // label for symbol in legend
        },
        {
          minValue: 50001,
          maxValue: 100000,
           symbol: {
              type: "simple-fill",
              style: "solid",
              color: [127,205,187],
              outline: {
                color: [50, 50, 50, 0.6],
                width: 0.4
              }
            },
          label: "$50,001 to $100,000" // label for symbol in legend
        },
        {
          minValue: 100001,
          maxValue: 200000,
           symbol: {
              type: "simple-fill",
              style: "solid",
              color: [65,182,196],
              outline: {
                color: [50, 50, 50, 0.6],
                width: 0.4
              }
            },
          label: "$100,001 to $200,000" // label for symbol in legend
        },
        {
          minValue: 200001,
          maxValue: 500000,
           symbol: {
              type: "simple-fill",
              style: "solid",
              color: [44,127,184],
              outline: {
                color: [50, 50, 50, 0.6],
                width: 0.4
              }
            },
          label: "$200,001 to $500,000" // label for symbol in legend
        },
        {
          minValue: 500001,
          maxValue: 20000000,
           symbol: {
             type: "simple-fill",
              style: "solid",
              color: [37,52,148],
              outline: {
                color: [50, 50, 50, 0.6],
                width: 0.4
              }
            },
          label: "> $500,000" // label for symbol in legend
        }]
     
    
    
});

    
