/**
 * React with RequireJS
 * @author Rodrigo Cesar de Freitas Dias
 * @license MIT
 * @see https://github.com/rodrigocfd/react-require
 */
"use strict";!function(){var e,n={};if("undefined"!=typeof window&&window.navigator&&window.document)e=function(e,n){var o=new XMLHttpRequest;o.open("GET",e,!0),o.onreadystatechange=function(e){4===o.readyState&&n(o.responseText)},o.send(null)};else if("undefined"!=typeof process&&process.versions&&process.versions.node){var o=require.nodeRequire("fs");e=function(e,n){n(o.readFileSync(e,"utf8"))}}define(["babel"],function(o){return{load:function(i,r,s,t){var a=r.toUrl(i+".js"),d=window.babelConfig&&window.babelConfig.presets||["es2015","react"],f=window.babelConfig&&window.babelConfig.plugins||["transform-class-properties","transform-decorators-legacy"];e(a,function(e){var r=o.transform(e,{presets:d,plugins:f,filename:"embedded",sourceMaps:"inline"}).code;t.isBuild&&(n[i]=r),s.fromText(r)})},write:function(e,o,i){o in n&&i.asModule(e+"!"+o,n[o])}}})}();