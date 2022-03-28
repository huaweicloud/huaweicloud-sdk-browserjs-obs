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
	let form = [new Date().toLocaleString(), level.toLowerCase(), methodName, msg].join('|');
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

export default LogUtil;