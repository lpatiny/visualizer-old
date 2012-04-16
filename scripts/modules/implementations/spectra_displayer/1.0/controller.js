 /*
 * controller.js
 * version: dev
 *
 * Copyright 2012 Norman Pellet - norman.pellet@epfl.ch
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */

if(typeof CI.Module.prototype._types.spectra_displayer == 'undefined')
	CI.Module.prototype._types.spectra_displayer = {};

CI.Module.prototype._types.spectra_displayer.Controller = function(module) {
	
	CI.Module.prototype._impl.controller.init(module, this);
}

CI.Module.prototype._types.spectra_displayer.Controller.prototype = {
	
	
	init: function() {
	},
	
	getConfigurationSend: function() {
		
		return {

			events: {
			},
			
			rels: {
				
			}
		}
	},
	
	getConfigurationReceive: function() {
		return {
			jcamp: {
				type: 'string',
				label: 'Jcamp URL',
				description: 'The jcamp URL'
			}
		}
	}

}
