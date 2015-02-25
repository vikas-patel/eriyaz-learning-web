/*
Class:    	Game Count Down
Author:   	Alexander Predl
Website:    http://www.predl.cc
Version:  	0.1
Date:     	20/10/2012
Built For:  jQuery 1.8.x
 */

(function ($) {
	$.GameCountDown = function (settings) {
		settings = jQuery.extend({
				unit           : 1000,
				displayreverse : false,
				displaymax     : false,
				readymessage   : 'fertig!',
				formatday      : 'd ',
				formathour     : 'h ',
				formatminute   : 'm ',
				formatsecond   : 's',
				callback       : function () {}
			}, settings);
		var CounterList = [];
		this.Counter = function () {
			this.init = true;
			for (index in CounterList) {
				if (Math.floor(CounterList[index].seconds) <= 0) {
					$("#" + CounterList[index].id).html(settings.readymessage);
				} else {
					if (settings.displaymax) {
						if (settings.displayreverse) {
							$("#" + CounterList[index].id).html(this.Format((CounterList[index].startseconds - CounterList[index].seconds) + 1)+"/"+CounterList[index].startseconds);
						} else {
							$("#" + CounterList[index].id).html(this.Format(CounterList[index].seconds+"/"+CounterList[index].startseconds));
						}
					} else {
						if (settings.displayreverse) {
							$("#" + CounterList[index].id).html(this.Format((CounterList[index].startseconds - CounterList[index].seconds) + 1));
						} else {
							$("#" + CounterList[index].id).html(this.Format(CounterList[index].seconds));
						}
					}
				};
				var n = new Date();
				CounterList[index].seconds = CounterList[index].seconds - ((n.getTime() - CounterList[index].lastupdate.getTime()) / 1000);
				CounterList[index].lastupdate = n;
			};
			var nochange = false;
			while (nochange == false) {
				nochange = true;
				for (index in CounterList) {
					if (Math.floor(CounterList[index].seconds) < 0) {
						if (CounterList[index].callback) {
							CounterList[index].callback(CounterList[index].id);
						}
						if (settings.callback) {
							settings.callback(CounterList[index].id);
						}
						CounterList.splice(index, 1);
						nochange = false;
						break;
					};
				}
			};
			var GameCountDown = this;
			this.timeoutObject = window.setTimeout(function () {
					GameCountDown.Timer();
				}, settings.unit);
		};

		this.Timer = function () {
			this.Counter();
		};

		this.Add = function (eachsettings) {
			eachsettings = jQuery.extend({
					control  : {},
					seconds  : 60,
					callback : function () {}
				}, eachsettings);
			$(eachsettings.control).each(function () {
				var v = new Date();
				var found=false;
				for (index in CounterList) {
					if (CounterList[index].id===$(this).attr("id")) {
						CounterList[index].seconds=eachsettings.seconds;
						CounterList[index].startseconds=eachsettings.seconds;
						CounterList[index].lastupdate=v;
						CounterList[index].callback=eachsettings.callback;
						found=true;
						break;
					}
				};
				if (!found) {
					CounterList.push({
						id : $(this).attr("id"),
						seconds : eachsettings.seconds,
						startseconds : eachsettings.seconds,
						lastupdate : v,
						callback : eachsettings.callback
					});
				};
			});
		};

		this.Remove = function (control) {
			$(control).each(function () {
				for (index in CounterList) {
					if (CounterList[index].id===$(this).attr("id")) {
						CounterList.splice(index, 1);
						break;
					};
				};
			});
		};

		this.Set = function (eachsettings) {
			eachsettings = jQuery.extend({
					control  : {},
					seconds  : 60,
					callback : function () {}
				}, eachsettings);
			$(eachsettings.control).each(function () {
				var v = new Date();
				for (index in CounterList) {
					if (CounterList[index].id===$(this).attr("id")) {
						CounterList[index].seconds=eachsettings.seconds;
						CounterList[index].startseconds=eachsettings.seconds;
						CounterList[index].lastupdate=v;
						CounterList[index].callback=eachsettings.callback;
						break;
					};
				};
			});
		};

		this.Format = function (seconds) {
			var d = 0;
			var h = 0;
			var m = 0;
			var s = 0;
			var result = '';
			d = Math.floor(seconds / 86400);
			if (d > 0) {
				result += d + settings.formatday;
			};
			h = Math.floor((seconds - (d * 86400)) / 3600);
			if (h > 0 || d > 0) {
				result += h + settings.formathour;
			};
			m = Math.floor((seconds - (h * 3600) - (d * 86400)) / 60);
			if (m > 0 || h > 0 || d > 0) {
				result += m + settings.formatminute;
			};
			s = Math.floor((seconds - (m * 60) - (h * 3600) - (d * 86400)));
			if (s >= 0 || m > 0 || h > 0 || d > 0) {
				result += s + settings.formatsecond;
			};
			return result;
		};

		if (this.init) {
			return new $.GameCountDown(settings);
		} else {
			this.Counter(settings);
			return this;
		};
	};
})(jQuery);
