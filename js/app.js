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
    
    /* popupSelect = document.getElementById("field-select");
    popupSelect.addEventListener("change", (event) => {refresh(layer);
      const popupLabel = popupSelect.options[popupSelect.selectedIndex].value;

      if (popupLabel == "ACSNet21"||popupLabel == "ACSFr21"||popupLabel == "ACSTo21"){
        popupMigration.content = "ACS21";
      } else if (popupLabel == "ACSNet19"||popupLabel == "ACSFr19"||popupLabel == "ACSTo19"){
          popupMigration.content = "ACS19"
      } else if (popupLabel == "IndNet21"||popupLabel == "IndFr21"||popupLabel == "IndTo21"){
          popupMigration.content = "IRS21"
      } else if (popupLabel == "IndNet20"||popupLabel == "IndFr20"||popupLabel == "IndTo20"){
          popupMigration.content = "IRS20"
      } else if (popupLabel == "IndNet19"||popupLabel == "IndFr19"||popupLabel == "IndTo19"){
        popupMigration.content = "IRS19"
      } else if (popupLabel == "RetNet21"||popupLabel == "RetFr21"||popupLabel == "RetTo21"){
        popupMigration.content = "IRS21"
      } else if (popupLabel == "RetNet20"||popupLabel == "RetFr20"||popupLabel == "RetTo20"){
          popupMigration.content = "IRS20"
      } else if (popupLabel == "RetNet19"||popupLabel == "RetFr19"||popupLabel == "RetTo19"){
        popupMigration.content = "IRS19"
      } else if (popupLabel == "AIGNet21"||popupLabel == "AIGFr21"||popupLabel == "AIGTo21"){
        popupMigration.content = "IRS21"
      } else if (popupLabel == "AIGNet20"||popupLabel == "AIGFr20"||popupLabel == "AIGTo20"){
          popupMigration.content = "IRS20"
      } else if (popupLabel == "AIGNet19"||popupLabel == "AIGFr19"||popupLabel == "AIGTo19"){
        popupMigration.content = "IRS19"
      }
      
    }); */
    
    var popupMigration = {
        title: "<b>2021 ACS Migration between Colorado and {NAME}</b>",
        content: "{ACSNet21} Net Migrants<br>"+
        "{ACSFr21} Migrants to Colorado<br>"+
        "{ACSTo21} Migrants from Colorado"; //popupContent
            /*"<b>All Industries:</b>  {TotalA} Jobs, {Total}%<br>"+
            "<b> Goods-Producting:</b>  {GoodsA} Jobs, {Goods}%<br>"+
            "<b>  Natural Resources & Mining:</b>  {NatResA} Jobs, {NatRes}%<br>"+
            "<b>  Construction:</b>  {ConstA} Jobs, {Const}%<br>"+
            "<b>  Manufacturing:</b>  {ManufA} Jobs, {Manuf}%<br>"+
            "<b> Service-Providing</b>  {ServiceA} Jobs, {Service}%<br>"+
            "<b>  Trade, Transportation & Utilities:</b>  {TradeA} Jobs, {Trade}%<br>"+
            "<b>  Information:</b>  {InformA} Jobs, {Inform}%<br>"+
            "<b>  Financial Activities:</b>  {FinanceA} Jobs, {Finance}%<br>"+
            "<b>  Professional & Business Services:</b>  {ProfA} Jobs, {Prof}%<br>"+
            "<b>  Education & Health:</b>  {EducationA} Jobs, {Education}%<br>"+
            "<b>  Leisure & Hospitality:</b>  {LeisureA} Jobs, {Leisure}%<br>"+
            "<b>  Other Services:</b>  {OtherServA} Jobs, {OtherServ}%<br>"+
            "<b> Unclassified:</b>  {Unclass}%<br>"*/
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
                }
            })
        ]
    })
    
    var map = new Map({
      basemap: basemap
    });

    var view = new MapView({
      container: "viewDiv",
      map: map,
      center: [-97.55, 39.711], // longitude, latitude
      zoom: 3
    });
    
    //view.ui.move("zoom", "bottom-right");
    
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
    
    var expand2 = new Expand({
        view: view,
        content: print,
        expandIconClass: "esri-icon-printer",
        expandTooltip: "Print"
    })
    
    view.ui.add([expand2], "bottom-right");
   // view.ui.add([expand2], "bottom-right");
    
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

          numClassesInput = document.getElementById("num-classes");
          numClassesInput.addEventListener("change", generateRenderer);

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
          const fieldLabel =
            fieldSelect.options[fieldSelect.selectedIndex].text;
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
            } else if (fieldSelect.value == "IncNet21"||fieldSelect.value == "IncFr21"||fieldSelect.value == "IncTo21"){console.log("IRS");
            layer.popupTemplate.title = "<b>2021 IRS Adjusted Gross Income Migration between Colorado and {NAME}</b>";  
            layer.popupTemplate.content = "{IncNet21} Net Income<br>"+
              "{IncFr21} Income to Colorado<br>"+
              "{IncTo21} Income from Colorado";
            } else if (fieldSelect.value == "IncNet20"||fieldSelect.value == "IncFr20"||fieldSelect.value == "IncTo20"){console.log("IRS");
            "<b>2020 IRS Adjusted Gross Income Migration between Colorado and {NAME}</b>";  
            layer.popupTemplate.content = "{IncNet20} Net Income<br>"+
              "{IncFr20} Income to Colorado<br>"+
              "{IncTo20} Income from Colorado";
            } else if (fieldSelect.value == "IncNet19"||fieldSelect.value == "IncFr19"||fieldSelect.value == "IncTo19"){console.log("IRS");
            "<b>2019 IRS Adjusted Gross Income Migration between Colorado and {NAME}</b>";  
            layer.popupTemplate.content = "{IncNet19} Net Income<br>"+
              "{IncFr19} Income to Colorado<br>"+
              "{IncTo19} Income from Colorado";
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
              defaultSymbol: {
                type: "simple-fill", // autocasts as new SimpleFillSymbol()
                color: "black",
                style: "backward-diagonal",
                outline: {
                  width: 0.5,
                  color: [50, 50, 50, 0.6]
                }
              },
              defaultLabel: "NA",
              classBreakInfos: netClasses
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
                numClasses: parseInt(numClassesInput.value),
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
                      colors: [[255,0,0],[255,85,85],[255,170,170],[255,255,255],[170,170,255],[85,85,255],[0,0,255]],
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


       netClasses = {
          minValue: -1001,
          maxValue: -200000,
           symbol: {
              type: "simple-fill",
              style: "solid",
              color: [255,0,0],
              outline: {
                color: [50, 50, 50, 0.6],
                width: 0.4
              },
          label: "> 1,000" // label for symbol in legend
           }
        },
        {
          minValue: -1000,
          maxValue: -101,
           symbol: {
              type: "simple-fill",
              style: "solid",
              color: [255,63,63],
              outline: {
                color: [50, 50, 50, 0.6],
                width: 0.4
              },
          label: "-101 to 1,000" // label for symbol in legend
           }
        },
        {
          minValue: -100,
          maxValue: -1,
           symbol: {
              type: "simple-fill",
              style: "solid",
              color: [255,127,127],
              outline: {
                color: [50, 50, 50, 0.6],
                width: 0.4
              },
          label: "-1 to -100" // label for symbol in legend
           }
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
              },
          label: "0" // label for symbol in legend
           }
        },
        {
          minValue: 1,
          maxValue: 100,
           symbol: {
              type: "simple-fill",
              style: "solid",
              color: [127,127,255],
              outline: {
                color: [50, 50, 50, 0.6],
                width: 0.4
              },
          label: "1 to 100" // label for symbol in legend
           }
        },
        {
          minValue: 101,
          maxValue: 1000,
           symbol: {
              type: "simple-fill",
              style: "solid",
              color: [63,63,255],
              outline: {
                color: [50, 50, 50, 0.6],
                width: 0.4
              },
          label: "101 to 1,000" // label for symbol in legend
           }
        },
        {
          minValue: 1001,
          maxValue: 200000,
           symbol: {
             type: "simple-fill",
              style: "solid",
              color: [0,0,255],
              outline: {
                color: [50, 50, 50, 0.6],
                width: 0.4
              },
          label: "> 1,000" // label for symbol in legend
           }
        }

    
     
    
    
});

    
