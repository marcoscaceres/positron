/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- /
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

// An XPCOM component that implements the `process` global in BrowserWindow.
// This gets attached the global object through the 'process' WebIDL interface.
// It proxies access to the gecko/process module.

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;
const Cu = Components.utils;

Cu.import('resource://gre/modules/XPCOMUtils.jsm');
Cu.import('resource:///modules/ModuleLoader.jsm');

function Process() {}

Process.prototype = {
  _processGlobal: null,

  classID: Components.ID('{3c81d709-5fb4-4144-9612-9ecc1be4e7b1}'),
  contractID: '@mozilla.org/positron/process;1',

  /* nsISupports */

  QueryInterface: XPCOMUtils.generateQI([Ci.nsISupports, Ci.nsIDOMGlobalPropertyInitializer]),

  /* nsIDOMGlobalPropertyInitializer */

  /**
   * Initialize the global `process` property.  See the code comment
   * https://dxr.mozilla.org/mozilla-central/rev/21bf1af/toolkit/mozapps/extensions/amInstallTrigger.js#124-133
   * for an explanation of the behavior of this method.
   */
  init: function(window) {
    let loader = ModuleLoader.getLoaderForWindow(window);
    this._processGlobal = loader.global.process;
    return window.processImpl._create(window, this);
  },

  /* Node `process` interface */

  get versions() {
    return this._processGlobal.versions;
  },

};

this.NSGetFactory = XPCOMUtils.generateNSGetFactory([Process]);
