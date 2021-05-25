/*function getRandomColor() {
    var r = () => Math.random() * 256 >> 0;
    var color = `rgba(${r()}, ${r()}, ${r()}, 0.6)`;
    return color;
}*/

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


define([],
    function() {
        'use strict';

        //Dimensions - measures - sortings
        var dimensions = {
            uses: "dimensions",
            min: 1,
            max: 1
        };

        var measures = {
            uses: "measures",
            min: 1,
            max: 2,
            items: {
                colorazioneMisure: {
                    type: "string",
                    ref: "qAttributeExpressions.0.qExpression",
                    label: "Colorazione",
                    component: "expression",
                    expression: "always",
                    defaultValue: "='" + getRandomColor() + "'"
                },
            }
        };

        var sorting = {
            uses: "sorting"
        }

        //myText
        /*
        var myText = {
            ref: "prop.myText",
            type: "string",
            label: "Insert text",
            defaultValue: "#3C887E"
        }
        */

        //Grid
        var checkGrid = {
            type: "boolean",
            component: "switch",
            label: "Grid",
            ref: "props.grid",
            options: [{
                value: true,
                label: "ON"
            }, {
                value: false,
                label: "OFF"
            }],
            defaultValue: true
        }

        //Stack bars
        var checkStacked = {
            type: "boolean",
            component: "switch",
            label: "Stack bars",
            ref: "props.stacked",
            options: [{
                value: true,
                label: "Stacked"
            }, {
                value: false,
                label: "Not stacked"
            }],
            defaultValue: false
        }

        //Tooltips
        var checkTooltips = {
            type: "boolean",
            component: "switch",
            label: "Tooltips",
            ref: "props.tooltips",
            options: [{
                value: true,
                label: "Show"
            }, {
                value: false,
                label: "Hide"
            }],
            defaultValue: true
        }

        //Legend
        var legendBtn = {
            type: "string",
            component: "buttongroup",
            label: "Legend positioning",
            ref: "props.legend",
            options: [{
                    value: "t",
                    label: "⬆",
                    tooltip: "Legend on top"
                },
                {
                    value: "l",
                    label: "⬅",
                    tooltip: "Legend on left"
                },
                {
                    value: "b",
                    label: "⬇",
                    tooltip: "Legend on bottom"
                },
                {
                    value: "r",
                    label: "➡",
                    tooltip: "Legend on right"
                },
                {
                    value: "h",
                    label: "No",
                    tooltip: "Hide legend"
                }
            ],
            defaultValue: "t"
        }

        //Appearance section
        var appearanceSection = {
            uses: "settings",
            items: {
                //Colors panel
                /*
                colors: {
                    type: "items",
                    label: "Colors",
                    items: {
                        //myText: myText,
                        //cP1: colorPicks[0],
                        //cP2: colorPicks[1],
                        //cP3: colorPicks[2]
                    }
                },*/
                //settings panel
                settings: {
                    type: "items",
                    label: "Settings",
                    items: {
                        checkGrid: checkGrid,
                        checkStacked: checkStacked,
                        checkTooltips: checkTooltips,
                        legendBtn: legendBtn,
                    }
                }


            }
        };


        // Main property panel definition
        return {
            type: "items",
            component: "accordion",
            items: {
                dimensions: dimensions,
                measures: measures,
                sorting: sorting,
                appearancePanel: appearanceSection
            }
        };

    });