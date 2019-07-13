/**
 * Copyright 2019 Huawei Technologies Co.,Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 * this file except in compliance with the License.  You may obtain a copy of the
 * License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations under the License.
 *
 */

(function (root, factory) {
  'use strict';
  if(typeof define === 'function' && define.amd){
	  define('log', [], factory);
  }else{
	  root['log'] = factory();
  }
})(this ? this : window, function(){

'use strict';

const OFF = Number.MAX_VALUE;

const DEBUG = 10;

const INFO = 20;

const WARN = 30;

const ERROR = 40;


function LogUtil(){
	this.consoleLog = window.console;
	this._level = OFF;
}

LogUtil.prototype.setLevel = function(level){
	if(!level){
		return;
	}
	level = String(level).toLowerCase();
	if(level === 'info'){
		level = INFO;
	}else if(level === 'warn'){
		level = WARN;
	}else if(level === 'error'){
		level = ERROR;
	}else if(level === 'debug'){
		level = DEBUG;
	}else{
		level = OFF;
	}
	this._level = level;
};

LogUtil.prototype.runLog = function(level, methodName, msg){
	if(!level){
		return;
	}
	var form = [new Date().toLocaleString(), level.toLowerCase(), methodName, msg].join('|');
	if(level.toLowerCase() === 'debug' && this._level <= DEBUG){
		this.consoleLog.debug(form);
	}else if(level.toLowerCase() === 'info' && this._level <= INFO){
		this.consoleLog.info(form);
	}else if(level.toLowerCase() === 'warn' && this._level <= WARN){
		this.consoleLog.warn(form);
	}else if(level.toLowerCase() === 'error' && this._level <= ERROR){
		this.consoleLog.error(form);
	}
};

return LogUtil;
});


