/// <reference path="typings/main.d.ts" />
"use strict";
var jQuery = require("jquery");
window["jQuery"] = window["$"] = jQuery;
var Bootstrap = require("bootstrap");
[Bootstrap];
var app = require("./app");
app.run();
