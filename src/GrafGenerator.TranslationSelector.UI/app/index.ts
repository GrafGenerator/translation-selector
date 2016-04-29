/// <reference path="typings/main/definitions/bootstrap/index.d.ts" />
/// <reference path="typings/main/definitions/jquery/index.d.ts" />

import jQuery = require("jquery");
window["jQuery"] = window["$"] = jQuery;

import Bootstrap = require("bootstrap");
[Bootstrap];


import app = require("./app");
app.run();