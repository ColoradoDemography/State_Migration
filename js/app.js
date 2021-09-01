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
    
     var popupQCEW = {
        title: "{County} County Change<br>December 2019 to December 2020",
        content:
            "<b>All Industries:</b>  {TotalA} Jobs, {Total}%<br>"+
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
            "<b>  Other Services:</b>  {OtherServA} Jobs, {OtherServ}%<br>"/*+
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
        }
      },
      labelPlacement: "above-center",
      labelExpressionInfo: {
        expression: "$feature.NAME"
      }
    };
    
    var layer = new FeatureLayer({
        title: "QCEW December 2019 to December 2020 Change",
        url: "https://services.arcgis.com/IamIM3RJ5xHykalK/arcgis/rest/services/QCEW_June_Changes/FeatureServer/0",
        popupTemplate: popupQCEW,
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
      center: [-105.8, 39.202], // longitude, latitude
      zoom: 6
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
          // default to natural-breaks when manual is selected for classification method
          const classificationMethod =
            classSelect.value === "manual"
              ? "natural-breaks"
              : classSelect.value;
          var blsrenderer = {
              type: "class-breaks", // autocasts as new ClassBreaksRenderer()
              field: fieldSelect.value,
              numClasses: 11,
              legendOptions: {
                  title: "% Job Change "// + fieldLabel
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
              classBreakInfos: [
                /*{
                  minValue: -100,
                  maxValue: -8.0001,
                  symbol: {
                      type: "simple-fill",
                      style: "solid",
                      color: "#67001f",
                      outline: {
                        color: [50, 50, 50, 0.6],
                        width: 0.4
                      },
                  label: "< -8%" // label for symbol in legend
                  }
                },*/
                {
                  minValue: -100,
                  maxValue: -6.0001,
                   symbol: {
                      type: "simple-fill",
                      style: "solid",
                      color: [255,0,0],
                      outline: {
                        color: [50, 50, 50, 0.6],
                        width: 0.4
                      },
                  label: "35 - 50%" // label for symbol in legend
                   }
                },
                {
                  minValue: -6,
                  maxValue: -4.0001,
                   symbol: {
                      type: "simple-fill",
                      style: "solid",
                      color: [255,63,63],
                      outline: {
                        color: [50, 50, 50, 0.6],
                        width: 0.4
                      },
                  label: "50 - 75%" // label for symbol in legend
                   }
                },
                {
                  minValue: -4,
                  maxValue: -2.0001,
                   symbol: {
                      type: "simple-fill",
                      style: "solid",
                      color: [255,127,127],
                      outline: {
                        color: [50, 50, 50, 0.6],
                        width: 0.4
                      },
                  label: "> 75%" // label for symbol in legend
                   }
                },
                {
                  minValue: -2,
                  maxValue: 0.0001,
                   symbol: {
                      type: "simple-fill",
                      style: "solid",
                      color: [255,191,191],
                      outline: {
                        color: [50, 50, 50, 0.6],
                        width: 0.4
                      },
                  label: "> 75%" // label for symbol in legend
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
                  label: "> 75%" // label for symbol in legend
                   }
                },
                {
                  minValue: .0001,
                  maxValue: 2,
                   symbol: {
                      type: "simple-fill",
                      style: "solid",
                      color: [191,191,255],
                      outline: {
                        color: [50, 50, 50, 0.6],
                        width: 0.4
                      },
                  label: "> 75%" // label for symbol in legend
                   }
                },
                {
                  minValue: 2.0001,
                  maxValue: 4,
                   symbol: {
                      type: "simple-fill",
                      style: "solid",
                      color: [127,127,255],
                      outline: {
                        color: [50, 50, 50, 0.6],
                        width: 0.4
                      },
                  label: "> 75%" // label for symbol in legend
                   }
                },
                {
                  minValue: 4.0001,
                  maxValue: 6,
                   symbol: {
                      type: "simple-fill",
                      style: "solid",
                      color: [63,63,255],
                      outline: {
                        color: [50, 50, 50, 0.6],
                        width: 0.4
                      },
                  label: "> 75%" // label for symbol in legend
                   }
                },
                {
                  minValue: 6.0001,
                  maxValue: 100,
                   symbol: {
                     type: "simple-fill",
                      style: "solid",
                      color: [0,0,255],
                      outline: {
                        color: [50, 50, 50, 0.6],
                        width: 0.4
                      },
                  label: "> 75%" // label for symbol in legend
                   }
                }/*,
                {
                  minValue: 8.0001,
                  maxValue: 100,
                   symbol: {
                      type: "simple-fill",
                      style: "solid",
                      color: "#053061",
                      outline: {
                        color: [50, 50, 50, 0.6],
                        width: 0.4
                      },
                  label: "> 75%" // label for symbol in legend
                   }
                }*/
              ]
            };

          if (classSelect.value === "bls") {
           layer.renderer = blsrenderer;
            map.add(layer);
          } else {   
              const params = {
                layer: layer,
                valueExpression: getValueExpression(fieldSelect.value),
                view: view,
                classificationMethod: classificationMethod,
                numClasses: parseInt(numClassesInput.value),
                legendOptions: {
                  title: "% Job Change "// + fieldLabel
                },
                colorScheme: {
                  id: "above-and-below/gray/div-blue-red",
                  colors: [[255,0,0],[255,127,127],[255,255,255],[127,127,255],[0,0,255]],
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




    
     
    
    
});

    
