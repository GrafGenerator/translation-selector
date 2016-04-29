/// <reference path="typings/main.d.ts" />
/// <reference path="custom_typings/main.d.ts" />

import jQuery = require("jquery");
window["jQuery"] = window["$"] = jQuery;

import Bootstrap = require("bootstrap");
[Bootstrap];


import app = require("./app");
app.run();