
(function() {

  define('mylibs/camera/normalize',['jQuery', 'Kendo'], function($, kendo) {
    var optionStyle, options;
    window.URL || (window.URL = window.webkitURL || window.msURL || window.oURL);
    navigator.getUserMedia || (navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    optionStyle = (function(win) {
      var el, object, root, string;
      if (!navigator.getUserMedia) return;
      el = document.createElement("iframe");
      root = document.body || document.documentElement;
      string = true;
      object = true;
      return {
        string: string,
        object: object
      };
    })(window);
    return options = function(opts) {
      var o, stringOptions;
      stringOptions = [];
      if (optionStyle.string && !optionStyle.object) {
        for (o in opts) {
          if (opts[o] === true) stringOptions.push(o);
        }
        return stringOptions.join(" ");
      } else {
        return opts;
      }
    };
  });

}).call(this);

(function() {

  define('mylibs/controls/controls',['jQuery', 'Kendo'], function($, kendo) {
    var pub;
    return pub = {
      init: function(controlsId) {
        var $controls, previousAlpha, previousBeta, previousGamma;
        $controls = $("#" + controlsId);
        $controls.on("click", "button", function() {
          return $.publish($(this).data("event"));
        });
        $controls.on("change", "input", function(e) {
          return $.publish("/polaroid/change", [e]);
        });
        if (window.DeviceOrientationEvent || window.OrientationEvent) {
          $(".polaroid-container").show();
          previousAlpha = 0;
          previousGamma = 0;
          previousBeta = 0;
          return window.addEventListener('deviceorientation', function(eventData) {
            if ((eventData.gamma - previousGamma) > 40 || (previousGamma - eventData.gamma) > 40) {
              $.publish("/shake/gamma");
            }
            if ((eventData.beta - previousBeta) > 40 || (previousBeta - eventData.beta) > 40) {
              return $.publish("/shake/beta");
            }
          }, false);
        }
      }
    };
  });

}).call(this);

(function() {

  define('mylibs/effects/presets',['jQuery', 'Kendo'], function($, kendo) {
    var pub;
    return pub = {
      effects: {
        none: {
          vignette: {
            black: false,
            white: false
          },
          noise: false,
          screen: {
            red: false,
            green: false,
            blue: false,
            strenth: 0
          },
          desaturate: false,
          allowMultiEffect: true,
          mime: "image/jpeg",
          viewFinder: false
        },
        vintage: {
          vignette: {
            black: 0.6,
            white: 0.1
          },
          noise: 20,
          screen: {
            red: 227,
            green: 12,
            blue: 169,
            strength: 0.1
          },
          desaturate: false,
          allowMultiEffect: true,
          mime: 'image/jpeg',
          viewFinder: false
        },
        sepia: {
          vignette: {
            black: 0.6,
            white: 0.1
          },
          noise: 25,
          screen: {
            red: 141,
            green: 107,
            blue: 3,
            strength: 0.47
          },
          desaturate: 0.7,
          allowMultiEffect: true,
          mime: 'image/jpeg',
          viewFinder: false
        },
        grayscale: {
          vignette: {
            black: 0.7,
            white: 0.2
          },
          noise: 25,
          screen: {
            red: false,
            green: false,
            blue: false,
            strength: false
          },
          desaturate: 1,
          allowMultiEffect: true,
          mime: 'image/jpeg',
          viewFinder: false
        },
        green: {
          vignette: {
            black: 0.6,
            white: 0.1
          },
          noise: 20,
          screen: {
            red: 255,
            green: 255,
            blue: 0,
            strength: 0.1
          },
          desaturate: false,
          allowMultiEffect: true,
          mime: 'image/jpeg',
          viewFinder: false
        }
      }
    };
  });

}).call(this);

(function() {
  var __hasProp = Object.prototype.hasOwnProperty;

  define('mylibs/effects/effects',['jQuery', 'Kendo', 'mylibs/effects/presets'], function($, kendo, presets) {
    var applyEffect, pub, updateImage, vintageDefaults;
    vintageDefaults = {
      vignette: {
        black: 0,
        white: 0
      },
      noise: false,
      screen: {
        blue: false,
        green: false,
        red: false,
        strength: 0
      },
      desaturate: false,
      allowMultiEffect: true,
      mime: 'image/jpeg',
      viewFinder: false,
      curves: false,
      blur: false,
      preset: "custom",
      callback: function() {}
    };
    updateImage = function($image, options, value) {
      var effect;
      effect = vintageDefaults;
      if (options[0] === "vignette") {
        effect.vignette[options[1]] = value;
      } else if (options[0] === "screen") {
        effect.screen[options[1]] = value;
      } else {
        effect[options[0]] = value;
      }
      return $image.vintage(effect);
    };
    applyEffect = function($image, effect) {
      $image.vintage(effect);
      return $image.data("vintage", effect);
    };
    return pub = {
      init: function() {
        return $.subscribe("/image/update", function($image, effect, value) {
          return updateImage($image, effect, value);
        });
      },
      presets: function() {
        var key, _ref, _results;
        _ref = presets.effects;
        _results = [];
        for (key in _ref) {
          if (!__hasProp.call(_ref, key)) continue;
          _results.push({
            preset: key
          });
        }
        return _results;
      },
      applyPreset: function($img, preset) {
        return applyEffect($img, presets.effects[preset]);
      }
    };
  });

}).call(this);

/*! @source http://purl.eligrey.com/github/BlobBuilder.js/blob/master/BlobBuilder.js */
var BlobBuilder=BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||(function(j){var c=function(v){return Object.prototype.toString.call(v).match(/^\[object\s(.*)\]$/)[1]},u=function(){this.data=[]},t=function(x,v,w){this.data=x;this.size=x.length;this.type=v;this.encoding=w},k=u.prototype,s=t.prototype,n=j.FileReaderSync,a=function(v){this.code=this[this.name=v]},l=("NOT_FOUND_ERR SECURITY_ERR ABORT_ERR NOT_READABLE_ERR ENCODING_ERR NO_MODIFICATION_ALLOWED_ERR INVALID_STATE_ERR SYNTAX_ERR").split(" "),r=l.length,o=j.URL||j.webkitURL||j,p=o.createObjectURL,b=o.revokeObjectURL,e=o,i=j.btoa,f=j.atob,m=false,h=function(v){m=!v},d=j.ArrayBuffer,g=j.Uint8Array;u.fake=s.fake=true;while(r--){a.prototype[l[r]]=r+1}try{if(g){h.apply(0,new g(1))}}catch(q){}if(!o.createObjectURL){e=j.URL={}}e.createObjectURL=function(w){var x=w.type,v;if(x===null){x="application/octet-stream"}if(w instanceof t){v="data:"+x;if(w.encoding==="base64"){return v+";base64,"+w.data}else{if(w.encoding==="URI"){return v+","+decodeURIComponent(w.data)}}if(i){return v+";base64,"+i(w.data)}else{return v+","+encodeURIComponent(w.data)}}else{if(real_create_object_url){return real_create_object_url.call(o,w)}}};e.revokeObjectURL=function(v){if(v.substring(0,5)!=="data:"&&real_revoke_object_url){real_revoke_object_url.call(o,v)}};k.append=function(z){var B=this.data;if(g&&z instanceof d){if(m){B.push(String.fromCharCode.apply(String,new g(z)))}else{var A="",w=new g(z),x=0,y=w.length;for(;x<y;x++){A+=String.fromCharCode(w[x])}}}else{if(c(z)==="Blob"||c(z)==="File"){if(n){var v=new n;B.push(v.readAsBinaryString(z))}else{throw new a("NOT_READABLE_ERR")}}else{if(z instanceof t){if(z.encoding==="base64"&&f){B.push(f(z.data))}else{if(z.encoding==="URI"){B.push(decodeURIComponent(z.data))}else{if(z.encoding==="raw"){B.push(z.data)}}}}else{if(typeof z!=="string"){z+=""}B.push(unescape(encodeURIComponent(z)))}}}};k.getBlob=function(v){if(!arguments.length){v=null}return new t(this.data.join(""),v,"raw")};k.toString=function(){return"[object BlobBuilder]"};s.slice=function(y,v,x){var w=arguments.length;if(w<3){x=null}return new t(this.data.slice(y,w>1?v:this.data.length),x,this.encoding)};s.toString=function(){return"[object Blob]"};return u}(self));
define("mylibs/utils/BlobBuilder.min", function(){});

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
var saveAs=saveAs||(function(h){var r=h.document,l=function(){return h.URL||h.webkitURL||h},e=h.URL||h.webkitURL||h,n=r.createElementNS("http://www.w3.org/1999/xhtml","a"),g="download" in n,j=function(t){var s=r.createEvent("MouseEvents");s.initMouseEvent("click",true,false,h,0,0,0,0,0,false,false,false,false,0,null);return t.dispatchEvent(s)},o=h.webkitRequestFileSystem,p=h.requestFileSystem||o||h.mozRequestFileSystem,m=function(s){(h.setImmediate||h.setTimeout)(function(){throw s},0)},c="application/octet-stream",k=0,b=[],i=function(){var t=b.length;while(t--){var s=b[t];if(typeof s==="string"){e.revokeObjectURL(s)}else{s.remove()}}b.length=0},q=function(t,s,w){s=[].concat(s);var v=s.length;while(v--){var x=t["on"+s[v]];if(typeof x==="function"){try{x.call(t,w||t)}catch(u){m(u)}}}},f=function(t,u){var v=this,B=t.type,E=false,x,w,s=function(){var F=l().createObjectURL(t);b.push(F);return F},A=function(){q(v,"writestart progress write writeend".split(" "))},D=function(){if(E||!x){x=s(t)}w.location.href=x;v.readyState=v.DONE;A()},z=function(F){return function(){if(v.readyState!==v.DONE){return F.apply(this,arguments)}}},y={create:true,exclusive:false},C;v.readyState=v.INIT;if(!u){u="download"}if(g){x=s(t);n.href=x;n.download=u;if(j(n)){v.readyState=v.DONE;A();return}}if(h.chrome&&B&&B!==c){C=t.slice||t.webkitSlice;t=C.call(t,0,t.size,c);E=true}if(o&&u!=="download"){u+=".download"}if(B===c||o){w=h}else{w=h.open()}if(!p){D();return}k+=t.size;p(h.TEMPORARY,k,z(function(F){F.root.getDirectory("saved",y,z(function(G){var H=function(){G.getFile(u,y,z(function(I){I.createWriter(z(function(J){J.onwriteend=function(K){w.location.href=I.toURL();b.push(I);v.readyState=v.DONE;q(v,"writeend",K)};J.onerror=function(){var K=J.error;if(K.code!==K.ABORT_ERR){D()}};"writestart progress write abort".split(" ").forEach(function(K){J["on"+K]=v["on"+K]});J.write(t);v.abort=function(){J.abort();v.readyState=v.DONE};v.readyState=v.WRITING}),D)}),D)};G.getFile(u,{create:false},z(function(I){I.remove();H()}),z(function(I){if(I.code===I.NOT_FOUND_ERR){H()}else{D()}}))}),D)}),D)},d=f.prototype,a=function(s,t){return new f(s,t)};d.abort=function(){var s=this;s.readyState=s.DONE;q(s,"abort")};d.readyState=d.INIT=0;d.WRITING=1;d.DONE=2;d.error=d.onwritestart=d.onprogress=d.onwrite=d.onabort=d.onerror=d.onwriteend=null;h.addEventListener("unload",i,false);return a}(self));
define("mylibs/utils/FileSaver.min", function(){});

/*
 * canvg.js - Javascript SVG parser and renderer on Canvas
 * MIT Licensed 
 * Gabe Lerner (gabelerner@gmail.com)
 * http://code.google.com/p/canvg/
 *
 * Requires: rgbcolor.js - http://www.phpied.com/rgb-color-parser-in-javascript/
 */
if(!window.console) {
	window.console = {};
	window.console.log = function(str) {};
	window.console.dir = function(str) {};
}

if(!Array.prototype.indexOf){
	Array.prototype.indexOf = function(obj){
		for(var i=0; i<this.length; i++){
			if(this[i]==obj){
				return i;
			}
		}
		return -1;
	}
}

(function(){
	// canvg(target, s)
	// empty parameters: replace all 'svg' elements on page with 'canvas' elements
	// target: canvas element or the id of a canvas element
	// s: svg string, url to svg file, or xml document
	// opts: optional hash of options
	//		 ignoreMouse: true => ignore mouse events
	//		 ignoreAnimation: true => ignore animations
	//		 ignoreDimensions: true => does not try to resize canvas
	//		 ignoreClear: true => does not clear canvas
	//		 offsetX: int => draws at a x offset
	//		 offsetY: int => draws at a y offset
	//		 scaleWidth: int => scales horizontally to width
	//		 scaleHeight: int => scales vertically to height
	//		 renderCallback: function => will call the function after the first render is completed
	//		 forceRedraw: function => will call the function on every frame, if it returns true, will redraw
	this.canvg = function (target, s, opts) {
		// no parameters
		if (target == null && s == null && opts == null) {
			var svgTags = document.getElementsByTagName('svg');
			for (var i=0; i<svgTags.length; i++) {
				var svgTag = svgTags[i];
				var c = document.createElement('canvas');
				c.width = svgTag.clientWidth;
				c.height = svgTag.clientHeight;
				svgTag.parentNode.insertBefore(c, svgTag);
				svgTag.parentNode.removeChild(svgTag);
				var div = document.createElement('div');
				div.appendChild(svgTag);
				canvg(c, div.innerHTML);
			}
			return;
		}	
		opts = opts || {};
	
		if (typeof target == 'string') {
			target = document.getElementById(target);
		}
		
		// reuse class per canvas
		var svg;
		if (target.svg == null) {
			svg = build();
			target.svg = svg;
		}
		else {
			svg = target.svg;
			svg.stop();
		}
		svg.opts = opts;
		
		var ctx = target.getContext('2d');
		if (typeof(s.documentElement) != 'undefined') {
			// load from xml doc
			svg.loadXmlDoc(ctx, s);
		}
		else if (s.substr(0,1) == '<') {
			// load from xml string
			svg.loadXml(ctx, s);
		}
		else {
			// load from url
			svg.load(ctx, s);
		}
	}

	function build() {
		var svg = { };
		
		svg.FRAMERATE = 30;
		svg.MAX_VIRTUAL_PIXELS = 30000;
		
		// globals
		svg.init = function(ctx) {
			svg.Definitions = {};
			svg.Styles = {};
			svg.Animations = [];
			svg.Images = [];
			svg.ctx = ctx;
			svg.ViewPort = new (function () {
				this.viewPorts = [];
				this.Clear = function() { this.viewPorts = []; }
				this.SetCurrent = function(width, height) { this.viewPorts.push({ width: width, height: height }); }
				this.RemoveCurrent = function() { this.viewPorts.pop(); }
				this.Current = function() { return this.viewPorts[this.viewPorts.length - 1]; }
				this.width = function() { return this.Current().width; }
				this.height = function() { return this.Current().height; }
				this.ComputeSize = function(d) {
					if (d != null && typeof(d) == 'number') return d;
					if (d == 'x') return this.width();
					if (d == 'y') return this.height();
					return Math.sqrt(Math.pow(this.width(), 2) + Math.pow(this.height(), 2)) / Math.sqrt(2);			
				}
			});
		}
		svg.init();
		
		// images loaded
		svg.ImagesLoaded = function() { 
			for (var i=0; i<svg.Images.length; i++) {
				if (!svg.Images[i].loaded) return false;
			}
			return true;
		}

		// trim
		svg.trim = function(s) { return s.replace(/^\s+|\s+$/g, ''); }
		
		// compress spaces
		svg.compressSpaces = function(s) { return s.replace(/[\s\r\t\n]+/gm,' '); }
		
		// ajax
		svg.ajax = function(url) {
			var AJAX;
			if(window.XMLHttpRequest){AJAX=new XMLHttpRequest();}
			else{AJAX=new ActiveXObject('Microsoft.XMLHTTP');}
			if(AJAX){
			   AJAX.open('GET',url,false);
			   AJAX.send(null);
			   return AJAX.responseText;
			}
			return null;
		} 
		
		// parse xml
		svg.parseXml = function(xml) {
			if (window.DOMParser)
			{
				var parser = new DOMParser();
				return parser.parseFromString(xml, 'text/xml');
			}
			else 
			{
				xml = xml.replace(/<!DOCTYPE svg[^>]*>/, '');
				var xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
				xmlDoc.async = 'false';
				xmlDoc.loadXML(xml); 
				return xmlDoc;
			}		
		}
		
		svg.Property = function(name, value) {
			this.name = name;
			this.value = value;
			
			this.hasValue = function() {
				return (this.value != null && this.value !== '');
			}
							
			// return the numerical value of the property
			this.numValue = function() {
				if (!this.hasValue()) return 0;
				
				var n = parseFloat(this.value);
				if ((this.value + '').match(/%$/)) {
					n = n / 100.0;
				}
				return n;
			}
			
			this.valueOrDefault = function(def) {
				if (this.hasValue()) return this.value;
				return def;
			}
			
			this.numValueOrDefault = function(def) {
				if (this.hasValue()) return this.numValue();
				return def;
			}
			
			/* EXTENSIONS */
			var that = this;
			
			// color extensions
			this.Color = {
				// augment the current color value with the opacity
				addOpacity: function(opacity) {
					var newValue = that.value;
					if (opacity != null && opacity != '') {
						var color = new RGBColor(that.value);
						if (color.ok) {
							newValue = 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + opacity + ')';
						}
					}
					return new svg.Property(that.name, newValue);
				}
			}
			
			// definition extensions
			this.Definition = {
				// get the definition from the definitions table
				getDefinition: function() {
					var name = that.value.replace(/^(url\()?#([^\)]+)\)?$/, '$2');
					return svg.Definitions[name];
				},
				
				isUrl: function() {
					return that.value.indexOf('url(') == 0
				},
				
				getFillStyle: function(e) {
					var def = this.getDefinition();
					
					// gradient
					if (def != null && def.createGradient) {
						return def.createGradient(svg.ctx, e);
					}
					
					// pattern
					if (def != null && def.createPattern) {
						return def.createPattern(svg.ctx, e);
					}
					
					return null;
				}
			}
			
			// length extensions
			this.Length = {
				DPI: function(viewPort) {
					return 96.0; // TODO: compute?
				},
				
				EM: function(viewPort) {
					var em = 12;
					
					var fontSize = new svg.Property('fontSize', svg.Font.Parse(svg.ctx.font).fontSize);
					if (fontSize.hasValue()) em = fontSize.Length.toPixels(viewPort);
					
					return em;
				},
			
				// get the length as pixels
				toPixels: function(viewPort) {
					if (!that.hasValue()) return 0;
					var s = that.value+'';
					if (s.match(/em$/)) return that.numValue() * this.EM(viewPort);
					if (s.match(/ex$/)) return that.numValue() * this.EM(viewPort) / 2.0;
					if (s.match(/px$/)) return that.numValue();
					if (s.match(/pt$/)) return that.numValue() * 1.25;
					if (s.match(/pc$/)) return that.numValue() * 15;
					if (s.match(/cm$/)) return that.numValue() * this.DPI(viewPort) / 2.54;
					if (s.match(/mm$/)) return that.numValue() * this.DPI(viewPort) / 25.4;
					if (s.match(/in$/)) return that.numValue() * this.DPI(viewPort);
					if (s.match(/%$/)) return that.numValue() * svg.ViewPort.ComputeSize(viewPort);
					return that.numValue();
				}
			}
			
			// time extensions
			this.Time = {
				// get the time as milliseconds
				toMilliseconds: function() {
					if (!that.hasValue()) return 0;
					var s = that.value+'';
					if (s.match(/s$/)) return that.numValue() * 1000;
					if (s.match(/ms$/)) return that.numValue();
					return that.numValue();
				}
			}
			
			// angle extensions
			this.Angle = {
				// get the angle as radians
				toRadians: function() {
					if (!that.hasValue()) return 0;
					var s = that.value+'';
					if (s.match(/deg$/)) return that.numValue() * (Math.PI / 180.0);
					if (s.match(/grad$/)) return that.numValue() * (Math.PI / 200.0);
					if (s.match(/rad$/)) return that.numValue();
					return that.numValue() * (Math.PI / 180.0);
				}
			}
		}
		
		// fonts
		svg.Font = new (function() {
			this.Styles = ['normal','italic','oblique','inherit'];
			this.Variants = ['normal','small-caps','inherit'];
			this.Weights = ['normal','bold','bolder','lighter','100','200','300','400','500','600','700','800','900','inherit'];
			
			this.CreateFont = function(fontStyle, fontVariant, fontWeight, fontSize, fontFamily, inherit) { 
				var f = inherit != null ? this.Parse(inherit) : this.CreateFont('', '', '', '', '', svg.ctx.font);
				return { 
					fontFamily: fontFamily || f.fontFamily, 
					fontSize: fontSize || f.fontSize, 
					fontStyle: fontStyle || f.fontStyle, 
					fontWeight: fontWeight || f.fontWeight, 
					fontVariant: fontVariant || f.fontVariant,
					toString: function () { return [this.fontStyle, this.fontVariant, this.fontWeight, this.fontSize, this.fontFamily].join(' ') } 
				} 
			}
			
			var that = this;
			this.Parse = function(s) {
				var f = {};
				var d = svg.trim(svg.compressSpaces(s || '')).split(' ');
				var set = { fontSize: false, fontStyle: false, fontWeight: false, fontVariant: false }
				var ff = '';
				for (var i=0; i<d.length; i++) {
					if (!set.fontStyle && that.Styles.indexOf(d[i]) != -1) { if (d[i] != 'inherit') f.fontStyle = d[i]; set.fontStyle = true; }
					else if (!set.fontVariant && that.Variants.indexOf(d[i]) != -1) { if (d[i] != 'inherit') f.fontVariant = d[i]; set.fontStyle = set.fontVariant = true;	}
					else if (!set.fontWeight && that.Weights.indexOf(d[i]) != -1) {	if (d[i] != 'inherit') f.fontWeight = d[i]; set.fontStyle = set.fontVariant = set.fontWeight = true; }
					else if (!set.fontSize) { if (d[i] != 'inherit') f.fontSize = d[i].split('/')[0]; set.fontStyle = set.fontVariant = set.fontWeight = set.fontSize = true; }
					else { if (d[i] != 'inherit') ff += d[i]; }
				} if (ff != '') f.fontFamily = ff;
				return f;
			}
		});
		
		// points and paths
		svg.ToNumberArray = function(s) {
			var a = svg.trim(svg.compressSpaces((s || '').replace(/,/g, ' '))).split(' ');
			for (var i=0; i<a.length; i++) {
				a[i] = parseFloat(a[i]);
			}
			return a;
		}		
		svg.Point = function(x, y) {
			this.x = x;
			this.y = y;
			
			this.angleTo = function(p) {
				return Math.atan2(p.y - this.y, p.x - this.x);
			}
			
			this.applyTransform = function(v) {
				var xp = this.x * v[0] + this.y * v[2] + v[4];
				var yp = this.x * v[1] + this.y * v[3] + v[5];
				this.x = xp;
				this.y = yp;
			}
		}
		svg.CreatePoint = function(s) {
			var a = svg.ToNumberArray(s);
			return new svg.Point(a[0], a[1]);
		}
		svg.CreatePath = function(s) {
			var a = svg.ToNumberArray(s);
			var path = [];
			for (var i=0; i<a.length; i+=2) {
				path.push(new svg.Point(a[i], a[i+1]));
			}
			return path;
		}
		
		// bounding box
		svg.BoundingBox = function(x1, y1, x2, y2) { // pass in initial points if you want
			this.x1 = Number.NaN;
			this.y1 = Number.NaN;
			this.x2 = Number.NaN;
			this.y2 = Number.NaN;
			
			this.x = function() { return this.x1; }
			this.y = function() { return this.y1; }
			this.width = function() { return this.x2 - this.x1; }
			this.height = function() { return this.y2 - this.y1; }
			
			this.addPoint = function(x, y) {	
				if (x != null) {
					if (isNaN(this.x1) || isNaN(this.x2)) {
						this.x1 = x;
						this.x2 = x;
					}
					if (x < this.x1) this.x1 = x;
					if (x > this.x2) this.x2 = x;
				}
			
				if (y != null) {
					if (isNaN(this.y1) || isNaN(this.y2)) {
						this.y1 = y;
						this.y2 = y;
					}
					if (y < this.y1) this.y1 = y;
					if (y > this.y2) this.y2 = y;
				}
			}			
			this.addX = function(x) { this.addPoint(x, null); }
			this.addY = function(y) { this.addPoint(null, y); }
			
			this.addBoundingBox = function(bb) {
				this.addPoint(bb.x1, bb.y1);
				this.addPoint(bb.x2, bb.y2);
			}
			
			this.addQuadraticCurve = function(p0x, p0y, p1x, p1y, p2x, p2y) {
				var cp1x = p0x + 2/3 * (p1x - p0x); // CP1 = QP0 + 2/3 *(QP1-QP0)
				var cp1y = p0y + 2/3 * (p1y - p0y); // CP1 = QP0 + 2/3 *(QP1-QP0)
				var cp2x = cp1x + 1/3 * (p2x - p0x); // CP2 = CP1 + 1/3 *(QP2-QP0)
				var cp2y = cp1y + 1/3 * (p2y - p0y); // CP2 = CP1 + 1/3 *(QP2-QP0)
				this.addBezierCurve(p0x, p0y, cp1x, cp2x, cp1y,	cp2y, p2x, p2y);
			}
			
			this.addBezierCurve = function(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y) {
				// from http://blog.hackers-cafe.net/2009/06/how-to-calculate-bezier-curves-bounding.html
				var p0 = [p0x, p0y], p1 = [p1x, p1y], p2 = [p2x, p2y], p3 = [p3x, p3y];
				this.addPoint(p0[0], p0[1]);
				this.addPoint(p3[0], p3[1]);
				
				for (i=0; i<=1; i++) {
					var f = function(t) { 
						return Math.pow(1-t, 3) * p0[i]
						+ 3 * Math.pow(1-t, 2) * t * p1[i]
						+ 3 * (1-t) * Math.pow(t, 2) * p2[i]
						+ Math.pow(t, 3) * p3[i];
					}
					
					var b = 6 * p0[i] - 12 * p1[i] + 6 * p2[i];
					var a = -3 * p0[i] + 9 * p1[i] - 9 * p2[i] + 3 * p3[i];
					var c = 3 * p1[i] - 3 * p0[i];
					
					if (a == 0) {
						if (b == 0) continue;
						var t = -c / b;
						if (0 < t && t < 1) {
							if (i == 0) this.addX(f(t));
							if (i == 1) this.addY(f(t));
						}
						continue;
					}
					
					var b2ac = Math.pow(b, 2) - 4 * c * a;
					if (b2ac < 0) continue;
					var t1 = (-b + Math.sqrt(b2ac)) / (2 * a);
					if (0 < t1 && t1 < 1) {
						if (i == 0) this.addX(f(t1));
						if (i == 1) this.addY(f(t1));
					}
					var t2 = (-b - Math.sqrt(b2ac)) / (2 * a);
					if (0 < t2 && t2 < 1) {
						if (i == 0) this.addX(f(t2));
						if (i == 1) this.addY(f(t2));
					}
				}
			}
			
			this.isPointInBox = function(x, y) {
				return (this.x1 <= x && x <= this.x2 && this.y1 <= y && y <= this.y2);
			}
			
			this.addPoint(x1, y1);
			this.addPoint(x2, y2);
		}
		
		// transforms
		svg.Transform = function(v) {	
			var that = this;
			this.Type = {}
		
			// translate
			this.Type.translate = function(s) {
				this.p = svg.CreatePoint(s);			
				this.apply = function(ctx) {
					ctx.translate(this.p.x || 0.0, this.p.y || 0.0);
				}
				this.applyToPoint = function(p) {
					p.applyTransform([1, 0, 0, 1, this.p.x || 0.0, this.p.y || 0.0]);
				}
			}
			
			// rotate
			this.Type.rotate = function(s) {
				var a = svg.ToNumberArray(s);
				this.angle = new svg.Property('angle', a[0]);
				this.cx = a[1] || 0;
				this.cy = a[2] || 0;
				this.apply = function(ctx) {
					ctx.translate(this.cx, this.cy);
					ctx.rotate(this.angle.Angle.toRadians());
					ctx.translate(-this.cx, -this.cy);
				}
				this.applyToPoint = function(p) {
					var a = this.angle.Angle.toRadians();
					p.applyTransform([1, 0, 0, 1, this.p.x || 0.0, this.p.y || 0.0]);
					p.applyTransform([Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0]);
					p.applyTransform([1, 0, 0, 1, -this.p.x || 0.0, -this.p.y || 0.0]);
				}			
			}
			
			this.Type.scale = function(s) {
				this.p = svg.CreatePoint(s);
				this.apply = function(ctx) {
					ctx.scale(this.p.x || 1.0, this.p.y || this.p.x || 1.0);
				}
				this.applyToPoint = function(p) {
					p.applyTransform([this.p.x || 0.0, 0, 0, this.p.y || 0.0, 0, 0]);
				}				
			}
			
			this.Type.matrix = function(s) {
				this.m = svg.ToNumberArray(s);
				this.apply = function(ctx) {
					ctx.transform(this.m[0], this.m[1], this.m[2], this.m[3], this.m[4], this.m[5]);
				}
				this.applyToPoint = function(p) {
					p.applyTransform(this.m);
				}					
			}
			
			this.Type.SkewBase = function(s) {
				this.base = that.Type.matrix;
				this.base(s);
				this.angle = new svg.Property('angle', s);
			}
			this.Type.SkewBase.prototype = new this.Type.matrix;
			
			this.Type.skewX = function(s) {
				this.base = that.Type.SkewBase;
				this.base(s);
				this.m = [1, 0, Math.tan(this.angle.Angle.toRadians()), 1, 0, 0];
			}
			this.Type.skewX.prototype = new this.Type.SkewBase;
			
			this.Type.skewY = function(s) {
				this.base = that.Type.SkewBase;
				this.base(s);
				this.m = [1, Math.tan(this.angle.Angle.toRadians()), 0, 1, 0, 0];
			}
			this.Type.skewY.prototype = new this.Type.SkewBase;
		
			this.transforms = [];
			
			this.apply = function(ctx) {
				for (var i=0; i<this.transforms.length; i++) {
					this.transforms[i].apply(ctx);
				}
			}
			
			this.applyToPoint = function(p) {
				for (var i=0; i<this.transforms.length; i++) {
					this.transforms[i].applyToPoint(p);
				}
			}
			
			var data = svg.trim(svg.compressSpaces(v)).split(/\s(?=[a-z])/);
			for (var i=0; i<data.length; i++) {
				var type = data[i].split('(')[0];
				var s = data[i].split('(')[1].replace(')','');
				var transform = new this.Type[type](s);
				this.transforms.push(transform);
			}
		}
		
		// aspect ratio
		svg.AspectRatio = function(ctx, aspectRatio, width, desiredWidth, height, desiredHeight, minX, minY, refX, refY) {
			// aspect ratio - http://www.w3.org/TR/SVG/coords.html#PreserveAspectRatioAttribute
			aspectRatio = svg.compressSpaces(aspectRatio);
			aspectRatio = aspectRatio.replace(/^defer\s/,''); // ignore defer
			var align = aspectRatio.split(' ')[0] || 'xMidYMid';
			var meetOrSlice = aspectRatio.split(' ')[1] || 'meet';					
	
			// calculate scale
			var scaleX = width / desiredWidth;
			var scaleY = height / desiredHeight;
			var scaleMin = Math.min(scaleX, scaleY);
			var scaleMax = Math.max(scaleX, scaleY);
			if (meetOrSlice == 'meet') { desiredWidth *= scaleMin; desiredHeight *= scaleMin; }
			if (meetOrSlice == 'slice') { desiredWidth *= scaleMax; desiredHeight *= scaleMax; }	
			
			refX = new svg.Property('refX', refX);
			refY = new svg.Property('refY', refY);
			if (refX.hasValue() && refY.hasValue()) {				
				ctx.translate(-scaleMin * refX.Length.toPixels('x'), -scaleMin * refY.Length.toPixels('y'));
			} 
			else {					
				// align
				if (align.match(/^xMid/) && ((meetOrSlice == 'meet' && scaleMin == scaleY) || (meetOrSlice == 'slice' && scaleMax == scaleY))) ctx.translate(width / 2.0 - desiredWidth / 2.0, 0); 
				if (align.match(/YMid$/) && ((meetOrSlice == 'meet' && scaleMin == scaleX) || (meetOrSlice == 'slice' && scaleMax == scaleX))) ctx.translate(0, height / 2.0 - desiredHeight / 2.0); 
				if (align.match(/^xMax/) && ((meetOrSlice == 'meet' && scaleMin == scaleY) || (meetOrSlice == 'slice' && scaleMax == scaleY))) ctx.translate(width - desiredWidth, 0); 
				if (align.match(/YMax$/) && ((meetOrSlice == 'meet' && scaleMin == scaleX) || (meetOrSlice == 'slice' && scaleMax == scaleX))) ctx.translate(0, height - desiredHeight); 
			}
			
			// scale
			if (align == 'none') ctx.scale(scaleX, scaleY);
			else if (meetOrSlice == 'meet') ctx.scale(scaleMin, scaleMin); 
			else if (meetOrSlice == 'slice') ctx.scale(scaleMax, scaleMax); 	
			
			// translate
			ctx.translate(minX == null ? 0 : -minX, minY == null ? 0 : -minY);			
		}
		
		// elements
		svg.Element = {}
		
		svg.Element.ElementBase = function(node) {	
			this.attributes = {};
			this.styles = {};
			this.children = [];
			
			// get or create attribute
			this.attribute = function(name, createIfNotExists) {
				var a = this.attributes[name];
				if (a != null) return a;
							
				a = new svg.Property(name, '');
				if (createIfNotExists == true) this.attributes[name] = a;
				return a;
			}
			
			// get or create style, crawls up node tree
			this.style = function(name, createIfNotExists) {
				var s = this.styles[name];
				if (s != null) return s;
				
				var a = this.attribute(name);
				if (a != null && a.hasValue()) {
					return a;
				}
				
				var p = this.parent;
				if (p != null) {
					var ps = p.style(name);
					if (ps != null && ps.hasValue()) {
						return ps;
					}
				}
					
				s = new svg.Property(name, '');
				if (createIfNotExists == true) this.styles[name] = s;
				return s;
			}
			
			// base render
			this.render = function(ctx) {
				// don't render display=none
				if (this.style('display').value == 'none') return;
				
				// don't render visibility=hidden
				if (this.attribute('visibility').value == 'hidden') return;
			
				ctx.save();
					this.setContext(ctx);
						// mask
						if (this.attribute('mask').hasValue()) {
							var mask = this.attribute('mask').Definition.getDefinition();
							if (mask != null) mask.apply(ctx, this);
						}
						else if (this.style('filter').hasValue()) {
							var filter = this.style('filter').Definition.getDefinition();
							if (filter != null) filter.apply(ctx, this);
						}
						else this.renderChildren(ctx);				
					this.clearContext(ctx);
				ctx.restore();
			}
			
			// base set context
			this.setContext = function(ctx) {
				// OVERRIDE ME!
			}
			
			// base clear context
			this.clearContext = function(ctx) {
				// OVERRIDE ME!
			}			
			
			// base render children
			this.renderChildren = function(ctx) {
				for (var i=0; i<this.children.length; i++) {
					this.children[i].render(ctx);
				}
			}
			
			this.addChild = function(childNode, create) {
				var child = childNode;
				if (create) child = svg.CreateElement(childNode);
				child.parent = this;
				this.children.push(child);			
			}
				
			if (node != null && node.nodeType == 1) { //ELEMENT_NODE
				// add children
				for (var i=0; i<node.childNodes.length; i++) {
					var childNode = node.childNodes[i];
					if (childNode.nodeType == 1) this.addChild(childNode, true); //ELEMENT_NODE
				}
				
				// add attributes
				for (var i=0; i<node.attributes.length; i++) {
					var attribute = node.attributes[i];
					this.attributes[attribute.nodeName] = new svg.Property(attribute.nodeName, attribute.nodeValue);
				}
										
				// add tag styles
				var styles = svg.Styles[node.nodeName];
				if (styles != null) {
					for (var name in styles) {
						this.styles[name] = styles[name];
					}
				}					
				
				// add class styles
				if (this.attribute('class').hasValue()) {
					var classes = svg.compressSpaces(this.attribute('class').value).split(' ');
					for (var j=0; j<classes.length; j++) {
						styles = svg.Styles['.'+classes[j]];
						if (styles != null) {
							for (var name in styles) {
								this.styles[name] = styles[name];
							}
						}
						styles = svg.Styles[node.nodeName+'.'+classes[j]];
						if (styles != null) {
							for (var name in styles) {
								this.styles[name] = styles[name];
							}
						}
					}
				}
				
				// add inline styles
				if (this.attribute('style').hasValue()) {
					var styles = this.attribute('style').value.split(';');
					for (var i=0; i<styles.length; i++) {
						if (svg.trim(styles[i]) != '') {
							var style = styles[i].split(':');
							var name = svg.trim(style[0]);
							var value = svg.trim(style[1]);
							this.styles[name] = new svg.Property(name, value);
						}
					}
				}	

				// add id
				if (this.attribute('id').hasValue()) {
					if (svg.Definitions[this.attribute('id').value] == null) {
						svg.Definitions[this.attribute('id').value] = this;
					}
				}
			}
		}
		
		svg.Element.RenderedElementBase = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);
			
			this.setContext = function(ctx) {
				// fill
				if (this.style('fill').Definition.isUrl()) {
					var fs = this.style('fill').Definition.getFillStyle(this);
					if (fs != null) ctx.fillStyle = fs;
				}
				else if (this.style('fill').hasValue()) {
					var fillStyle = this.style('fill');
					if (this.style('fill-opacity').hasValue()) fillStyle = fillStyle.Color.addOpacity(this.style('fill-opacity').value);
					ctx.fillStyle = (fillStyle.value == 'none' ? 'rgba(0,0,0,0)' : fillStyle.value);
				}
									
				// stroke
				if (this.style('stroke').Definition.isUrl()) {
					var fs = this.style('stroke').Definition.getFillStyle(this);
					if (fs != null) ctx.strokeStyle = fs;
				}
				else if (this.style('stroke').hasValue()) {
					var strokeStyle = this.style('stroke');
					if (this.style('stroke-opacity').hasValue()) strokeStyle = strokeStyle.Color.addOpacity(this.style('stroke-opacity').value);
					ctx.strokeStyle = (strokeStyle.value == 'none' ? 'rgba(0,0,0,0)' : strokeStyle.value);
				}
				if (this.style('stroke-width').hasValue()) ctx.lineWidth = this.style('stroke-width').Length.toPixels();
				if (this.style('stroke-linecap').hasValue()) ctx.lineCap = this.style('stroke-linecap').value;
				if (this.style('stroke-linejoin').hasValue()) ctx.lineJoin = this.style('stroke-linejoin').value;
				if (this.style('stroke-miterlimit').hasValue()) ctx.miterLimit = this.style('stroke-miterlimit').value;

				// font
				if (typeof(ctx.font) != 'undefined') {
					ctx.font = svg.Font.CreateFont( 
						this.style('font-style').value, 
						this.style('font-variant').value, 
						this.style('font-weight').value, 
						this.style('font-size').hasValue() ? this.style('font-size').Length.toPixels() + 'px' : '', 
						this.style('font-family').value).toString();
				}
				
				// transform
				if (this.attribute('transform').hasValue()) { 
					var transform = new svg.Transform(this.attribute('transform').value);
					transform.apply(ctx);
				}
				
				// clip
				if (this.attribute('clip-path').hasValue()) {
					var clip = this.attribute('clip-path').Definition.getDefinition();
					if (clip != null) clip.apply(ctx);
				}
				
				// opacity
				if (this.style('opacity').hasValue()) {
					ctx.globalAlpha = this.style('opacity').numValue();
				}
			}		
		}
		svg.Element.RenderedElementBase.prototype = new svg.Element.ElementBase;
		
		svg.Element.PathElementBase = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);
			
			this.path = function(ctx) {
				if (ctx != null) ctx.beginPath();
				return new svg.BoundingBox();
			}
			
			this.renderChildren = function(ctx) {
				this.path(ctx);
				svg.Mouse.checkPath(this, ctx);
				if (ctx.fillStyle != '') ctx.fill();
				if (ctx.strokeStyle != '') ctx.stroke();
				
				var markers = this.getMarkers();
				if (markers != null) {
					if (this.style('marker-start').Definition.isUrl()) {
						var marker = this.style('marker-start').Definition.getDefinition();
						marker.render(ctx, markers[0][0], markers[0][1]);
					}
					if (this.style('marker-mid').Definition.isUrl()) {
						var marker = this.style('marker-mid').Definition.getDefinition();
						for (var i=1;i<markers.length-1;i++) {
							marker.render(ctx, markers[i][0], markers[i][1]);
						}
					}
					if (this.style('marker-end').Definition.isUrl()) {
						var marker = this.style('marker-end').Definition.getDefinition();
						marker.render(ctx, markers[markers.length-1][0], markers[markers.length-1][1]);
					}
				}					
			}
			
			this.getBoundingBox = function() {
				return this.path();
			}
			
			this.getMarkers = function() {
				return null;
			}
		}
		svg.Element.PathElementBase.prototype = new svg.Element.RenderedElementBase;
		
		// svg element
		svg.Element.svg = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);
			
			this.baseClearContext = this.clearContext;
			this.clearContext = function(ctx) {
				this.baseClearContext(ctx);
				svg.ViewPort.RemoveCurrent();
			}
			
			this.baseSetContext = this.setContext;
			this.setContext = function(ctx) {
				// initial values
				ctx.strokeStyle = 'rgba(0,0,0,0)';
				ctx.lineCap = 'butt';
				ctx.lineJoin = 'miter';
				ctx.miterLimit = 4;			
			
				this.baseSetContext(ctx);
				
				// create new view port
				if (this.attribute('x').hasValue() && this.attribute('y').hasValue()) {
					ctx.translate(this.attribute('x').Length.toPixels('x'), this.attribute('y').Length.toPixels('y'));
				}
				
				var width = svg.ViewPort.width();
				var height = svg.ViewPort.height();
				if (typeof(this.root) == 'undefined' && this.attribute('width').hasValue() && this.attribute('height').hasValue()) {
					width = this.attribute('width').Length.toPixels('x');
					height = this.attribute('height').Length.toPixels('y');
					
					var x = 0;
					var y = 0;
					if (this.attribute('refX').hasValue() && this.attribute('refY').hasValue()) {
						x = -this.attribute('refX').Length.toPixels('x');
						y = -this.attribute('refY').Length.toPixels('y');
					}
					
					ctx.beginPath();
					ctx.moveTo(x, y);
					ctx.lineTo(width, y);
					ctx.lineTo(width, height);
					ctx.lineTo(x, height);
					ctx.closePath();
					ctx.clip();
				}
				svg.ViewPort.SetCurrent(width, height);	
						
				// viewbox
				if (this.attribute('viewBox').hasValue()) {				
					var viewBox = svg.ToNumberArray(this.attribute('viewBox').value);
					var minX = viewBox[0];
					var minY = viewBox[1];
					width = viewBox[2];
					height = viewBox[3];
					
					svg.AspectRatio(ctx,
									this.attribute('preserveAspectRatio').value, 
									svg.ViewPort.width(), 
									width,
									svg.ViewPort.height(),
									height,
									minX,
									minY,
									this.attribute('refX').value,
									this.attribute('refY').value);
										
					svg.ViewPort.RemoveCurrent();	
					svg.ViewPort.SetCurrent(viewBox[2], viewBox[3]);						
				}				
			}
		}
		svg.Element.svg.prototype = new svg.Element.RenderedElementBase;

		// rect element
		svg.Element.rect = function(node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);
			
			this.path = function(ctx) {
				var x = this.attribute('x').Length.toPixels('x');
				var y = this.attribute('y').Length.toPixels('y');
				var width = this.attribute('width').Length.toPixels('x');
				var height = this.attribute('height').Length.toPixels('y');
				var rx = this.attribute('rx').Length.toPixels('x');
				var ry = this.attribute('ry').Length.toPixels('y');
				if (this.attribute('rx').hasValue() && !this.attribute('ry').hasValue()) ry = rx;
				if (this.attribute('ry').hasValue() && !this.attribute('rx').hasValue()) rx = ry;
				
				if (ctx != null) {
					ctx.beginPath();
					ctx.moveTo(x + rx, y);
					ctx.lineTo(x + width - rx, y);
					ctx.quadraticCurveTo(x + width, y, x + width, y + ry)
					ctx.lineTo(x + width, y + height - ry);
					ctx.quadraticCurveTo(x + width, y + height, x + width - rx, y + height)
					ctx.lineTo(x + rx, y + height);
					ctx.quadraticCurveTo(x, y + height, x, y + height - ry)
					ctx.lineTo(x, y + ry);
					ctx.quadraticCurveTo(x, y, x + rx, y)
					ctx.closePath();
				}
				
				return new svg.BoundingBox(x, y, x + width, y + height);
			}
		}
		svg.Element.rect.prototype = new svg.Element.PathElementBase;
		
		// circle element
		svg.Element.circle = function(node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);
			
			this.path = function(ctx) {
				var cx = this.attribute('cx').Length.toPixels('x');
				var cy = this.attribute('cy').Length.toPixels('y');
				var r = this.attribute('r').Length.toPixels();
			
				if (ctx != null) {
					ctx.beginPath();
					ctx.arc(cx, cy, r, 0, Math.PI * 2, true); 
					ctx.closePath();
				}
				
				return new svg.BoundingBox(cx - r, cy - r, cx + r, cy + r);
			}
		}
		svg.Element.circle.prototype = new svg.Element.PathElementBase;	

		// ellipse element
		svg.Element.ellipse = function(node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);
			
			this.path = function(ctx) {
				var KAPPA = 4 * ((Math.sqrt(2) - 1) / 3);
				var rx = this.attribute('rx').Length.toPixels('x');
				var ry = this.attribute('ry').Length.toPixels('y');
				var cx = this.attribute('cx').Length.toPixels('x');
				var cy = this.attribute('cy').Length.toPixels('y');
				
				if (ctx != null) {
					ctx.beginPath();
					ctx.moveTo(cx, cy - ry);
					ctx.bezierCurveTo(cx + (KAPPA * rx), cy - ry,  cx + rx, cy - (KAPPA * ry), cx + rx, cy);
					ctx.bezierCurveTo(cx + rx, cy + (KAPPA * ry), cx + (KAPPA * rx), cy + ry, cx, cy + ry);
					ctx.bezierCurveTo(cx - (KAPPA * rx), cy + ry, cx - rx, cy + (KAPPA * ry), cx - rx, cy);
					ctx.bezierCurveTo(cx - rx, cy - (KAPPA * ry), cx - (KAPPA * rx), cy - ry, cx, cy - ry);
					ctx.closePath();
				}
				
				return new svg.BoundingBox(cx - rx, cy - ry, cx + rx, cy + ry);
			}
		}
		svg.Element.ellipse.prototype = new svg.Element.PathElementBase;			
		
		// line element
		svg.Element.line = function(node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);
			
			this.getPoints = function() {
				return [
					new svg.Point(this.attribute('x1').Length.toPixels('x'), this.attribute('y1').Length.toPixels('y')),
					new svg.Point(this.attribute('x2').Length.toPixels('x'), this.attribute('y2').Length.toPixels('y'))];
			}
								
			this.path = function(ctx) {
				var points = this.getPoints();
				
				if (ctx != null) {
					ctx.beginPath();
					ctx.moveTo(points[0].x, points[0].y);
					ctx.lineTo(points[1].x, points[1].y);
				}
				
				return new svg.BoundingBox(points[0].x, points[0].y, points[1].x, points[1].y);
			}
			
			this.getMarkers = function() {
				var points = this.getPoints();	
				var a = points[0].angleTo(points[1]);
				return [[points[0], a], [points[1], a]];
			}
		}
		svg.Element.line.prototype = new svg.Element.PathElementBase;		
				
		// polyline element
		svg.Element.polyline = function(node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);
			
			this.points = svg.CreatePath(this.attribute('points').value);
			this.path = function(ctx) {
				var bb = new svg.BoundingBox(this.points[0].x, this.points[0].y);
				if (ctx != null) {
					ctx.beginPath();
					ctx.moveTo(this.points[0].x, this.points[0].y);
				}
				for (var i=1; i<this.points.length; i++) {
					bb.addPoint(this.points[i].x, this.points[i].y);
					if (ctx != null) ctx.lineTo(this.points[i].x, this.points[i].y);
				}
				return bb;
			}
			
			this.getMarkers = function() {
				var markers = [];
				for (var i=0; i<this.points.length - 1; i++) {
					markers.push([this.points[i], this.points[i].angleTo(this.points[i+1])]);
				}
				markers.push([this.points[this.points.length-1], markers[markers.length-1][1]]);
				return markers;
			}			
		}
		svg.Element.polyline.prototype = new svg.Element.PathElementBase;				
				
		// polygon element
		svg.Element.polygon = function(node) {
			this.base = svg.Element.polyline;
			this.base(node);
			
			this.basePath = this.path;
			this.path = function(ctx) {
				var bb = this.basePath(ctx);
				if (ctx != null) {
					ctx.lineTo(this.points[0].x, this.points[0].y);
					ctx.closePath();
				}
				return bb;
			}
		}
		svg.Element.polygon.prototype = new svg.Element.polyline;

		// path element
		svg.Element.path = function(node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);
					
			var d = this.attribute('d').value;
			// TODO: convert to real lexer based on http://www.w3.org/TR/SVG11/paths.html#PathDataBNF
			d = d.replace(/,/gm,' '); // get rid of all commas
			d = d.replace(/([MmZzLlHhVvCcSsQqTtAa])([MmZzLlHhVvCcSsQqTtAa])/gm,'$1 $2'); // separate commands from commands
			d = d.replace(/([MmZzLlHhVvCcSsQqTtAa])([MmZzLlHhVvCcSsQqTtAa])/gm,'$1 $2'); // separate commands from commands
			d = d.replace(/([MmZzLlHhVvCcSsQqTtAa])([^\s])/gm,'$1 $2'); // separate commands from points
			d = d.replace(/([^\s])([MmZzLlHhVvCcSsQqTtAa])/gm,'$1 $2'); // separate commands from points
			d = d.replace(/([0-9])([+\-])/gm,'$1 $2'); // separate digits when no comma
			d = d.replace(/(\.[0-9]*)(\.)/gm,'$1 $2'); // separate digits when no comma
			d = d.replace(/([Aa](\s+[0-9]+){3})\s+([01])\s*([01])/gm,'$1 $3 $4 '); // shorthand elliptical arc path syntax
			d = svg.compressSpaces(d); // compress multiple spaces
			d = svg.trim(d);
			this.PathParser = new (function(d) {
				this.tokens = d.split(' ');
				
				this.reset = function() {
					this.i = -1;
					this.command = '';
					this.previousCommand = '';
					this.start = new svg.Point(0, 0);
					this.control = new svg.Point(0, 0);
					this.current = new svg.Point(0, 0);
					this.points = [];
					this.angles = [];
				}
								
				this.isEnd = function() {
					return this.i >= this.tokens.length - 1;
				}
				
				this.isCommandOrEnd = function() {
					if (this.isEnd()) return true;
					return this.tokens[this.i + 1].match(/^[A-Za-z]$/) != null;
				}
				
				this.isRelativeCommand = function() {
					return this.command == this.command.toLowerCase();
				}
							
				this.getToken = function() {
					this.i = this.i + 1;
					return this.tokens[this.i];
				}
				
				this.getScalar = function() {
					return parseFloat(this.getToken());
				}
				
				this.nextCommand = function() {
					this.previousCommand = this.command;
					this.command = this.getToken();
				}				
				
				this.getPoint = function() {
					var p = new svg.Point(this.getScalar(), this.getScalar());
					return this.makeAbsolute(p);
				}
				
				this.getAsControlPoint = function() {
					var p = this.getPoint();
					this.control = p;
					return p;
				}
				
				this.getAsCurrentPoint = function() {
					var p = this.getPoint();
					this.current = p;
					return p;	
				}
				
				this.getReflectedControlPoint = function() {
					if (this.previousCommand.toLowerCase() != 'c' && this.previousCommand.toLowerCase() != 's') {
						return this.current;
					}
					
					// reflect point
					var p = new svg.Point(2 * this.current.x - this.control.x, 2 * this.current.y - this.control.y);					
					return p;
				}
				
				this.makeAbsolute = function(p) {
					if (this.isRelativeCommand()) {
						p.x = this.current.x + p.x;
						p.y = this.current.y + p.y;
					}
					return p;
				}
				
				this.addMarker = function(p, from, priorTo) {
					// if the last angle isn't filled in because we didn't have this point yet ...
					if (priorTo != null && this.angles.length > 0 && this.angles[this.angles.length-1] == null) {
						this.angles[this.angles.length-1] = this.points[this.points.length-1].angleTo(priorTo);
					}
					this.addMarkerAngle(p, from == null ? null : from.angleTo(p));
				}
				
				this.addMarkerAngle = function(p, a) {
					this.points.push(p);
					this.angles.push(a);
				}				
				
				this.getMarkerPoints = function() { return this.points; }
				this.getMarkerAngles = function() {
					for (var i=0; i<this.angles.length; i++) {
						if (this.angles[i] == null) {
							for (var j=i+1; j<this.angles.length; j++) {
								if (this.angles[j] != null) {
									this.angles[i] = this.angles[j];
									break;
								}
							}
						}
					}
					return this.angles;
				}
			})(d);

			this.path = function(ctx) {
				var pp = this.PathParser;
				pp.reset();

				var bb = new svg.BoundingBox();
				if (ctx != null) ctx.beginPath();
				while (!pp.isEnd()) {
					pp.nextCommand();
					switch (pp.command.toUpperCase()) {
					case 'M':
						var p = pp.getAsCurrentPoint();
						pp.addMarker(p);
						bb.addPoint(p.x, p.y);
						if (ctx != null) ctx.moveTo(p.x, p.y);
						pp.start = pp.current;
						while (!pp.isCommandOrEnd()) {
							var p = pp.getAsCurrentPoint();
							pp.addMarker(p, pp.start);
							bb.addPoint(p.x, p.y);
							if (ctx != null) ctx.lineTo(p.x, p.y);
						}
						break;
					case 'L':
						while (!pp.isCommandOrEnd()) {
							var c = pp.current;
							var p = pp.getAsCurrentPoint();
							pp.addMarker(p, c);
							bb.addPoint(p.x, p.y);
							if (ctx != null) ctx.lineTo(p.x, p.y);
						}
						break;
					case 'H':
						while (!pp.isCommandOrEnd()) {
							var newP = new svg.Point((pp.isRelativeCommand() ? pp.current.x : 0) + pp.getScalar(), pp.current.y);
							pp.addMarker(newP, pp.current);
							pp.current = newP;
							bb.addPoint(pp.current.x, pp.current.y);
							if (ctx != null) ctx.lineTo(pp.current.x, pp.current.y);
						}
						break;
					case 'V':
						while (!pp.isCommandOrEnd()) {
							var newP = new svg.Point(pp.current.x, (pp.isRelativeCommand() ? pp.current.y : 0) + pp.getScalar());
							pp.addMarker(newP, pp.current);
							pp.current = newP;
							bb.addPoint(pp.current.x, pp.current.y);
							if (ctx != null) ctx.lineTo(pp.current.x, pp.current.y);
						}
						break;
					case 'C':
						while (!pp.isCommandOrEnd()) {
							var curr = pp.current;
							var p1 = pp.getPoint();
							var cntrl = pp.getAsControlPoint();
							var cp = pp.getAsCurrentPoint();
							pp.addMarker(cp, cntrl, p1);
							bb.addBezierCurve(curr.x, curr.y, p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
							if (ctx != null) ctx.bezierCurveTo(p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
						}
						break;
					case 'S':
						while (!pp.isCommandOrEnd()) {
							var curr = pp.current;
							var p1 = pp.getReflectedControlPoint();
							var cntrl = pp.getAsControlPoint();
							var cp = pp.getAsCurrentPoint();
							pp.addMarker(cp, cntrl, p1);
							bb.addBezierCurve(curr.x, curr.y, p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
							if (ctx != null) ctx.bezierCurveTo(p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
						}
						break;
					case 'Q':
						while (!pp.isCommandOrEnd()) {
							var curr = pp.current;
							var cntrl = pp.getAsControlPoint();
							var cp = pp.getAsCurrentPoint();
							pp.addMarker(cp, cntrl, cntrl);
							bb.addQuadraticCurve(curr.x, curr.y, cntrl.x, cntrl.y, cp.x, cp.y);
							if (ctx != null) ctx.quadraticCurveTo(cntrl.x, cntrl.y, cp.x, cp.y);
						}
						break;
					case 'T':
						while (!pp.isCommandOrEnd()) {
							var curr = pp.current;
							var cntrl = pp.getReflectedControlPoint();
							pp.control = cntrl;
							var cp = pp.getAsCurrentPoint();
							pp.addMarker(cp, cntrl, cntrl);
							bb.addQuadraticCurve(curr.x, curr.y, cntrl.x, cntrl.y, cp.x, cp.y);
							if (ctx != null) ctx.quadraticCurveTo(cntrl.x, cntrl.y, cp.x, cp.y);
						}
						break;
					case 'A':
						while (!pp.isCommandOrEnd()) {
						    var curr = pp.current;
							var rx = pp.getScalar();
							var ry = pp.getScalar();
							var xAxisRotation = pp.getScalar() * (Math.PI / 180.0);
							var largeArcFlag = pp.getScalar();
							var sweepFlag = pp.getScalar();
							var cp = pp.getAsCurrentPoint();

							// Conversion from endpoint to center parameterization
							// http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
							// x1', y1'
							var currp = new svg.Point(
								Math.cos(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.sin(xAxisRotation) * (curr.y - cp.y) / 2.0,
								-Math.sin(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.cos(xAxisRotation) * (curr.y - cp.y) / 2.0
							);
							// adjust radii
							var l = Math.pow(currp.x,2)/Math.pow(rx,2)+Math.pow(currp.y,2)/Math.pow(ry,2);
							if (l > 1) {
								rx *= Math.sqrt(l);
								ry *= Math.sqrt(l);
							}
							// cx', cy'
							var s = (largeArcFlag == sweepFlag ? -1 : 1) * Math.sqrt(
								((Math.pow(rx,2)*Math.pow(ry,2))-(Math.pow(rx,2)*Math.pow(currp.y,2))-(Math.pow(ry,2)*Math.pow(currp.x,2))) /
								(Math.pow(rx,2)*Math.pow(currp.y,2)+Math.pow(ry,2)*Math.pow(currp.x,2))
							);
							if (isNaN(s)) s = 0;
							var cpp = new svg.Point(s * rx * currp.y / ry, s * -ry * currp.x / rx);
							// cx, cy
							var centp = new svg.Point(
								(curr.x + cp.x) / 2.0 + Math.cos(xAxisRotation) * cpp.x - Math.sin(xAxisRotation) * cpp.y,
								(curr.y + cp.y) / 2.0 + Math.sin(xAxisRotation) * cpp.x + Math.cos(xAxisRotation) * cpp.y
							);
							// vector magnitude
							var m = function(v) { return Math.sqrt(Math.pow(v[0],2) + Math.pow(v[1],2)); }
							// ratio between two vectors
							var r = function(u, v) { return (u[0]*v[0]+u[1]*v[1]) / (m(u)*m(v)) }
							// angle between two vectors
							var a = function(u, v) { return (u[0]*v[1] < u[1]*v[0] ? -1 : 1) * Math.acos(r(u,v)); }
							// initial angle
							var a1 = a([1,0], [(currp.x-cpp.x)/rx,(currp.y-cpp.y)/ry]);
							// angle delta
							var u = [(currp.x-cpp.x)/rx,(currp.y-cpp.y)/ry];
							var v = [(-currp.x-cpp.x)/rx,(-currp.y-cpp.y)/ry];
							var ad = a(u, v);
							if (r(u,v) <= -1) ad = Math.PI;
							if (r(u,v) >= 1) ad = 0;

							if (sweepFlag == 0 && ad > 0) ad = ad - 2 * Math.PI;
							if (sweepFlag == 1 && ad < 0) ad = ad + 2 * Math.PI;

							// for markers
							var halfWay = new svg.Point(
								centp.x - rx * Math.cos((a1 + ad) / 2),
								centp.y - ry * Math.sin((a1 + ad) / 2)
							);
							pp.addMarkerAngle(halfWay, (a1 + ad) / 2 + (sweepFlag == 0 ? 1 : -1) * Math.PI / 2);
							pp.addMarkerAngle(cp, ad + (sweepFlag == 0 ? 1 : -1) * Math.PI / 2);

							bb.addPoint(cp.x, cp.y); // TODO: this is too naive, make it better
							if (ctx != null) {
								var r = rx > ry ? rx : ry;
								var sx = rx > ry ? 1 : rx / ry;
								var sy = rx > ry ? ry / rx : 1;

								ctx.translate(centp.x, centp.y);
								ctx.rotate(xAxisRotation);
								ctx.scale(sx, sy);
								ctx.arc(0, 0, r, a1, a1 + ad, 1 - sweepFlag);
								ctx.scale(1/sx, 1/sy);
								ctx.rotate(-xAxisRotation);
								ctx.translate(-centp.x, -centp.y);
							}
						}
						break;
					case 'Z':
						if (ctx != null) ctx.closePath();
						pp.current = pp.start;
					}
				}

				return bb;
			}

			this.getMarkers = function() {
				var points = this.PathParser.getMarkerPoints();
				var angles = this.PathParser.getMarkerAngles();
				
				var markers = [];
				for (var i=0; i<points.length; i++) {
					markers.push([points[i], angles[i]]);
				}
				return markers;
			}
		}
		svg.Element.path.prototype = new svg.Element.PathElementBase;
		
		// pattern element
		svg.Element.pattern = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);
			
			this.createPattern = function(ctx, element) {
				// render me using a temporary svg element
				var tempSvg = new svg.Element.svg();
				tempSvg.attributes['viewBox'] = new svg.Property('viewBox', this.attribute('viewBox').value);
				tempSvg.attributes['x'] = new svg.Property('x', this.attribute('x').value);
				tempSvg.attributes['y'] = new svg.Property('y', this.attribute('y').value);
				tempSvg.attributes['width'] = new svg.Property('width', this.attribute('width').value);
				tempSvg.attributes['height'] = new svg.Property('height', this.attribute('height').value);
				tempSvg.children = this.children;
				
				var c = document.createElement('canvas');
				c.width = this.attribute('width').Length.toPixels('x');
				c.height = this.attribute('height').Length.toPixels('y');
				tempSvg.render(c.getContext('2d'));		
				return ctx.createPattern(c, 'repeat');
			}
		}
		svg.Element.pattern.prototype = new svg.Element.ElementBase;
		
		// marker element
		svg.Element.marker = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);
			
			this.baseRender = this.render;
			this.render = function(ctx, point, angle) {
				ctx.translate(point.x, point.y);
				if (this.attribute('orient').valueOrDefault('auto') == 'auto') ctx.rotate(angle);
				if (this.attribute('markerUnits').valueOrDefault('strokeWidth') == 'strokeWidth') ctx.scale(ctx.lineWidth, ctx.lineWidth);
				ctx.save();
							
				// render me using a temporary svg element
				var tempSvg = new svg.Element.svg();
				tempSvg.attributes['viewBox'] = new svg.Property('viewBox', this.attribute('viewBox').value);
				tempSvg.attributes['refX'] = new svg.Property('refX', this.attribute('refX').value);
				tempSvg.attributes['refY'] = new svg.Property('refY', this.attribute('refY').value);
				tempSvg.attributes['width'] = new svg.Property('width', this.attribute('markerWidth').value);
				tempSvg.attributes['height'] = new svg.Property('height', this.attribute('markerHeight').value);
				tempSvg.attributes['fill'] = new svg.Property('fill', this.attribute('fill').valueOrDefault('black'));
				tempSvg.attributes['stroke'] = new svg.Property('stroke', this.attribute('stroke').valueOrDefault('none'));
				tempSvg.children = this.children;
				tempSvg.render(ctx);
				
				ctx.restore();
				if (this.attribute('markerUnits').valueOrDefault('strokeWidth') == 'strokeWidth') ctx.scale(1/ctx.lineWidth, 1/ctx.lineWidth);
				if (this.attribute('orient').valueOrDefault('auto') == 'auto') ctx.rotate(-angle);
				ctx.translate(-point.x, -point.y);
			}
		}
		svg.Element.marker.prototype = new svg.Element.ElementBase;
		
		// definitions element
		svg.Element.defs = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);	
			
			this.render = function(ctx) {
				// NOOP
			}
		}
		svg.Element.defs.prototype = new svg.Element.ElementBase;
		
		// base for gradients
		svg.Element.GradientBase = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);
			
			this.gradientUnits = this.attribute('gradientUnits').valueOrDefault('objectBoundingBox');
			
			this.stops = [];			
			for (var i=0; i<this.children.length; i++) {
				var child = this.children[i];
				this.stops.push(child);
			}	
			
			this.getGradient = function() {
				// OVERRIDE ME!
			}			

			this.createGradient = function(ctx, element) {
				var stopsContainer = this;
				if (this.attribute('xlink:href').hasValue()) {
					stopsContainer = this.attribute('xlink:href').Definition.getDefinition();
				}
			
				var g = this.getGradient(ctx, element);
				for (var i=0; i<stopsContainer.stops.length; i++) {
					g.addColorStop(stopsContainer.stops[i].offset, stopsContainer.stops[i].color);
				}
				
				if (this.attribute('gradientTransform').hasValue()) {
					// render as transformed pattern on temporary canvas
					var rootView = svg.ViewPort.viewPorts[0];
					
					var rect = new svg.Element.rect();
					rect.attributes['x'] = new svg.Property('x', -svg.MAX_VIRTUAL_PIXELS/3.0);
					rect.attributes['y'] = new svg.Property('y', -svg.MAX_VIRTUAL_PIXELS/3.0);
					rect.attributes['width'] = new svg.Property('width', svg.MAX_VIRTUAL_PIXELS);
					rect.attributes['height'] = new svg.Property('height', svg.MAX_VIRTUAL_PIXELS);
					
					var group = new svg.Element.g();
					group.attributes['transform'] = new svg.Property('transform', this.attribute('gradientTransform').value);
					group.children = [ rect ];
					
					var tempSvg = new svg.Element.svg();
					tempSvg.attributes['x'] = new svg.Property('x', 0);
					tempSvg.attributes['y'] = new svg.Property('y', 0);
					tempSvg.attributes['width'] = new svg.Property('width', rootView.width);
					tempSvg.attributes['height'] = new svg.Property('height', rootView.height);
					tempSvg.children = [ group ];
					
					var c = document.createElement('canvas');
					c.width = rootView.width;
					c.height = rootView.height;
					var tempCtx = c.getContext('2d');
					tempCtx.fillStyle = g;
					tempSvg.render(tempCtx);		
					return tempCtx.createPattern(c, 'no-repeat');
				}
				
				return g;				
			}
		}
		svg.Element.GradientBase.prototype = new svg.Element.ElementBase;
		
		// linear gradient element
		svg.Element.linearGradient = function(node) {
			this.base = svg.Element.GradientBase;
			this.base(node);
			
			this.getGradient = function(ctx, element) {
				var bb = element.getBoundingBox();
				
				var x1 = (this.gradientUnits == 'objectBoundingBox' 
					? bb.x() + bb.width() * this.attribute('x1').numValue() 
					: this.attribute('x1').Length.toPixels('x'));
				var y1 = (this.gradientUnits == 'objectBoundingBox' 
					? bb.y() + bb.height() * this.attribute('y1').numValue()
					: this.attribute('y1').Length.toPixels('y'));
				var x2 = (this.gradientUnits == 'objectBoundingBox' 
					? bb.x() + bb.width() * this.attribute('x2').numValue()
					: this.attribute('x2').Length.toPixels('x'));
				var y2 = (this.gradientUnits == 'objectBoundingBox' 
					? bb.y() + bb.height() * this.attribute('y2').numValue()
					: this.attribute('y2').Length.toPixels('y'));

				return ctx.createLinearGradient(x1, y1, x2, y2);
			}
		}
		svg.Element.linearGradient.prototype = new svg.Element.GradientBase;
		
		// radial gradient element
		svg.Element.radialGradient = function(node) {
			this.base = svg.Element.GradientBase;
			this.base(node);
			
			this.getGradient = function(ctx, element) {
				var bb = element.getBoundingBox();
				
				var cx = (this.gradientUnits == 'objectBoundingBox' 
					? bb.x() + bb.width() * this.attribute('cx').numValue() 
					: this.attribute('cx').Length.toPixels('x'));
				var cy = (this.gradientUnits == 'objectBoundingBox' 
					? bb.y() + bb.height() * this.attribute('cy').numValue() 
					: this.attribute('cy').Length.toPixels('y'));
				
				var fx = cx;
				var fy = cy;
				if (this.attribute('fx').hasValue()) {
					fx = (this.gradientUnits == 'objectBoundingBox' 
					? bb.x() + bb.width() * this.attribute('fx').numValue() 
					: this.attribute('fx').Length.toPixels('x'));
				}
				if (this.attribute('fy').hasValue()) {
					fy = (this.gradientUnits == 'objectBoundingBox' 
					? bb.y() + bb.height() * this.attribute('fy').numValue() 
					: this.attribute('fy').Length.toPixels('y'));
				}
				
				var r = (this.gradientUnits == 'objectBoundingBox' 
					? (bb.width() + bb.height()) / 2.0 * this.attribute('r').numValue()
					: this.attribute('r').Length.toPixels());
				
				return ctx.createRadialGradient(fx, fy, 0, cx, cy, r);
			}
		}
		svg.Element.radialGradient.prototype = new svg.Element.GradientBase;
		
		// gradient stop element
		svg.Element.stop = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);
			
			this.offset = this.attribute('offset').numValue();
			
			var stopColor = this.style('stop-color');
			if (this.style('stop-opacity').hasValue()) stopColor = stopColor.Color.addOpacity(this.style('stop-opacity').value);
			this.color = stopColor.value;
		}
		svg.Element.stop.prototype = new svg.Element.ElementBase;
		
		// animation base element
		svg.Element.AnimateBase = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);
			
			svg.Animations.push(this);
			
			this.duration = 0.0;
			this.begin = this.attribute('begin').Time.toMilliseconds();
			this.maxDuration = this.begin + this.attribute('dur').Time.toMilliseconds();
			
			this.getProperty = function() {
				var attributeType = this.attribute('attributeType').value;
				var attributeName = this.attribute('attributeName').value;
				
				if (attributeType == 'CSS') {
					return this.parent.style(attributeName, true);
				}
				return this.parent.attribute(attributeName, true);			
			};
			
			this.initialValue = null;
			this.removed = false;			

			this.calcValue = function() {
				// OVERRIDE ME!
				return '';
			}
			
			this.update = function(delta) {	
				// set initial value
				if (this.initialValue == null) {
					this.initialValue = this.getProperty().value;
				}
			
				// if we're past the end time
				if (this.duration > this.maxDuration) {
					// loop for indefinitely repeating animations
					if (this.attribute('repeatCount').value == 'indefinite') {
						this.duration = 0.0
					}
					else if (this.attribute('fill').valueOrDefault('remove') == 'remove' && !this.removed) {
						this.removed = true;
						this.getProperty().value = this.initialValue;
						return true;
					}
					else {
						return false; // no updates made
					}
				}			
				this.duration = this.duration + delta;
			
				// if we're past the begin time
				var updated = false;
				if (this.begin < this.duration) {
					var newValue = this.calcValue(); // tween
					
					if (this.attribute('type').hasValue()) {
						// for transform, etc.
						var type = this.attribute('type').value;
						newValue = type + '(' + newValue + ')';
					}
					
					this.getProperty().value = newValue;
					updated = true;
				}
				
				return updated;
			}
			
			// fraction of duration we've covered
			this.progress = function() {
				return ((this.duration - this.begin) / (this.maxDuration - this.begin));
			}			
		}
		svg.Element.AnimateBase.prototype = new svg.Element.ElementBase;
		
		// animate element
		svg.Element.animate = function(node) {
			this.base = svg.Element.AnimateBase;
			this.base(node);
			
			this.calcValue = function() {
				var from = this.attribute('from').numValue();
				var to = this.attribute('to').numValue();
				
				// tween value linearly
				return from + (to - from) * this.progress(); 
			};
		}
		svg.Element.animate.prototype = new svg.Element.AnimateBase;
			
		// animate color element
		svg.Element.animateColor = function(node) {
			this.base = svg.Element.AnimateBase;
			this.base(node);

			this.calcValue = function() {
				var from = new RGBColor(this.attribute('from').value);
				var to = new RGBColor(this.attribute('to').value);
				
				if (from.ok && to.ok) {
					// tween color linearly
					var r = from.r + (to.r - from.r) * this.progress();
					var g = from.g + (to.g - from.g) * this.progress();
					var b = from.b + (to.b - from.b) * this.progress();
					return 'rgb('+parseInt(r,10)+','+parseInt(g,10)+','+parseInt(b,10)+')';
				}
				return this.attribute('from').value;
			};
		}
		svg.Element.animateColor.prototype = new svg.Element.AnimateBase;
		
		// animate transform element
		svg.Element.animateTransform = function(node) {
			this.base = svg.Element.animate;
			this.base(node);
		}
		svg.Element.animateTransform.prototype = new svg.Element.animate;
		
		// font element
		svg.Element.font = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.horizAdvX = this.attribute('horiz-adv-x').numValue();			
			
			this.isRTL = false;
			this.isArabic = false;
			this.fontFace = null;
			this.missingGlyph = null;
			this.glyphs = [];			
			for (var i=0; i<this.children.length; i++) {
				var child = this.children[i];
				if (child.type == 'font-face') {
					this.fontFace = child;
					if (child.style('font-family').hasValue()) {
						svg.Definitions[child.style('font-family').value] = this;
					}
				}
				else if (child.type == 'missing-glyph') this.missingGlyph = child;
				else if (child.type == 'glyph') {
					if (child.arabicForm != '') {
						this.isRTL = true;
						this.isArabic = true;
						if (typeof(this.glyphs[child.unicode]) == 'undefined') this.glyphs[child.unicode] = [];
						this.glyphs[child.unicode][child.arabicForm] = child;
					}
					else {
						this.glyphs[child.unicode] = child;
					}
				}
			}	
		}
		svg.Element.font.prototype = new svg.Element.ElementBase;
		
		// font-face element
		svg.Element.fontface = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);	
			
			this.ascent = this.attribute('ascent').value;
			this.descent = this.attribute('descent').value;
			this.unitsPerEm = this.attribute('units-per-em').numValue();				
		}
		svg.Element.fontface.prototype = new svg.Element.ElementBase;
		
		// missing-glyph element
		svg.Element.missingglyph = function(node) {
			this.base = svg.Element.path;
			this.base(node);	
			
			this.horizAdvX = 0;
		}
		svg.Element.missingglyph.prototype = new svg.Element.path;
		
		// glyph element
		svg.Element.glyph = function(node) {
			this.base = svg.Element.path;
			this.base(node);	
			
			this.horizAdvX = this.attribute('horiz-adv-x').numValue();
			this.unicode = this.attribute('unicode').value;
			this.arabicForm = this.attribute('arabic-form').value;
		}
		svg.Element.glyph.prototype = new svg.Element.path;
		
		// text element
		svg.Element.text = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);
			
			if (node != null) {
				// add children
				this.children = [];
				for (var i=0; i<node.childNodes.length; i++) {
					var childNode = node.childNodes[i];
					if (childNode.nodeType == 1) { // capture tspan and tref nodes
						this.addChild(childNode, true);
					}
					else if (childNode.nodeType == 3) { // capture text
						this.addChild(new svg.Element.tspan(childNode), false);
					}
				}
			}
			
			this.baseSetContext = this.setContext;
			this.setContext = function(ctx) {
				this.baseSetContext(ctx);
				if (this.style('dominant-baseline').hasValue()) ctx.textBaseline = this.style('dominant-baseline').value;
				if (this.style('alignment-baseline').hasValue()) ctx.textBaseline = this.style('alignment-baseline').value;
			}
			
			this.renderChildren = function(ctx) {
				var textAnchor = this.style('text-anchor').valueOrDefault('start');
				var x = this.attribute('x').Length.toPixels('x');
				var y = this.attribute('y').Length.toPixels('y');
				for (var i=0; i<this.children.length; i++) {
					var child = this.children[i];
				
					if (child.attribute('x').hasValue()) {
						child.x = child.attribute('x').Length.toPixels('x');
					}
					else {
						if (child.attribute('dx').hasValue()) x += child.attribute('dx').Length.toPixels('x');
						child.x = x;
					}
					
					var childLength = child.measureText(ctx);
					if (textAnchor != 'start' && (i==0 || child.attribute('x').hasValue())) { // new group?
						// loop through rest of children
						var groupLength = childLength;
						for (var j=i+1; j<this.children.length; j++) {
							var childInGroup = this.children[j];
							if (childInGroup.attribute('x').hasValue()) break; // new group
							groupLength += childInGroup.measureText(ctx);
						}
						child.x -= (textAnchor == 'end' ? groupLength : groupLength / 2.0);
					}
					x = child.x + childLength;
					
					if (child.attribute('y').hasValue()) {
						child.y = child.attribute('y').Length.toPixels('y');
					}
					else {
						if (child.attribute('dy').hasValue()) y += child.attribute('dy').Length.toPixels('y');
						child.y = y;
					}	
					y = child.y;
					
					child.render(ctx);
				}
			}
		}
		svg.Element.text.prototype = new svg.Element.RenderedElementBase;
		
		// text base
		svg.Element.TextElementBase = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);
			
			this.getGlyph = function(font, text, i) {
				var c = text[i];
				var glyph = null;
				if (font.isArabic) {
					var arabicForm = 'isolated';
					if ((i==0 || text[i-1]==' ') && i<text.length-2 && text[i+1]!=' ') arabicForm = 'terminal'; 
					if (i>0 && text[i-1]!=' ' && i<text.length-2 && text[i+1]!=' ') arabicForm = 'medial';
					if (i>0 && text[i-1]!=' ' && (i == text.length-1 || text[i+1]==' ')) arabicForm = 'initial';
					if (typeof(font.glyphs[c]) != 'undefined') {
						glyph = font.glyphs[c][arabicForm];
						if (glyph == null && font.glyphs[c].type == 'glyph') glyph = font.glyphs[c];
					}
				}
				else {
					glyph = font.glyphs[c];
				}
				if (glyph == null) glyph = font.missingGlyph;
				return glyph;
			}
			
			this.renderChildren = function(ctx) {
				var customFont = this.parent.style('font-family').Definition.getDefinition();
				if (customFont != null) {
					var fontSize = this.parent.style('font-size').numValueOrDefault(svg.Font.Parse(svg.ctx.font).fontSize);
					var fontStyle = this.parent.style('font-style').valueOrDefault(svg.Font.Parse(svg.ctx.font).fontStyle);
					var text = this.getText();
					if (customFont.isRTL) text = text.split("").reverse().join("");
					
					var dx = svg.ToNumberArray(this.parent.attribute('dx').value);
					for (var i=0; i<text.length; i++) {
						var glyph = this.getGlyph(customFont, text, i);
						var scale = fontSize / customFont.fontFace.unitsPerEm;
						ctx.translate(this.x, this.y);
						ctx.scale(scale, -scale);
						var lw = ctx.lineWidth;
						ctx.lineWidth = ctx.lineWidth * customFont.fontFace.unitsPerEm / fontSize;
						if (fontStyle == 'italic') ctx.transform(1, 0, .4, 1, 0, 0);
						glyph.render(ctx);
						if (fontStyle == 'italic') ctx.transform(1, 0, -.4, 1, 0, 0);
						ctx.lineWidth = lw;
						ctx.scale(1/scale, -1/scale);
						ctx.translate(-this.x, -this.y);	
						
						this.x += fontSize * (glyph.horizAdvX || customFont.horizAdvX) / customFont.fontFace.unitsPerEm;
						if (typeof(dx[i]) != 'undefined' && !isNaN(dx[i])) {
							this.x += dx[i];
						}
					}
					return;
				}
			
				if (ctx.strokeStyle != '') ctx.strokeText(svg.compressSpaces(this.getText()), this.x, this.y);
				if (ctx.fillStyle != '') ctx.fillText(svg.compressSpaces(this.getText()), this.x, this.y);
			}
			
			this.getText = function() {
				// OVERRIDE ME
			}
			
			this.measureText = function(ctx) {
				var customFont = this.parent.style('font-family').Definition.getDefinition();
				if (customFont != null) {
					var fontSize = this.parent.style('font-size').numValueOrDefault(svg.Font.Parse(svg.ctx.font).fontSize);
					var measure = 0;
					var text = this.getText();
					if (customFont.isRTL) text = text.split("").reverse().join("");
					var dx = svg.ToNumberArray(this.parent.attribute('dx').value);
					for (var i=0; i<text.length; i++) {
						var glyph = this.getGlyph(customFont, text, i);
						measure += (glyph.horizAdvX || customFont.horizAdvX) * fontSize / customFont.fontFace.unitsPerEm;
						if (typeof(dx[i]) != 'undefined' && !isNaN(dx[i])) {
							measure += dx[i];
						}
					}
					return measure;
				}
			
				var textToMeasure = svg.compressSpaces(this.getText());
				if (!ctx.measureText) return textToMeasure.length * 10;
				
				ctx.save();
				this.setContext(ctx);
				var width = ctx.measureText(textToMeasure).width;
				ctx.restore();
				return width;
			}
		}
		svg.Element.TextElementBase.prototype = new svg.Element.RenderedElementBase;
		
		// tspan 
		svg.Element.tspan = function(node) {
			this.base = svg.Element.TextElementBase;
			this.base(node);
			
			this.text = node.nodeType == 3 ? node.nodeValue : // text
						node.childNodes.length > 0 ? node.childNodes[0].nodeValue : // element
						node.text;
			this.getText = function() {
				return this.text;
			}
		}
		svg.Element.tspan.prototype = new svg.Element.TextElementBase;
		
		// tref
		svg.Element.tref = function(node) {
			this.base = svg.Element.TextElementBase;
			this.base(node);
			
			this.getText = function() {
				var element = this.attribute('xlink:href').Definition.getDefinition();
				if (element != null) return element.children[0].getText();
			}
		}
		svg.Element.tref.prototype = new svg.Element.TextElementBase;		
		
		// a element
		svg.Element.a = function(node) {
			this.base = svg.Element.TextElementBase;
			this.base(node);
			
			this.hasText = true;
			for (var i=0; i<node.childNodes.length; i++) {
				if (node.childNodes[i].nodeType != 3) this.hasText = false;
			}
			
			// this might contain text
			this.text = this.hasText ? node.childNodes[0].nodeValue : '';
			this.getText = function() {
				return this.text;
			}		

			this.baseRenderChildren = this.renderChildren;
			this.renderChildren = function(ctx) {
				if (this.hasText) {
					// render as text element
					this.baseRenderChildren(ctx);
					var fontSize = new svg.Property('fontSize', svg.Font.Parse(svg.ctx.font).fontSize);
					svg.Mouse.checkBoundingBox(this, new svg.BoundingBox(this.x, this.y - fontSize.Length.toPixels('y'), this.x + this.measureText(ctx), this.y));					
				}
				else {
					// render as temporary group
					var g = new svg.Element.g();
					g.children = this.children;
					g.parent = this;
					g.render(ctx);
				}
			}
			
			this.onclick = function() {
				window.open(this.attribute('xlink:href').value);
			}
			
			this.onmousemove = function() {
				svg.ctx.canvas.style.cursor = 'pointer';
			}
		}
		svg.Element.a.prototype = new svg.Element.TextElementBase;		
		
		// image element
		svg.Element.image = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);
			
			svg.Images.push(this);
			this.img = document.createElement('img');
			this.loaded = false;
			var that = this;
			this.img.onload = function() { that.loaded = true; }
			this.img.src = this.attribute('xlink:href').value;
			
			this.renderChildren = function(ctx) {
				var x = this.attribute('x').Length.toPixels('x');
				var y = this.attribute('y').Length.toPixels('y');
				
				var width = this.attribute('width').Length.toPixels('x');
				var height = this.attribute('height').Length.toPixels('y');			
				if (width == 0 || height == 0) return;
			
				ctx.save();
				ctx.translate(x, y);
				svg.AspectRatio(ctx,
								this.attribute('preserveAspectRatio').value,
								width,
								this.img.width,
								height,
								this.img.height,
								0,
								0);	
				ctx.drawImage(this.img, 0, 0);			
				ctx.restore();
			}
		}
		svg.Element.image.prototype = new svg.Element.RenderedElementBase;
		
		// group element
		svg.Element.g = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);
			
			this.getBoundingBox = function() {
				var bb = new svg.BoundingBox();
				for (var i=0; i<this.children.length; i++) {
					bb.addBoundingBox(this.children[i].getBoundingBox());
				}
				return bb;
			};
		}
		svg.Element.g.prototype = new svg.Element.RenderedElementBase;

		// symbol element
		svg.Element.symbol = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);
			
			this.baseSetContext = this.setContext;
			this.setContext = function(ctx) {		
				this.baseSetContext(ctx);
				
				// viewbox
				if (this.attribute('viewBox').hasValue()) {				
					var viewBox = svg.ToNumberArray(this.attribute('viewBox').value);
					var minX = viewBox[0];
					var minY = viewBox[1];
					width = viewBox[2];
					height = viewBox[3];
					
					svg.AspectRatio(ctx,
									this.attribute('preserveAspectRatio').value, 
									this.attribute('width').Length.toPixels('x'),
									width,
									this.attribute('height').Length.toPixels('y'),
									height,
									minX,
									minY);

					svg.ViewPort.SetCurrent(viewBox[2], viewBox[3]);						
				}
			}			
		}
		svg.Element.symbol.prototype = new svg.Element.RenderedElementBase;		
			
		// style element
		svg.Element.style = function(node) { 
			this.base = svg.Element.ElementBase;
			this.base(node);
			
			// text, or spaces then CDATA
			var css = node.childNodes[0].nodeValue + (node.childNodes.length > 1 ? node.childNodes[1].nodeValue : '');
			css = css.replace(/(\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\/)|(^[\s]*\/\/.*)/gm, ''); // remove comments
			css = svg.compressSpaces(css); // replace whitespace
			var cssDefs = css.split('}');
			for (var i=0; i<cssDefs.length; i++) {
				if (svg.trim(cssDefs[i]) != '') {
					var cssDef = cssDefs[i].split('{');
					var cssClasses = cssDef[0].split(',');
					var cssProps = cssDef[1].split(';');
					for (var j=0; j<cssClasses.length; j++) {
						var cssClass = svg.trim(cssClasses[j]);
						if (cssClass != '') {
							var props = {};
							for (var k=0; k<cssProps.length; k++) {
								var prop = cssProps[k].indexOf(':');
								var name = cssProps[k].substr(0, prop);
								var value = cssProps[k].substr(prop + 1, cssProps[k].length - prop);
								if (name != null && value != null) {
									props[svg.trim(name)] = new svg.Property(svg.trim(name), svg.trim(value));
								}
							}
							svg.Styles[cssClass] = props;
							if (cssClass == '@font-face') {
								var fontFamily = props['font-family'].value.replace(/"/g,'');
								var srcs = props['src'].value.split(',');
								for (var s=0; s<srcs.length; s++) {
									if (srcs[s].indexOf('format("svg")') > 0) {
										var urlStart = srcs[s].indexOf('url');
										var urlEnd = srcs[s].indexOf(')', urlStart);
										var url = srcs[s].substr(urlStart + 5, urlEnd - urlStart - 6);
										var doc = svg.parseXml(svg.ajax(url));
										var fonts = doc.getElementsByTagName('font');
										for (var f=0; f<fonts.length; f++) {
											var font = svg.CreateElement(fonts[f]);
											svg.Definitions[fontFamily] = font;
										}
									}
								}
							}
						}
					}
				}
			}
		}
		svg.Element.style.prototype = new svg.Element.ElementBase;
		
		// use element 
		svg.Element.use = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);
			
			this.baseSetContext = this.setContext;
			this.setContext = function(ctx) {
				this.baseSetContext(ctx);
				if (this.attribute('x').hasValue()) ctx.translate(this.attribute('x').Length.toPixels('x'), 0);
				if (this.attribute('y').hasValue()) ctx.translate(0, this.attribute('y').Length.toPixels('y'));
			}
			
			this.getDefinition = function() {
				var element = this.attribute('xlink:href').Definition.getDefinition();
				if (this.attribute('width').hasValue()) element.attribute('width', true).value = this.attribute('width').value;
				if (this.attribute('height').hasValue()) element.attribute('height', true).value = this.attribute('height').value;
				return element;
			}
			
			this.path = function(ctx) {
				var element = this.getDefinition();
				if (element != null) element.path(ctx);
			}
			
			this.renderChildren = function(ctx) {
				var element = this.getDefinition();
				if (element != null) element.render(ctx);
			}
		}
		svg.Element.use.prototype = new svg.Element.RenderedElementBase;
		
		// mask element
		svg.Element.mask = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);
						
			this.apply = function(ctx, element) {
				// render as temp svg	
				var x = this.attribute('x').Length.toPixels('x');
				var y = this.attribute('y').Length.toPixels('y');
				var width = this.attribute('width').Length.toPixels('x');
				var height = this.attribute('height').Length.toPixels('y');
				
				// temporarily remove mask to avoid recursion
				var mask = element.attribute('mask').value;
				element.attribute('mask').value = '';
				
					var cMask = document.createElement('canvas');
					cMask.width = x + width;
					cMask.height = y + height;
					var maskCtx = cMask.getContext('2d');
					this.renderChildren(maskCtx);
				
					var c = document.createElement('canvas');
					c.width = x + width;
					c.height = y + height;
					var tempCtx = c.getContext('2d');
					element.render(tempCtx);
					tempCtx.globalCompositeOperation = 'destination-in';
					tempCtx.fillStyle = maskCtx.createPattern(cMask, 'no-repeat');
					tempCtx.fillRect(0, 0, x + width, y + height);
					
					ctx.fillStyle = tempCtx.createPattern(c, 'no-repeat');
					ctx.fillRect(0, 0, x + width, y + height);
					
				// reassign mask
				element.attribute('mask').value = mask;	
			}
			
			this.render = function(ctx) {
				// NO RENDER
			}
		}
		svg.Element.mask.prototype = new svg.Element.ElementBase;
		
		// clip element
		svg.Element.clipPath = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);
			
			this.apply = function(ctx) {
				for (var i=0; i<this.children.length; i++) {
					if (this.children[i].path) {
						this.children[i].path(ctx);
						ctx.clip();
					}
				}
			}
			
			this.render = function(ctx) {
				// NO RENDER
			}
		}
		svg.Element.clipPath.prototype = new svg.Element.ElementBase;

		// filters
		svg.Element.filter = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);
						
			this.apply = function(ctx, element) {
				// render as temp svg	
				var bb = element.getBoundingBox();
				var x = this.attribute('x').Length.toPixels('x');
				var y = this.attribute('y').Length.toPixels('y');
				if (x == 0 || y == 0) {
					x = bb.x1;
					y = bb.y1;
				}
				var width = this.attribute('width').Length.toPixels('x');
				var height = this.attribute('height').Length.toPixels('y');
				if (width == 0 || height == 0) {
					width = bb.width();
					height = bb.height();
				}
				
				// temporarily remove filter to avoid recursion
				var filter = element.style('filter').value;
				element.style('filter').value = '';
				
				// max filter distance
				var extraPercent = .20;
				var px = extraPercent * width;
				var py = extraPercent * height;
				
				var c = document.createElement('canvas');
				c.width = width + 2*px;
				c.height = height + 2*py;
				var tempCtx = c.getContext('2d');
				tempCtx.translate(-x + px, -y + py);
				element.render(tempCtx);
			
				// apply filters
				for (var i=0; i<this.children.length; i++) {
					this.children[i].apply(tempCtx, 0, 0, width + 2*px, height + 2*py);
				}
				
				// render on me
				ctx.drawImage(c, 0, 0, width + 2*px, height + 2*py, x - px, y - py, width + 2*px, height + 2*py);
				
				// reassign filter
				element.style('filter', true).value = filter;	
			}
			
			this.render = function(ctx) {
				// NO RENDER
			}		
		}
		svg.Element.filter.prototype = new svg.Element.ElementBase;
		
		svg.Element.feGaussianBlur = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);	
			
			function make_fgauss(sigma) {
				sigma = Math.max(sigma, 0.01);			      
				var len = Math.ceil(sigma * 4.0) + 1;                     
				mask = [];                               
				for (var i = 0; i < len; i++) {                             
					mask[i] = Math.exp(-0.5 * (i / sigma) * (i / sigma));                                           
				}                                                           
				return mask; 
			}
			
			function normalize(mask) {
				var sum = 0;
				for (var i = 1; i < mask.length; i++) {
					sum += Math.abs(mask[i]);
				}
				sum = 2 * sum + Math.abs(mask[0]);
				for (var i = 0; i < mask.length; i++) {
					mask[i] /= sum;
				}
				return mask;
			}
			
			function convolve_even(src, dst, mask, width, height) {
			  for (var y = 0; y < height; y++) {
				for (var x = 0; x < width; x++) {
				  var a = imGet(src, x, y, width, height, 3)/255;
				  for (var rgba = 0; rgba < 4; rgba++) {					  
					  var sum = mask[0] * (a==0?255:imGet(src, x, y, width, height, rgba)) * (a==0||rgba==3?1:a);
					  for (var i = 1; i < mask.length; i++) {
						var a1 = imGet(src, Math.max(x-i,0), y, width, height, 3)/255;
					    var a2 = imGet(src, Math.min(x+i, width-1), y, width, height, 3)/255;
						sum += mask[i] * 
						  ((a1==0?255:imGet(src, Math.max(x-i,0), y, width, height, rgba)) * (a1==0||rgba==3?1:a1) + 
						   (a2==0?255:imGet(src, Math.min(x+i, width-1), y, width, height, rgba)) * (a2==0||rgba==3?1:a2));
					  }
					  imSet(dst, y, x, height, width, rgba, sum);
				  }			  
				}
			  }
			}		

			function imGet(img, x, y, width, height, rgba) {
				return img[y*width*4 + x*4 + rgba];
			}
			
			function imSet(img, x, y, width, height, rgba, val) {
				img[y*width*4 + x*4 + rgba] = val;
			}
						
			function blur(ctx, width, height, sigma)
			{
				var srcData = ctx.getImageData(0, 0, width, height);
				var mask = make_fgauss(sigma);
				mask = normalize(mask);
				tmp = [];
				convolve_even(srcData.data, tmp, mask, width, height);
				convolve_even(tmp, srcData.data, mask, height, width);
				ctx.clearRect(0, 0, width, height);
				ctx.putImageData(srcData, 0, 0);
			}			
		
			this.apply = function(ctx, x, y, width, height) {
				// assuming x==0 && y==0 for now
				blur(ctx, width, height, this.attribute('stdDeviation').numValue());
			}
		}
		svg.Element.filter.prototype = new svg.Element.feGaussianBlur;
		
		// title element, do nothing
		svg.Element.title = function(node) {
		}
		svg.Element.title.prototype = new svg.Element.ElementBase;

		// desc element, do nothing
		svg.Element.desc = function(node) {
		}
		svg.Element.desc.prototype = new svg.Element.ElementBase;		
		
		svg.Element.MISSING = function(node) {
			console.log('ERROR: Element \'' + node.nodeName + '\' not yet implemented.');
		}
		svg.Element.MISSING.prototype = new svg.Element.ElementBase;
		
		// element factory
		svg.CreateElement = function(node) {	
			var className = node.nodeName.replace(/^[^:]+:/,''); // remove namespace
			className = className.replace(/\-/g,''); // remove dashes
			var e = null;
			if (typeof(svg.Element[className]) != 'undefined') {
				e = new svg.Element[className](node);
			}
			else {
				e = new svg.Element.MISSING(node);
			}

			e.type = node.nodeName;
			return e;
		}
				
		// load from url
		svg.load = function(ctx, url) {
			svg.loadXml(ctx, svg.ajax(url));
		}
		
		// load from xml
		svg.loadXml = function(ctx, xml) {
			svg.loadXmlDoc(ctx, svg.parseXml(xml));
		}
		
		svg.loadXmlDoc = function(ctx, dom) {
			svg.init(ctx);
			
			var mapXY = function(p) {
				var e = ctx.canvas;
				while (e) {
					p.x -= e.offsetLeft;
					p.y -= e.offsetTop;
					e = e.offsetParent;
				}
				if (window.scrollX) p.x += window.scrollX;
				if (window.scrollY) p.y += window.scrollY;
				return p;
			}
			
			// bind mouse
			if (svg.opts['ignoreMouse'] != true) {
				ctx.canvas.onclick = function(e) {
					var p = mapXY(new svg.Point(e != null ? e.clientX : event.clientX, e != null ? e.clientY : event.clientY));
					svg.Mouse.onclick(p.x, p.y);
				};
				ctx.canvas.onmousemove = function(e) {
					var p = mapXY(new svg.Point(e != null ? e.clientX : event.clientX, e != null ? e.clientY : event.clientY));
					svg.Mouse.onmousemove(p.x, p.y);
				};
			}
		
			var e = svg.CreateElement(dom.documentElement);
			e.root = true;
					
			// render loop
			var isFirstRender = true;
			var draw = function() {
				svg.ViewPort.Clear();
				if (ctx.canvas.parentNode) svg.ViewPort.SetCurrent(ctx.canvas.parentNode.clientWidth, ctx.canvas.parentNode.clientHeight);
			
				if (svg.opts['ignoreDimensions'] != true) {
					// set canvas size
					if (e.style('width').hasValue()) {
						ctx.canvas.width = e.style('width').Length.toPixels('x');
						ctx.canvas.style.width = ctx.canvas.width + 'px';
					}
					if (e.style('height').hasValue()) {
						ctx.canvas.height = e.style('height').Length.toPixels('y');
						ctx.canvas.style.height = ctx.canvas.height + 'px';
					}
				}
				var cWidth = ctx.canvas.clientWidth || ctx.canvas.width;
				var cHeight = ctx.canvas.clientHeight || ctx.canvas.height;
				svg.ViewPort.SetCurrent(cWidth, cHeight);		
				
				if (svg.opts != null && svg.opts['offsetX'] != null) e.attribute('x', true).value = svg.opts['offsetX'];
				if (svg.opts != null && svg.opts['offsetY'] != null) e.attribute('y', true).value = svg.opts['offsetY'];
				if (svg.opts != null && svg.opts['scaleWidth'] != null && svg.opts['scaleHeight'] != null) {
					var xRatio = 1, yRatio = 1;
					if (e.attribute('width').hasValue()) xRatio = e.attribute('width').Length.toPixels('x') / svg.opts['scaleWidth'];
					if (e.attribute('height').hasValue()) yRatio = e.attribute('height').Length.toPixels('y') / svg.opts['scaleHeight'];
				
					e.attribute('width', true).value = svg.opts['scaleWidth'];
					e.attribute('height', true).value = svg.opts['scaleHeight'];			
					e.attribute('viewBox', true).value = '0 0 ' + (cWidth * xRatio) + ' ' + (cHeight * yRatio);
					e.attribute('preserveAspectRatio', true).value = 'none';
				}
			
				// clear and render
				if (svg.opts['ignoreClear'] != true) {
					ctx.clearRect(0, 0, cWidth, cHeight);
				}
				e.render(ctx);
				if (isFirstRender) {
					isFirstRender = false;
					if (svg.opts != null && typeof(svg.opts['renderCallback']) == 'function') svg.opts['renderCallback']();
				}			
			}
			
			var waitingForImages = true;
			if (svg.ImagesLoaded()) {
				waitingForImages = false;
				draw();
			}
			svg.intervalID = setInterval(function() { 
				var needUpdate = false;
				
				if (waitingForImages && svg.ImagesLoaded()) {
					waitingForImages = false;
					needUpdate = true;
				}
			
				// need update from mouse events?
				if (svg.opts['ignoreMouse'] != true) {
					needUpdate = needUpdate | svg.Mouse.hasEvents();
				}
			
				// need update from animations?
				if (svg.opts['ignoreAnimation'] != true) {
					for (var i=0; i<svg.Animations.length; i++) {
						needUpdate = needUpdate | svg.Animations[i].update(1000 / svg.FRAMERATE);
					}
				}
				
				// need update from redraw?
				if (svg.opts != null && typeof(svg.opts['forceRedraw']) == 'function') {
					if (svg.opts['forceRedraw']() == true) needUpdate = true;
				}
				
				// render if needed
				if (needUpdate) {
					draw();				
					svg.Mouse.runEvents(); // run and clear our events
				}
			}, 1000 / svg.FRAMERATE);
		}
		
		svg.stop = function() {
			if (svg.intervalID) {
				clearInterval(svg.intervalID);
			}
		}
		
		svg.Mouse = new (function() {
			this.events = [];
			this.hasEvents = function() { return this.events.length != 0; }
		
			this.onclick = function(x, y) {
				this.events.push({ type: 'onclick', x: x, y: y, 
					run: function(e) { if (e.onclick) e.onclick(); }
				});
			}
			
			this.onmousemove = function(x, y) {
				this.events.push({ type: 'onmousemove', x: x, y: y,
					run: function(e) { if (e.onmousemove) e.onmousemove(); }
				});
			}			
			
			this.eventElements = [];
			
			this.checkPath = function(element, ctx) {
				for (var i=0; i<this.events.length; i++) {
					var e = this.events[i];
					if (ctx.isPointInPath && ctx.isPointInPath(e.x, e.y)) this.eventElements[i] = element;
				}
			}
			
			this.checkBoundingBox = function(element, bb) {
				for (var i=0; i<this.events.length; i++) {
					var e = this.events[i];
					if (bb.isPointInBox(e.x, e.y)) this.eventElements[i] = element;
				}			
			}
			
			this.runEvents = function() {
				svg.ctx.canvas.style.cursor = '';
				
				for (var i=0; i<this.events.length; i++) {
					var e = this.events[i];
					var element = this.eventElements[i];
					while (element) {
						e.run(element);
						element = element.parent;
					}
				}		
			
				// done running, clear
				this.events = []; 
				this.eventElements = [];
			}
		});
		
		return svg;
	}
})();

if (CanvasRenderingContext2D) {
	CanvasRenderingContext2D.prototype.drawSvg = function(s, dx, dy, dw, dh) {
		canvg(this.canvas, s, { 
			ignoreMouse: true, 
			ignoreAnimation: true, 
			ignoreDimensions: true, 
			ignoreClear: true, 
			offsetX: dx, 
			offsetY: dy, 
			scaleWidth: dw, 
			scaleHeight: dh
		});
	}
};
define("mylibs/utils/canvg", function(){});

/**
 * A class to parse color values
 * @author Stoyan Stefanov <sstoo@gmail.com>
 * @link   http://www.phpied.com/rgb-color-parser-in-javascript/
 * @license Use it if you like it
 */
function RGBColor(color_string)
{
    this.ok = false;

    // strip any leading #
    if (color_string.charAt(0) == '#') { // remove # if any
        color_string = color_string.substr(1,6);
    }

    color_string = color_string.replace(/ /g,'');
    color_string = color_string.toLowerCase();

    // before getting into regexps, try simple matches
    // and overwrite the input
    var simple_colors = {
        aliceblue: 'f0f8ff',
        antiquewhite: 'faebd7',
        aqua: '00ffff',
        aquamarine: '7fffd4',
        azure: 'f0ffff',
        beige: 'f5f5dc',
        bisque: 'ffe4c4',
        black: '000000',
        blanchedalmond: 'ffebcd',
        blue: '0000ff',
        blueviolet: '8a2be2',
        brown: 'a52a2a',
        burlywood: 'deb887',
        cadetblue: '5f9ea0',
        chartreuse: '7fff00',
        chocolate: 'd2691e',
        coral: 'ff7f50',
        cornflowerblue: '6495ed',
        cornsilk: 'fff8dc',
        crimson: 'dc143c',
        cyan: '00ffff',
        darkblue: '00008b',
        darkcyan: '008b8b',
        darkgoldenrod: 'b8860b',
        darkgray: 'a9a9a9',
        darkgreen: '006400',
        darkkhaki: 'bdb76b',
        darkmagenta: '8b008b',
        darkolivegreen: '556b2f',
        darkorange: 'ff8c00',
        darkorchid: '9932cc',
        darkred: '8b0000',
        darksalmon: 'e9967a',
        darkseagreen: '8fbc8f',
        darkslateblue: '483d8b',
        darkslategray: '2f4f4f',
        darkturquoise: '00ced1',
        darkviolet: '9400d3',
        deeppink: 'ff1493',
        deepskyblue: '00bfff',
        dimgray: '696969',
        dodgerblue: '1e90ff',
        feldspar: 'd19275',
        firebrick: 'b22222',
        floralwhite: 'fffaf0',
        forestgreen: '228b22',
        fuchsia: 'ff00ff',
        gainsboro: 'dcdcdc',
        ghostwhite: 'f8f8ff',
        gold: 'ffd700',
        goldenrod: 'daa520',
        gray: '808080',
        green: '008000',
        greenyellow: 'adff2f',
        honeydew: 'f0fff0',
        hotpink: 'ff69b4',
        indianred : 'cd5c5c',
        indigo : '4b0082',
        ivory: 'fffff0',
        khaki: 'f0e68c',
        lavender: 'e6e6fa',
        lavenderblush: 'fff0f5',
        lawngreen: '7cfc00',
        lemonchiffon: 'fffacd',
        lightblue: 'add8e6',
        lightcoral: 'f08080',
        lightcyan: 'e0ffff',
        lightgoldenrodyellow: 'fafad2',
        lightgrey: 'd3d3d3',
        lightgreen: '90ee90',
        lightpink: 'ffb6c1',
        lightsalmon: 'ffa07a',
        lightseagreen: '20b2aa',
        lightskyblue: '87cefa',
        lightslateblue: '8470ff',
        lightslategray: '778899',
        lightsteelblue: 'b0c4de',
        lightyellow: 'ffffe0',
        lime: '00ff00',
        limegreen: '32cd32',
        linen: 'faf0e6',
        magenta: 'ff00ff',
        maroon: '800000',
        mediumaquamarine: '66cdaa',
        mediumblue: '0000cd',
        mediumorchid: 'ba55d3',
        mediumpurple: '9370d8',
        mediumseagreen: '3cb371',
        mediumslateblue: '7b68ee',
        mediumspringgreen: '00fa9a',
        mediumturquoise: '48d1cc',
        mediumvioletred: 'c71585',
        midnightblue: '191970',
        mintcream: 'f5fffa',
        mistyrose: 'ffe4e1',
        moccasin: 'ffe4b5',
        navajowhite: 'ffdead',
        navy: '000080',
        oldlace: 'fdf5e6',
        olive: '808000',
        olivedrab: '6b8e23',
        orange: 'ffa500',
        orangered: 'ff4500',
        orchid: 'da70d6',
        palegoldenrod: 'eee8aa',
        palegreen: '98fb98',
        paleturquoise: 'afeeee',
        palevioletred: 'd87093',
        papayawhip: 'ffefd5',
        peachpuff: 'ffdab9',
        peru: 'cd853f',
        pink: 'ffc0cb',
        plum: 'dda0dd',
        powderblue: 'b0e0e6',
        purple: '800080',
        red: 'ff0000',
        rosybrown: 'bc8f8f',
        royalblue: '4169e1',
        saddlebrown: '8b4513',
        salmon: 'fa8072',
        sandybrown: 'f4a460',
        seagreen: '2e8b57',
        seashell: 'fff5ee',
        sienna: 'a0522d',
        silver: 'c0c0c0',
        skyblue: '87ceeb',
        slateblue: '6a5acd',
        slategray: '708090',
        snow: 'fffafa',
        springgreen: '00ff7f',
        steelblue: '4682b4',
        tan: 'd2b48c',
        teal: '008080',
        thistle: 'd8bfd8',
        tomato: 'ff6347',
        turquoise: '40e0d0',
        violet: 'ee82ee',
        violetred: 'd02090',
        wheat: 'f5deb3',
        white: 'ffffff',
        whitesmoke: 'f5f5f5',
        yellow: 'ffff00',
        yellowgreen: '9acd32'
    };
    for (var key in simple_colors) {
        if (color_string == key) {
            color_string = simple_colors[key];
        }
    }
    // emd of simple type-in colors

    // array of color definition objects
    var color_defs = [
        {
            re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
            example: ['rgb(123, 234, 45)', 'rgb(255,234,245)'],
            process: function (bits){
                return [
                    parseInt(bits[1]),
                    parseInt(bits[2]),
                    parseInt(bits[3])
                ];
            }
        },
        {
            re: /^(\w{2})(\w{2})(\w{2})$/,
            example: ['#00ff00', '336699'],
            process: function (bits){
                return [
                    parseInt(bits[1], 16),
                    parseInt(bits[2], 16),
                    parseInt(bits[3], 16)
                ];
            }
        },
        {
            re: /^(\w{1})(\w{1})(\w{1})$/,
            example: ['#fb0', 'f0f'],
            process: function (bits){
                return [
                    parseInt(bits[1] + bits[1], 16),
                    parseInt(bits[2] + bits[2], 16),
                    parseInt(bits[3] + bits[3], 16)
                ];
            }
        }
    ];

    // search through the definitions to find a match
    for (var i = 0; i < color_defs.length; i++) {
        var re = color_defs[i].re;
        var processor = color_defs[i].process;
        var bits = re.exec(color_string);
        if (bits) {
            channels = processor(bits);
            this.r = channels[0];
            this.g = channels[1];
            this.b = channels[2];
            this.ok = true;
        }

    }

    // validate/cleanup values
    this.r = (this.r < 0 || isNaN(this.r)) ? 0 : ((this.r > 255) ? 255 : this.r);
    this.g = (this.g < 0 || isNaN(this.g)) ? 0 : ((this.g > 255) ? 255 : this.g);
    this.b = (this.b < 0 || isNaN(this.b)) ? 0 : ((this.b > 255) ? 255 : this.b);

    // some getters
    this.toRGB = function () {
        return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
    }
    this.toHex = function () {
        var r = this.r.toString(16);
        var g = this.g.toString(16);
        var b = this.b.toString(16);
        if (r.length == 1) r = '0' + r;
        if (g.length == 1) g = '0' + g;
        if (b.length == 1) b = '0' + b;
        return '#' + r + g + b;
    }

    // help
    this.getHelpXML = function () {

        var examples = new Array();
        // add regexps
        for (var i = 0; i < color_defs.length; i++) {
            var example = color_defs[i].example;
            for (var j = 0; j < example.length; j++) {
                examples[examples.length] = example[j];
            }
        }
        // add type-in colors
        for (var sc in simple_colors) {
            examples[examples.length] = sc;
        }

        var xml = document.createElement('ul');
        xml.setAttribute('id', 'rgbcolor-examples');
        for (var i = 0; i < examples.length; i++) {
            try {
                var list_item = document.createElement('li');
                var list_color = new RGBColor(examples[i]);
                var example_div = document.createElement('div');
                example_div.style.cssText =
                        'margin: 3px; '
                        + 'border: 1px solid black; '
                        + 'background:' + list_color.toHex() + '; '
                        + 'color:' + list_color.toHex()
                ;
                example_div.appendChild(document.createTextNode('test'));
                var list_item_value = document.createTextNode(
                    ' ' + examples[i] + ' -> ' + list_color.toRGB() + ' -> ' + list_color.toHex()
                );
                list_item.appendChild(example_div);
                list_item.appendChild(list_item_value);
                xml.appendChild(list_item);

            } catch(e){}
        }
        return xml;

    }

}

;
define("mylibs/utils/rgbcolor", function(){});

(function() {

  define('mylibs/utils/utils',['jQuery', 'Kendo', 'mylibs/utils/BlobBuilder.min', 'mylibs/utils/FileSaver.min', 'mylibs/utils/canvg', 'mylibs/utils/rgbcolor'], function($, kendo) {
    var canvas, pub;
    canvas = {};
    return pub = {
      init: function() {
        canvas = document.createElement("canvas");
        return canvas.toDataURI = function(el) {
          var ctx, imgData, src;
          ctx = canvas.getContext("2d");
          ctx.drawImage(el, 0, 0, el.width, el.height);
          imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          ctx.putImageData(imgData, 0, 0);
          return src = canvas.toDataURL("image/jpeg");
        };
      },
      toArray: function(list) {
        return Array.prototype.slice.call(list || [], 0);
      },
      elToDataURI: function(el) {
        canvas.width = el.width;
        canvas.height = el.height;
        return canvas.toDataURI(el);
      },
      svgToDataURI: function(svg) {
        var src, svg_xml;
        svg_xml = (new XMLSerializer()).serializeToString(svg);
        canvg(canvas, svg_xml);
        return src = canvas.toDataURL("image/jpeg");
      },
      getAnimationFrame: function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, element) {
          return window.setTimeout(callback, 1000 / 60);
        };
      }
    };
  });

}).call(this);

(function() {

  define('mylibs/file/file',['jQuery', 'Kendo', 'mylibs/utils/utils'], function(utils) {
    var compare, dataURIToBlob, errorHandler, fileSystem, myPicturesDir, pub;
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    fileSystem = {};
    myPicturesDir = {};
    compare = function(a, b) {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    };
    dataURIToBlob = function(dataURI) {
      var ab, bb, blob, byteString, bytes, ia, mimeString, _i, _len;
      if (dataURI.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(dataURI.split(',')[1]);
      } else {
        byteString = unescape(dataURI.split(',')[1]);
      }
      mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      ab = new ArrayBuffer(byteString.length, 'binary');
      ia = new Uint8Array(ab);
      for (_i = 0, _len = byteString.length; _i < _len; _i++) {
        bytes = byteString[_i];
        ia[_i] = byteString.charCodeAt(_i);
      }
      bb = new BlobBuilder();
      bb.append(ab);
      return blob = bb.getBlob(mimeString);
    };
    errorHandler = function(e) {
      var msg;
      msg = '';
      switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
          msg = 'QUOTA_EXCEEDED_ERR';
          break;
        case FileError.NOT_FOUND_ERR:
          msg = 'NOT_FOUND_ERR';
          break;
        case FileError.SECURITY_ERR:
          msg = 'SECURITY_ERR';
          break;
        case FileError.INVALID_MODIFICATION_ERR:
          msg = 'INVALID_MODIFICATION_ERR';
          break;
        case FileError.INVALID_STATE_ERR:
          msg = 'INVALID_STATE_ERR';
          break;
        default:
          msg = 'Unknown Error';
      }
      console.log('Error: ' + msg);
      return $.publish("/msg/error", ["Access to the file system could not be obtained."]);
    };
    return pub = {
      init: function(kb) {
        var success;
        window.webkitStorageInfo.requestQuota(PERSISTENT, kb * 1024, function(grantedBytes) {
          return window.requestFileSystem(PERSISTENT, grantedBytes, success, errorHandler);
        });
        return success = function(fs) {
          fs.root.getDirectory("MyPictures", {
            create: true
          }, function(dirEntry) {
            var animation, dirReader, entries, read;
            myPicturesDir = dirEntry;
            entries = [];
            dirReader = fs.root.createReader();
            animation = {
              effects: "fadeIn",
              show: true,
              duration: 1000
            };
            read = function() {
              return dirReader.readEntries(function(results) {
                var entry, _i, _j, _len, _len2, _results;
                if (!results.length) {
                  console.info(entries);
                  entries.sort(compare);
                  _results = [];
                  for (_i = 0, _len = entries.length; _i < _len; _i++) {
                    entry = entries[_i];
                    _results.push($.publish("/pictures/create", [entry.toURL(), entry.name, false, false, animation]));
                  }
                  return _results;
                } else {
                  for (_j = 0, _len2 = results.length; _j < _len2; _j++) {
                    entry = results[_j];
                    if (entry.isFile) entries.push(entry);
                  }
                  return read();
                }
              });
            };
            return read();
          }, errorHandler);
          fileSystem = fs;
          return console.info("Got Storage!");
        };
      },
      save: function(name, dataURI) {
        return fileSystem.root.getFile(name, {
          create: true
        }, function(fileEntry) {
          return fileEntry.createWriter(function(fileWriter) {
            var blob;
            fileWriter.onwriteend = function(e) {
              return console.info("save completed");
            };
            fileWriter.onerror = function(e) {
              return console.error("Write failed: " + e.toString());
            };
            blob = dataURIToBlob(dataURI);
            return fileWriter.write(blob);
          });
        }, errorHandler);
      },
      "delete": function(name) {
        return fileSystem.root.getFile(name, {
          create: false
        }, function(fileEntry) {
          return fileEntry.remove(function() {
            return $.publish("/file/deleted/" + name);
          }, errorHandler);
        }, errorHandler);
      }
    };
  });

}).call(this);

/*
 RequireJS text 1.0.6 Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 Available via the MIT or new BSD license.
 see: http://github.com/jrburke/requirejs for details
*/
(function(){var k=["Msxml2.XMLHTTP","Microsoft.XMLHTTP","Msxml2.XMLHTTP.4.0"],n=/^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,o=/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,i=typeof location!=="undefined"&&location.href,p=i&&location.protocol&&location.protocol.replace(/\:/,""),q=i&&location.hostname,r=i&&(location.port||void 0),j=[];define('text',[],function(){var g,h,l;typeof window!=="undefined"&&window.navigator&&window.document?h=function(a,c){var b=g.createXhr();b.open("GET",a,!0);b.onreadystatechange=
function(){b.readyState===4&&c(b.responseText)};b.send(null)}:typeof process!=="undefined"&&process.versions&&process.versions.node?(l=require.nodeRequire("fs"),h=function(a,c){var b=l.readFileSync(a,"utf8");b.indexOf("\ufeff")===0&&(b=b.substring(1));c(b)}):typeof Packages!=="undefined"&&(h=function(a,c){var b=new java.io.File(a),e=java.lang.System.getProperty("line.separator"),b=new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(b),"utf-8")),d,f,g="";try{d=new java.lang.StringBuffer;
(f=b.readLine())&&f.length()&&f.charAt(0)===65279&&(f=f.substring(1));for(d.append(f);(f=b.readLine())!==null;)d.append(e),d.append(f);g=String(d.toString())}finally{b.close()}c(g)});return g={version:"1.0.6",strip:function(a){if(a){var a=a.replace(n,""),c=a.match(o);c&&(a=c[1])}else a="";return a},jsEscape:function(a){return a.replace(/(['\\])/g,"\\$1").replace(/[\f]/g,"\\f").replace(/[\b]/g,"\\b").replace(/[\n]/g,"\\n").replace(/[\t]/g,"\\t").replace(/[\r]/g,"\\r")},createXhr:function(){var a,c,
b;if(typeof XMLHttpRequest!=="undefined")return new XMLHttpRequest;else for(c=0;c<3;c++){b=k[c];try{a=new ActiveXObject(b)}catch(e){}if(a){k=[b];break}}if(!a)throw Error("createXhr(): XMLHttpRequest not available");return a},get:h,parseName:function(a){var c=!1,b=a.indexOf("."),e=a.substring(0,b),a=a.substring(b+1,a.length),b=a.indexOf("!");b!==-1&&(c=a.substring(b+1,a.length),c=c==="strip",a=a.substring(0,b));return{moduleName:e,ext:a,strip:c}},xdRegExp:/^((\w+)\:)?\/\/([^\/\\]+)/,useXhr:function(a,
c,b,e){var d=g.xdRegExp.exec(a),f;if(!d)return!0;a=d[2];d=d[3];d=d.split(":");f=d[1];d=d[0];return(!a||a===c)&&(!d||d===b)&&(!f&&!d||f===e)},finishLoad:function(a,c,b,e,d){b=c?g.strip(b):b;d.isBuild&&(j[a]=b);e(b)},load:function(a,c,b,e){if(e.isBuild&&!e.inlineText)b();else{var d=g.parseName(a),f=d.moduleName+"."+d.ext,m=c.toUrl(f),h=e&&e.text&&e.text.useXhr||g.useXhr;!i||h(m,p,q,r)?g.get(m,function(c){g.finishLoad(a,d.strip,c,b,e)}):c([f],function(a){g.finishLoad(d.moduleName+"."+d.ext,d.strip,a,
b,e)})}},write:function(a,c,b){if(c in j){var e=g.jsEscape(j[c]);b.asModule(a+"!"+c,"define(function () { return '"+e+"';});\n")}},writeFile:function(a,c,b,e,d){var c=g.parseName(c),f=c.moduleName+"."+c.ext,h=b.toUrl(c.moduleName+"."+c.ext)+".js";g.load(f,b,function(){var b=function(a){return e(h,a)};b.asModule=function(a,b){return e.asModule(a,h,b)};g.write(a,f,b,d)},d)}}})})();

define('text!intro.html',[],function () { return '<div id="intro">\n\t<p><h1>Welcome to HTML5 Camera!</h1></p>\n\t<p>This site is an experiment with HTML5 technologies, including WebRTC, Device Orientation, Canvas, Video and others.</p>\n\t<p>In order to use this site, you will need a browser that is on the bleeding edge of HTML5.  Currently, HTML5 Camera Supports the following browsers...</p>\n\t<ul>\n\t\t<li><a href="http://www.chromium.org/getting-involved/dev-channel">Chrome Dev Channel</a></li>\n\t\t<li><a href="http://www.chromium.org/getting-involved/dev-channel">Chrome Canary</a></li>\n\t\t<li><a href="http://snapshot.opera.com/labs/camera/">Opera Labs Camera Build</a></li>\n\t</ul>\t\n\t<p>For the Chrome Builds, you will need to turn on the experimental WebRTC feature by entering <strong>chrome://flags</strong> in your address bar and then enabling <strong>Media Streaming</strong></p>\n\t<br />\n\t<p><div class="chrome-flags"><img src="stylesheets/images/chrome_flags.png" alt="Enable Media Streaming Under Chrome Flags" /></div></p>\n</div>';});

define('text!mylibs/photobooth/views/photostrip.html',[],function () { return '<div class="photostrip box">\n\t<img />\n</div>\n\t';});

(function() {

  define('mylibs/photobooth/photobooth',['jQuery', 'Kendo', 'text!mylibs/photobooth/views/photostrip.html'], function($, kendo, photostrip) {
    var canvas, createStrip, images, pub;
    images = [];
    canvas = {};
    createStrip = function(counter, images, ctx, width, height) {
      var image;
      image = new Image();
      image.src = images[counter];
      image.width = width;
      image.height = height;
      return image.onload = function() {
        var animation, imgData, src, y;
        y = (counter * height) + ((counter * 20) + 20);
        ctx.drawImage(image, 20, y, image.width, image.height);
        if (counter === images.length - 1) {
          imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          ctx.putImageData(imgData, 0, 0);
          src = canvas.toDataURL();
          animation = {
            effects: "slideIn:down fadeIn",
            show: true,
            duration: 1000
          };
          return $.publish("/pictures/create", [src, null, false, true, animation]);
        } else {
          return createStrip(++counter, images, ctx, width, height);
        }
      };
    };
    return pub = {
      init: function(width, height) {
        canvas = $("<canvas style=color:fff></canvas>")[0];
        return $.subscribe("/photobooth/create", function(images) {
          var counter, ctx, img;
          counter = 0;
          canvas.width = width + 40;
          canvas.height = (height * images.length) + (images.length * 20) + 20;
          ctx = canvas.getContext("2d");
          ctx.fillStyle = "rgb(255,255,255)";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          return img = createStrip(counter, images, ctx, width, height);
        });
      }
    };
  });

}).call(this);

define('text!mylibs/customize/views/customize.html',[],function () { return '<div class="row">\n\t<div class="span6">\n\t\t<div class="row centered">\n\t\t\t<img src="${ data }" id="preview" data-vintageSource="${ data }"/>\n\t\t\t<div class="yep-nope">\n\t\t\t\t<button class="button">Yep</button>\n\t\t\t\t<button class="button">Nope</button>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t<div class="span4">\n\t\t<h3>Adjust Edges</h3>\n\t\t<div>\n\t\t\t<div>Black<div>\n\t\t\t<input class="slider" style="width: 400px;" id="sliderBlack" data-option="vignette.black" max="1" min="0" data-smallStep=".05" data-largeStep=".1"/>\t\t\t\t\t\t\n\t\t</div>\n\t\t<div class="form-row">\n\t\t\t<div class="form-left">White</div><div class="form-right">\n\t\t\t\t<input class="slider" style="width: 400px;" id="sliderWhite" data-option="vignette.white" max="1" min="0" data-smallStep=".05" data-largeStep=".1"/>\n\t\t\t</div>\n\t\t</div>\n\t\t<h3>Noise</h3>\n\t\t<div class="form-row">\n\t\t\t<input id="sliderNoise" style="width: 400px;" class="slider" max="1" min="0" data-smallStep=".05" data-largeStep=".1" data-option="noise" />\n\t\t</div>\n\t\t<h3>Screen</h3>\n\t\t<div class="form-row">\n\t\t\t<div class="form-left">\n\t\t\t\tRed:\n\t\t\t</div>\n\t\t\t<div class="form-right">\n\t\t\t\t<input id="sliderBlue" style="width: 400px;" class="slider" max="255" data-smallStep="1" data-largeStep="10" min="0" data-option="screen.red" />\n\t\t\t</div>\n\t\t</div>\n\t\t<div class="form-row">\n\t\t\t<div class="form-left">\n\t\t\t\tGreen:\n\t\t\t</div>\n\t\t\t<div class="form-right">\n\t\t\t\t<input id="sliderGreen" style="width: 400px;" class="slider" data-option="screen.green" max="255" data-smallStep="1" data-largeStep="10" min="0" />\n\t\t\t</div>\n\t\t</div>\n\t\t<div class="form-row">\n\t\t\t<div class="form-left">\n\t\t\t\tBlue:\n\t\t\t</div>\n\t\t\t<div class="form-right">\n\t\t\t\t<input id="sliderBlue" class="slider" style="width: 400px;" data-option="screen.blue" max="255" data-smallStep="1" data-largeStep="10" min="0"/>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class="strength">\n\t\t\t<div class="form-left">\n\t\t\t\tStrength:\n\t\t\t</div>\n\t\t\t<div class="form-right">\n\t\t\t\t<input class="slider" style="width: 400px;" id="sliderStrength" data-option="screen.strength" max="1" min="0" data-smallStep=".05" data-largeStep=".1" />\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>';});

(function() {

  define('mylibs/customize/customize',['jQuery', 'Kendo', 'text!mylibs/customize/views/customize.html'], function($, kendo, template) {
    var $window, customizeEffect, pub;
    $window = {};
    customizeEffect = function(sender) {
      var $image, content, vintage;
      $image = $(sender);
      content = kendo.template(template);
      $window.element.empty().append(content($image.attr("src")));
      vintage = $image.data("vintage");
      $(content).find(".slider").each(function() {
        var $preview, $slider, optionValue, options, _ref, _ref2;
        $slider = $(this);
        optionValue = vintage != null ? vintage : 0;
        options = $slider.data("option").split(".");
        if (optionValue) {
          $.each(options, function() {
            return optionValue = optionValue[this];
          });
        }
        $preview = $("#preview");
        return $slider.kendoSlider({
          smallStep: (_ref = parseFloat($slider.data("smallstep"))) != null ? _ref : 1,
          largeStep: (_ref2 = parseFloat($slider.data("largestep"))) != null ? _ref2 : 5,
          value: optionValue,
          tickPlacement: "none",
          tooltip: {
            format: "{0}"
          },
          change: function(value) {
            return $.publish("/image/update", [$preview, options, value.value]);
          }
        });
      });
      return $window.open().center();
    };
    return pub = {
      init: function(containerId) {
        $.subscribe('/customize', function(sender) {
          return customizeEffect(sender);
        });
        return $window = $("<div id='customize'></div>").kendoWindow({
          visible: false,
          modal: true,
          title: "Customize Your Image",
          animation: {
            open: {
              effects: "slideIn:up fadeIn",
              duration: 500
            },
            close: {
              effects: "slide:up fadeOut",
              duration: 500
            }
          }
        }).data("kendoWindow").center();
      }
    };
  });

}).call(this);

define('text!mylibs/share/views/download.html',[],function () { return '<div id="download">\n\t<input placeholder="Save File As..." class="k-textbox" />\n\t<button class="k-button">Save</button>\n</div>';});

define('text!mylibs/share/views/tweet.html',[],function () { return '<img class="tweet-img" src="#= src #" />\n<div class="arrow_box tweet-box">\n\t<textarea col= placeholder="type something here...." />\n</div>';});

(function() {

  define('mylibs/share/share',['jQuery', 'Kendo', 'mylibs/utils/utils', 'text!mylibs/share/views/download.html', 'text!mylibs/share/views/tweet.html'], function($, kendo, utils, downloadView, tweet) {
    var openCenteredWindow, pub, shareWindow, twitter_token;
    shareWindow = {};
    twitter_token = "";
    openCenteredWindow = function(url) {
      var A, B, C, checkWindow, childWindow, intervalID, u, v, x, y, z;
      y = 700;
      C = window.screenX || 0;
      B = C ? $(window).width() : screen.availWidth;
      A = 520;
      u = window.screenY || 0;
      x = u ? $(window).height() : screen.availHeight;
      v = C + (B - y) / 2;
      z = u + (x - A) / 2;
      childWindow = window.open("authenticate/twitter", "auth", "resizable=yes,toolbar=no,scrollbars=yes,status=no,width=" + y + ",height=" + A + ",left=" + v + ",top=" + z);
      checkWindow = function() {
        var twitter;
        if (childWindow && childWindow.closed) {
          window.clearInterval(intervalID);
          twitter = sessionStorage.getItem("twitter");
          if (twitter) return $(".tweet").show();
        }
      };
      return intervalID = window.setInterval(checkWindow, 500);
    };
    return pub = {
      twitter_token: "",
      init: function() {
        $.subscribe("/share/download", function($img) {
          var img, src;
          img = new Image();
          img.src = $img.src;
          src = utils.elToDataURI(img);
          utils.saveImage(src);
          return delete img;
        });
        $.subscribe("/share/tweet", function(src) {
          var template;
          template = kendo.template(tweet);
          tweet = template({
            src: src
          });
          return shareWindow.content(tweet).open().center();
        });
        $('#twitter-sign-in').click(function(e) {
          openCenteredWindow("twitter");
          return e.preventDefault();
        });
        return shareWindow = $("<div id='share'></div>").kendoWindow({
          modal: true,
          visible: false
        }).data("kendoWindow");
      },
      download: function(el) {
        var dataURI;
        dataURI = utils.elToDataURI(el);
        return $("" + downloadView + " > button").data("uri", dataURI);
      }
    };
  });

}).call(this);

define('text!mylibs/pictures/views/picture.html',[],function () { return '<div class="snapshot box">\n\t<div class="wrap">\n\t\t<img class="picture" width="180" height="130" />\n\t</div>\n\t<div class="image-bottom">\n\t\t<select class="presets" style="width: 100%;" />\n\t</div>\n\t<div class="actions">\n\t\t<div class="share">\n\t\t\t<a rel="Download"><img src="images/icons/glyphicons_200_download.png" /></a>\n\t\t\t<a rel="Twitter"><img src="images/icons/glyphicons_392_twitter.png" /></a>\n\t\t</div>\n\t\t<div class="delete">\n\t\t\t<a class="trash" rel="Trash"><img src="images/icons/glyphicons_016_bin.png" /></a>\n\t\t</div>\n\t</div>\n</div>';});

(function() {

  define('mylibs/pictures/pictures',['jQuery', 'Kendo', 'mylibs/effects/effects', 'mylibs/file/file', 'text!mylibs/pictures/views/picture.html'], function($, kendo, effects, file, picture) {
    var $container, pub;
    $container = {};
    return pub = {
      init: function(containerId) {
        $container = $("#" + containerId);
        $container.masonry();
        return $.subscribe("/pictures/create", function(src, name, polaroid, save, animation) {
          var $div, $img, opacity, presets;
          $div = $(picture);
          name = name || new Date().getTime() + ".png";
          $img = $div.find(".picture").attr("src", src).data("vintagesource", src).on("click", function() {
            return $.publish("/customize", [this]);
          }).css("opacity", 0);
          $div.appendTo($container);
          presets = effects.presets();
          /*
          				$div.find(".presets").kendoDropDownList(
          					dataSource:
          						data: presets
          					dataTextField: "preset"
          					change: ->
          					    effects.applyPreset $img, @value()
          				)
          */
          if (animation) {
            $div.kendoStop(true).kendoAnimate(animation, {
              complete: function() {
                return reload();
              }
            });
          }
          if (polaroid) {
            opacity = 0;
            $.subscribe("/shake/beta", function() {
              opacity = parseFloat($wrap.css("opacity"));
              if (opacity < 1) {
                opacity = opacity + .03;
                return $img.css("opacity", opacity);
              } else {
                return $.unsubscribe("/shake/beta");
              }
            });
          } else {
            $img.css("opacity", 1);
            if (save) file.save(name, $img.attr("src"));
          }
          $div.on("click", ".download", function() {
            return $.publish("/share/download", [$img]);
          });
          $div.find(".twitter-share-button").data("url", $img.attr("src"));
          $div.on("click", ".tweet", function() {
            var intent;
            intent = new Intent("http://webintents.org/share", "image/*", $img.attr("src"));
            return window.navigator.startActivity(intent, function(data) {});
          });
          return $div.on("click", ".trash", function() {
            $.subscribe("/file/deleted/" + name, function() {
              $div.kendoStop(true).kendoAnimate({
                effects: "zoomOut fadeOut",
                hide: true,
                duration: 500,
                complete: function() {
                  $div.remove();
                  return $container.masonry("reload");
                }
              });
              return $.unsubscribe("file/deleted/" + name);
            });
            return file["delete"](name);
          });
        });
      },
      reload: function() {
        return $container.masonry("reload");
      }
    };
  });

}).call(this);

(function() {

  define('mylibs/snapshot/snapshot',['jQuery', 'Kendo', 'mylibs/pictures/pictures'], function($, kendo, effects, filters, snapshot, utils, file) {
    var $container, create, develop, polaroid, preview, pub, svg;
    polaroid = false;
    preview = {};
    $container = {};
    svg = [];
    create = function(src) {
      var animation;
      animation = {
        effects: "slideIn:down fadeIn",
        show: true,
        duration: 1000
      };
      return $.publish("/pictures/create", [src, null, false, true, animation]);
    };
    develop = function(opacity) {
      if (opacity < 1) {
        opacity = opacity + .01;
        $image.css("opacity", opacity);
      } else {
        $.unsubscribe("/shake/beta");
        $.unsubscribe("/shake/gamma");
      }
      return opacity;
    };
    return pub = {
      init: function(sender, container) {
        preview = sender;
        $container = $("#" + container);
        $.subscribe("/polaroid/change", function(e) {
          if (e.currentTarget.checked) {
            return polaroid = true;
          } else {
            return polaroid = false;
          }
        });
        return $.subscribe("/snapshot/create", function(src) {
          return create(src);
        });
      }
    };
  });

}).call(this);

(function() {

  define('libs/webgl/effects',['jQuery', 'Kendo'], function($, kendo) {
    var presets;
    return presets = function(width, height) {
      var centerX, centerY;
      centerX = width / 2;
      centerY = height / 2;
      return [
        {
          type: "none",
          method: "normal"
        }, {
          type: "shader",
          method: "bulgePinch",
          hasFrames: false,
          params: {
            centerX: centerX,
            centerY: centerY,
            radius: centerX / 1.5,
            strength: 65
          }
        }, {
          type: "shader",
          method: "bulgePinch",
          hasFrames: false,
          params: {
            centerX: centerX,
            centerY: centerY,
            radius: centerX / 2,
            strength: -.65
          }
        }, {
          type: "shader",
          method: "ink",
          hasFrames: false,
          params: {
            strength: .5
          }
        }, {
          type: "shader",
          method: "swirl",
          hasFrames: false,
          params: {
            centerX: centerX,
            centerY: centerY,
            radius: centerX / 2,
            angle: -5
          }
        }, {
          type: "shader",
          method: "zoomBlur",
          hasFrames: false,
          params: {
            centerX: centerX,
            centerY: centerY,
            strength: .8
          }
        }, {
          type: "shader",
          method: "colorHalftone",
          hasFrames: false,
          params: {
            centerX: centerX,
            centerY: centerY,
            angle: .30,
            size: 3
          }
        }, {
          type: "shader",
          method: "hexagonalPixelate",
          hasFrames: false,
          params: {
            centerX: centerX,
            centery: centerY,
            scale: 8
          }
        }, {
          type: "shader",
          method: "blockhead",
          hasFrames: false,
          params: {
            centerX: centerX,
            centerY: centerY,
            width: 200,
            height: 200,
            strength: .5
          }
        }, {
          type: "shader",
          method: "oldFilm",
          hasFrames: true,
          params: {
            frame: 0
          },
          range: {
            min: 0,
            max: 200,
            start: 0,
            step: 1
          }
        }, {
          type: "shader",
          method: "vhs",
          hasFrames: true,
          params: {
            frame: 0
          },
          range: {
            min: 0,
            max: 200,
            start: 0,
            step: 1
          }
        }
      ];
    };
  });

}).call(this);

/*
 * glfx.js
 * http://evanw.github.com/glfx.js/
 *
 * Copyright 2011 Evan Wallace
 * Released under the MIT license
 */
var fx = (function() {
var exports = {};

// src/core/canvas.js
var gl;

function clamp(lo, value, hi) {
    return Math.max(lo, Math.min(value, hi));
}

function wrapTexture(texture) {
    return {
        _: texture,
        loadContentsOf: function(element) { this._.loadContentsOf(element); },
        destroy: function() { this._.destroy(); }
    };
}

function texture(element) {
    return wrapTexture(Texture.fromElement(element));
}

function initialize(width, height) {
    // Go for floating point buffer textures if we can, it'll make the bokeh filter look a lot better
    var type = gl.getExtension('OES_texture_float') ? gl.FLOAT : gl.UNSIGNED_BYTE;

    if (this._.texture) this._.texture.destroy();
    if (this._.spareTexture) this._.spareTexture.destroy();
    this.width = width;
    this.height = height;
    this._.texture = new Texture(width, height, gl.RGBA, type);
    this._.spareTexture = new Texture(width, height, gl.RGBA, type);
    this._.extraTexture = this._.extraTexture || new Texture(0, 0, gl.RGBA, type);
    this._.flippedShader = this._.flippedShader || new Shader(null, '\
        uniform sampler2D texture;\
        varying vec2 texCoord;\
        void main() {\
            gl_FragColor = texture2D(texture, vec2(texCoord.x, 1.0 - texCoord.y));\
        }\
    ');
    this._.isInitialized = true;
}

/*
   Draw a texture to the canvas, with an optional width and height to scale to.
   If no width and height are given then the original texture width and height
   are used.
*/
function draw(texture, width, height) {
    if (!this._.isInitialized || texture._.width != this.width || texture._.height != this.height) {
        initialize.call(this, width ? width : texture._.width, height ? height : texture._.height);
    }

    texture._.use();
    this._.texture.drawTo(function() {
        Shader.getDefaultShader().drawRect();
    });

    return this;
}

function update() {
    this._.texture.use();
    this._.flippedShader.drawRect();
    return this;
}

function simpleShader(shader, uniforms, textureIn, textureOut) {
    (textureIn || this._.texture).use();
    this._.spareTexture.drawTo(function() {
        shader.uniforms(uniforms).drawRect();
    });
    this._.spareTexture.swapWith(textureOut || this._.texture);
}

function replace(node) {
    node.parentNode.insertBefore(this, node);
    node.parentNode.removeChild(node);
    return this;
}

function contents() {
    var texture = new Texture(this._.texture.width, this._.texture.height, gl.RGBA, gl.UNSIGNED_BYTE);
    this._.texture.use();
    texture.drawTo(function() {
        Shader.getDefaultShader().drawRect();
    });
    return wrapTexture(texture);
}

/*
   Get a Uint8 array of pixel values: [r, g, b, a, r, g, b, a, ...]
   Length of the array will be width * height * 4.
*/
function getPixelArray() {
    var w = this._.texture.width;
    var h = this._.texture.height;
    var array = new Uint8Array(w * h * 4);
    this._.texture.drawTo(function() {
        gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, array);
    });
    return array;
}

// Fix broken toDataURL() methods on some implementations
function toDataURL(mimeType) {
    var w = this._.texture.width;
    var h = this._.texture.height;
    var array = getPixelArray.call(this);
    var canvas2d = document.createElement('canvas');
    var c = canvas2d.getContext('2d');
    canvas2d.width = w;
    canvas2d.height = h;
    var data = c.createImageData(w, h);
    for (var i = 0; i < array.length; i++) {
        data.data[i] = array[i];
    }
    c.putImageData(data, 0, 0);
    return canvas2d.toDataURL(mimeType);
}

function wrap(func) {
    return function() {
        // Make sure that we're using the correct global WebGL context
        gl = this._.gl;

        // Now that the context has been switched, we can call the wrapped function
        return func.apply(this, arguments);
    };
}

exports.canvas = function() {
    var canvas = document.createElement('canvas');
    try {
        gl = canvas.getContext('experimental-webgl', { premultipliedAlpha: false });
    } catch (e) {
        gl = null;
    }
    if (!gl) {
        throw 'This browser does not support WebGL';
    }
    canvas._ = {
        gl: gl,
        isInitialized: false,
        texture: null,
        spareTexture: null,
        flippedShader: null
    };

    // Core methods
    canvas.texture = wrap(texture);
    canvas.draw = wrap(draw);
    canvas.update = wrap(update);
    canvas.replace = wrap(replace);
    canvas.contents = wrap(contents);
    canvas.getPixelArray = wrap(getPixelArray);
    canvas.toDataURL = wrap(toDataURL);

    // Filter methods
    canvas.brightnessContrast = wrap(brightnessContrast);
    canvas.hexagonalPixelate = wrap(hexagonalPixelate);
    canvas.hueSaturation = wrap(hueSaturation);
    canvas.colorHalftone = wrap(colorHalftone);
    canvas.triangleBlur = wrap(triangleBlur);
    canvas.kaleidoscope = wrap(kaleidoscope);
    canvas.unsharpMask = wrap(unsharpMask);
    canvas.perspective = wrap(perspective);
    canvas.matrixWarp = wrap(matrixWarp);
    canvas.bulgePinch = wrap(bulgePinch);
    canvas.quadRotate = wrap(quadRotate);
    canvas.chromeLogo = wrap(chromeLogo);
    canvas.tiltShift = wrap(tiltShift);
    canvas.dotScreen = wrap(dotScreen);
    canvas.blockhead = wrap(blockhead);
    canvas.quadColor = wrap(quadColor);
    canvas.photocopy = wrap(photocopy);
    canvas.edgeWork = wrap(edgeWork);
    canvas.lensBlur = wrap(lensBlur);
    canvas.zoomBlur = wrap(zoomBlur);
    canvas.pixelate = wrap(pixelate);
    canvas.oldFilm = wrap(oldFilm);
    canvas.denoise = wrap(denoise);
    canvas.curves = wrap(curves);
    canvas.mirror = wrap(mirror);
    canvas.invert = wrap(invert);
    canvas.swirl = wrap(swirl);
    canvas.noise = wrap(noise);
    canvas.ink = wrap(ink);
    canvas.vhs = wrap(vhs);
    canvas.vignette = wrap(vignette);
    canvas.vibrance = wrap(vibrance);
    canvas.sepia = wrap(sepia);

    return canvas;
};
exports.splineInterpolate = splineInterpolate;

// src/core/matrix.js
// from javax.media.jai.PerspectiveTransform

function getSquareToQuad(x0, y0, x1, y1, x2, y2, x3, y3) {
    var dx1 = x1 - x2;
    var dy1 = y1 - y2;
    var dx2 = x3 - x2;
    var dy2 = y3 - y2;
    var dx3 = x0 - x1 + x2 - x3;
    var dy3 = y0 - y1 + y2 - y3;
    var det = dx1*dy2 - dx2*dy1;
    var a = (dx3*dy2 - dx2*dy3) / det;
    var b = (dx1*dy3 - dx3*dy1) / det;
    return [
        x1 - x0 + a*x1, y1 - y0 + a*y1, a,
        x3 - x0 + b*x3, y3 - y0 + b*y3, b,
        x0, y0, 1
    ];
}

function getInverse(m) {
    var a = m[0], b = m[1], c = m[2];
    var d = m[3], e = m[4], f = m[5];
    var g = m[6], h = m[7], i = m[8];
    var det = a*e*i - a*f*h - b*d*i + b*f*g + c*d*h - c*e*g;
    return [
        (e*i - f*h) / det, (c*h - b*i) / det, (b*f - c*e) / det,
        (f*g - d*i) / det, (a*i - c*g) / det, (c*d - a*f) / det,
        (d*h - e*g) / det, (b*g - a*h) / det, (a*e - b*d) / det
    ];
}

function multiply(a, b) {
    return [
        a[0]*b[0] + a[1]*b[3] + a[2]*b[6],
        a[0]*b[1] + a[1]*b[4] + a[2]*b[7],
        a[0]*b[2] + a[1]*b[5] + a[2]*b[8],
        a[3]*b[0] + a[4]*b[3] + a[5]*b[6],
        a[3]*b[1] + a[4]*b[4] + a[5]*b[7],
        a[3]*b[2] + a[4]*b[5] + a[5]*b[8],
        a[6]*b[0] + a[7]*b[3] + a[8]*b[6],
        a[6]*b[1] + a[7]*b[4] + a[8]*b[7],
        a[6]*b[2] + a[7]*b[5] + a[8]*b[8]
    ];
}

// src/core/shader.js
var Shader = (function() {
    function isArray(obj) {
        return Object.prototype.toString.call(obj) == '[object Array]';
    }

    function isNumber(obj) {
        return Object.prototype.toString.call(obj) == '[object Number]';
    }

    function compileSource(type, source) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw 'compile error: ' + gl.getShaderInfoLog(shader);
        }
        return shader;
    }

    var defaultVertexSource = '\
    attribute vec2 vertex;\
    attribute vec2 _texCoord;\
    varying vec2 texCoord;\
    void main() {\
        texCoord = _texCoord;\
        gl_Position = vec4(vertex * 2.0 - 1.0, 0.0, 1.0);\
    }';

    var defaultFragmentSource = '\
    uniform sampler2D texture;\
    varying vec2 texCoord;\
    void main() {\
        gl_FragColor = texture2D(texture, texCoord);\
    }';

    function Shader(vertexSource, fragmentSource) {
        this.vertexAttribute = null;
        this.texCoordAttribute = null;
        this.program = gl.createProgram();
        vertexSource = vertexSource || defaultVertexSource;
        fragmentSource = fragmentSource || defaultFragmentSource;
        fragmentSource = 'precision highp float;' + fragmentSource; // annoying requirement is annoying
        gl.attachShader(this.program, compileSource(gl.VERTEX_SHADER, vertexSource));
        gl.attachShader(this.program, compileSource(gl.FRAGMENT_SHADER, fragmentSource));
        gl.linkProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            throw 'link error: ' + gl.getProgramInfoLog(this.program);
        }
    }

    Shader.prototype.destroy = function() {
        gl.deleteProgram(this.program);
        this.program = null;
    };

    Shader.prototype.uniforms = function(uniforms) {
        gl.useProgram(this.program);
        for (var name in uniforms) {
            if (!uniforms.hasOwnProperty(name)) continue;
            var location = gl.getUniformLocation(this.program, name);
            if (location === null) continue; // will be null if the uniform isn't used in the shader
            var value = uniforms[name];
            if (isArray(value)) {
                switch (value.length) {
                    case 1: gl.uniform1fv(location, new Float32Array(value)); break;
                    case 2: gl.uniform2fv(location, new Float32Array(value)); break;
                    case 3: gl.uniform3fv(location, new Float32Array(value)); break;
                    case 4: gl.uniform4fv(location, new Float32Array(value)); break;
                    case 9: gl.uniformMatrix3fv(location, false, new Float32Array(value)); break;
                    case 16: gl.uniformMatrix4fv(location, false, new Float32Array(value)); break;
                    default: throw 'dont\'t know how to load uniform "' + name + '" of length ' + value.length;
                }
            } else if (isNumber(value)) {
                gl.uniform1f(location, value);
            } else {
                throw 'attempted to set uniform "' + name + '" to invalid value ' + (value || 'undefined').toString();
            }
        }
        // allow chaining
        return this;
    };

    // textures are uniforms too but for some reason can't be specified by gl.uniform1f,
    // even though floating point numbers represent the integers 0 through 7 exactly
    Shader.prototype.textures = function(textures) {
        gl.useProgram(this.program);
        for (var name in textures) {
            if (!textures.hasOwnProperty(name)) continue;
            gl.uniform1i(gl.getUniformLocation(this.program, name), textures[name]);
        }
        // allow chaining
        return this;
    };

    Shader.prototype.drawRect = function(left, top, right, bottom) {
        var undefined;
        var viewport = gl.getParameter(gl.VIEWPORT);
        top = top !== undefined ? (top - viewport[1]) / viewport[3] : 0;
        left = left !== undefined ? (left - viewport[0]) / viewport[2] : 0;
        right = right !== undefined ? (right - viewport[0]) / viewport[2] : 1;
        bottom = bottom !== undefined ? (bottom - viewport[1]) / viewport[3] : 1;
        if (gl.vertexBuffer == null) {
            gl.vertexBuffer = gl.createBuffer();
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([ left, top, left, bottom, right, top, right, bottom ]), gl.STATIC_DRAW);
        if (gl.texCoordBuffer == null) {
            gl.texCoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, gl.texCoordBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([ 0, 0, 0, 1, 1, 0, 1, 1 ]), gl.STATIC_DRAW);
        }
        if (this.vertexAttribute == null) {
            this.vertexAttribute = gl.getAttribLocation(this.program, 'vertex');
            gl.enableVertexAttribArray(this.vertexAttribute);
        }
        if (this.texCoordAttribute == null) {
            this.texCoordAttribute = gl.getAttribLocation(this.program, '_texCoord');
            gl.enableVertexAttribArray(this.texCoordAttribute);
        }
        gl.useProgram(this.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
        gl.vertexAttribPointer(this.vertexAttribute, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.texCoordBuffer);
        gl.vertexAttribPointer(this.texCoordAttribute, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    Shader.getDefaultShader = function() {
        gl.defaultShader = gl.defaultShader || new Shader();
        return gl.defaultShader;
    };

    return Shader;
})();

// src/core/spline.js
// from SplineInterpolator.cs in the Paint.NET source code

function SplineInterpolator(points) {
    var n = points.length;
    this.xa = [];
    this.ya = [];
    this.u = [];
    this.y2 = [];

    points.sort(function(a, b) {
        return a[0] - b[0];
    });
    for (var i = 0; i < n; i++) {
        this.xa.push(points[i][0]);
        this.ya.push(points[i][1]);
    }

    this.u[0] = 0;
    this.y2[0] = 0;

    for (var i = 1; i < n - 1; ++i) {
        // This is the decomposition loop of the tridiagonal algorithm. 
        // y2 and u are used for temporary storage of the decomposed factors.
        var wx = this.xa[i + 1] - this.xa[i - 1];
        var sig = (this.xa[i] - this.xa[i - 1]) / wx;
        var p = sig * this.y2[i - 1] + 2.0;

        this.y2[i] = (sig - 1.0) / p;

        var ddydx = 
            (this.ya[i + 1] - this.ya[i]) / (this.xa[i + 1] - this.xa[i]) - 
            (this.ya[i] - this.ya[i - 1]) / (this.xa[i] - this.xa[i - 1]);

        this.u[i] = (6.0 * ddydx / wx - sig * this.u[i - 1]) / p;
    }

    this.y2[n - 1] = 0;

    // This is the backsubstitution loop of the tridiagonal algorithm
    for (var i = n - 2; i >= 0; --i) {
        this.y2[i] = this.y2[i] * this.y2[i + 1] + this.u[i];
    }
}

SplineInterpolator.prototype.interpolate = function(x) {
    var n = this.ya.length;
    var klo = 0;
    var khi = n - 1;

    // We will find the right place in the table by means of
    // bisection. This is optimal if sequential calls to this
    // routine are at random values of x. If sequential calls
    // are in order, and closely spaced, one would do better
    // to store previous values of klo and khi.
    while (khi - klo > 1) {
        var k = (khi + klo) >> 1;

        if (this.xa[k] > x) {
            khi = k; 
        } else {
            klo = k;
        }
    }

    var h = this.xa[khi] - this.xa[klo];
    var a = (this.xa[khi] - x) / h;
    var b = (x - this.xa[klo]) / h;

    // Cubic spline polynomial is now evaluated.
    return a * this.ya[klo] + b * this.ya[khi] + 
        ((a * a * a - a) * this.y2[klo] + (b * b * b - b) * this.y2[khi]) * (h * h) / 6.0;
};

// src/core/texture.js
var Texture = (function() {
    Texture.fromElement = function(element) {
        var texture = new Texture(0, 0, gl.RGBA, gl.UNSIGNED_BYTE);
        texture.loadContentsOf(element);
        return texture;
    };

    function Texture(width, height, format, type) {
        this.id = gl.createTexture();
        this.width = width;
        this.height = height;
        this.format = format;
        this.type = type;

        gl.bindTexture(gl.TEXTURE_2D, this.id);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        if (width && height) gl.texImage2D(gl.TEXTURE_2D, 0, this.format, width, height, 0, this.format, this.type, null);
    }

    Texture.prototype.loadContentsOf = function(element) {
        this.width = element.width || element.videoWidth;
        this.height = element.height || element.videoHeight;
        gl.bindTexture(gl.TEXTURE_2D, this.id);
        gl.texImage2D(gl.TEXTURE_2D, 0, this.format, this.format, this.type, element);
    };

    Texture.prototype.initFromBytes = function(width, height, data) {
        this.width = width;
        this.height = height;
        this.format = gl.RGBA;
        this.type = gl.UNSIGNED_BYTE;
        gl.bindTexture(gl.TEXTURE_2D, this.id);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, this.type, new Uint8Array(data));
    };

    Texture.prototype.destroy = function() {
        gl.deleteTexture(this.id);
        this.id = null;
    };

    Texture.prototype.use = function(unit) {
        gl.activeTexture(gl.TEXTURE0 + (unit || 0));
        gl.bindTexture(gl.TEXTURE_2D, this.id);
    };

    Texture.prototype.unuse = function(unit) {
        gl.activeTexture(gl.TEXTURE0 + (unit || 0));
        gl.bindTexture(gl.TEXTURE_2D, null);
    };

    Texture.prototype.ensureFormat = function(width, height, format, type) {
        // allow passing an existing texture instead of individual arguments
        if (arguments.length == 1) {
            var texture = arguments[0];
            width = texture.width;
            height = texture.height;
            format = texture.format;
            type = texture.type;
        }

        // change the format only if required
        if (width != this.width || height != this.height || format != this.format || type != this.type) {
            this.width = width;
            this.height = height;
            this.format = format;
            this.type = type;
            gl.bindTexture(gl.TEXTURE_2D, this.id);
            gl.texImage2D(gl.TEXTURE_2D, 0, this.format, width, height, 0, this.format, this.type, null);
        }
    };

    Texture.prototype.drawTo = function(callback) {
        // start rendering to this texture
        gl.framebuffer = gl.framebuffer || gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, gl.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.id, 0);
        gl.viewport(0, 0, this.width, this.height);

        // do the drawing
        callback();

        // stop rendering to this texture
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };

    var canvas = null;

    function getCanvas(texture) {
        if (canvas == null) canvas = document.createElement('canvas');
        canvas.width = texture.width;
        canvas.height = texture.height;
        var c = canvas.getContext('2d');
        c.clearRect(0, 0, canvas.width, canvas.height);
        return c;
    }

    Texture.prototype.fillUsingCanvas = function(callback) {
        callback(getCanvas(this));
        this.format = gl.RGBA;
        this.type = gl.UNSIGNED_BYTE;
        gl.bindTexture(gl.TEXTURE_2D, this.id);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
        return this;
    };

    Texture.prototype.toImage = function(image) {
        this.use();
        Shader.getDefaultShader().drawRect();
        var size = this.width * this.height * 4;
        var pixels = new Uint8Array(size);
        var c = getCanvas(this);
        var data = c.createImageData(this.width, this.height);
        gl.readPixels(0, 0, this.width, this.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        for (var i = 0; i < size; i++) {
            data.data[i] = pixels[i];
        }
        c.putImageData(data, 0, 0);
        image.src = canvas.toDataURL();
    };

    Texture.prototype.swapWith = function(other) {
        var temp;
        temp = other.id; other.id = this.id; this.id = temp;
        temp = other.width; other.width = this.width; this.width = temp;
        temp = other.height; other.height = this.height; this.height = temp;
        temp = other.format; other.format = this.format; this.format = temp;
    };

    return Texture;
})();

// src/filters/common.js
function warpShader(uniforms, warp) {
    return new Shader(null, uniforms + '\
    uniform sampler2D texture;\
    uniform vec2 texSize;\
    varying vec2 texCoord;\
    void main() {\
        vec2 coord = texCoord * texSize;\
        ' + warp + '\
        gl_FragColor = texture2D(texture, coord / texSize);\
        vec2 clampedCoord = clamp(coord, vec2(0.0), texSize);\
        if (coord != clampedCoord) {\
            /* fade to transparent if we are outside the image */\
            gl_FragColor.a *= max(0.0, 1.0 - length(coord - clampedCoord));\
        }\
    }');
}

// returns a random number between 0 and 1
var randomShaderFunc = '\
    float random(vec3 scale, float seed) {\
        /* use the fragment position for a different seed per-pixel */\
        return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\
    }\
';

// src/filters/adjust/brightnesscontrast.js
/**
 * @filter           Brightness / Contrast
 * @description      Provides additive brightness and multiplicative contrast control.
 * @param brightness -1 to 1 (-1 is solid black, 0 is no change, and 1 is solid white)
 * @param contrast   -1 to 1 (-1 is solid gray, 0 is no change, and 1 is maximum contrast)
 */
function brightnessContrast(brightness, contrast) {
    gl.brightnessContrast = gl.brightnessContrast || new Shader(null, '\
        uniform sampler2D texture;\
        uniform float brightness;\
        uniform float contrast;\
        varying vec2 texCoord;\
        void main() {\
            vec4 color = texture2D(texture, texCoord);\
            color.rgb += brightness;\
            if (contrast > 0.0) {\
                color.rgb = (color.rgb - 0.5) / (1.0 - contrast) + 0.5;\
            } else {\
                color.rgb = (color.rgb - 0.5) * (1.0 + contrast) + 0.5;\
            }\
            gl_FragColor = color;\
        }\
    ');

    simpleShader.call(this, gl.brightnessContrast, {
        brightness: clamp(-1, brightness, 1),
        contrast: clamp(-1, contrast, 1)
    });

    return this;
}

// src/filters/adjust/curves.js
function splineInterpolate(points) {
    var interpolator = new SplineInterpolator(points);
    var array = [];
    for (var i = 0; i < 256; i++) {
        array.push(clamp(0, Math.floor(interpolator.interpolate(i / 255) * 256), 255));
    }
    return array;
}

/**
 * @filter      Curves
 * @description A powerful mapping tool that transforms the colors in the image
 *              by an arbitrary function. The function is interpolated between
 *              a set of 2D points using splines. The curves filter can take
 *              either one or three arguments which will apply the mapping to
 *              either luminance or RGB values, respectively.
 * @param red   A list of points that define the function for the red channel.
 *              Each point is a list of two values: the value before the mapping
 *              and the value after the mapping, both in the range 0 to 1. For
 *              example, [[0,1], [1,0]] would invert the red channel while
 *              [[0,0], [1,1]] would leave the red channel unchanged. If green
 *              and blue are omitted then this argument also applies to the
 *              green and blue channels.
 * @param green (optional) A list of points that define the function for the green
 *              channel (just like for red).
 * @param blue  (optional) A list of points that define the function for the blue
 *              channel (just like for red).
 */
function curves(red, green, blue) {
    // Create the ramp texture
    red = splineInterpolate(red);
    if (arguments.length == 1) {
        green = blue = red;
    } else {
        green = splineInterpolate(green);
        blue = splineInterpolate(blue);
    }
    var array = [];
    for (var i = 0; i < 256; i++) {
        array.splice(array.length, 0, red[i], green[i], blue[i], 255);
    }
    this._.extraTexture.initFromBytes(256, 1, array);
    this._.extraTexture.use(1);

    gl.curves = gl.curves || new Shader(null, '\
        uniform sampler2D texture;\
        uniform sampler2D map;\
        varying vec2 texCoord;\
        void main() {\
            vec4 color = texture2D(texture, texCoord);\
            color.r = texture2D(map, vec2(color.r)).r;\
            color.g = texture2D(map, vec2(color.g)).g;\
            color.b = texture2D(map, vec2(color.b)).b;\
            gl_FragColor = color;\
        }\
    ');

    gl.curves.textures({
        map: 1
    });
    simpleShader.call(this, gl.curves, {});

    return this;
}

// src/filters/adjust/denoise.js
/**
 * @filter         Denoise
 * @description    Smooths over grainy noise in dark images using an 9x9 box filter
 *                 weighted by color intensity, similar to a bilateral filter.
 * @param exponent The exponent of the color intensity difference, should be greater
 *                 than zero. A value of zero just gives an 9x9 box blur and high values
 *                 give the original image, but ideal values are usually around 10-20.
 */
function denoise(exponent) {
    // Do a 9x9 bilateral box filter
    gl.denoise = gl.denoise || new Shader(null, '\
        uniform sampler2D texture;\
        uniform float exponent;\
        uniform float strength;\
        uniform vec2 texSize;\
        varying vec2 texCoord;\
        void main() {\
            vec4 center = texture2D(texture, texCoord);\
            vec4 color = vec4(0.0);\
            float total = 0.0;\
            for (float x = -4.0; x <= 4.0; x += 1.0) {\
                for (float y = -4.0; y <= 4.0; y += 1.0) {\
                    vec4 sample = texture2D(texture, texCoord + vec2(x, y) / texSize);\
                    float weight = 1.0 - abs(dot(sample.rgb - center.rgb, vec3(0.25)));\
                    weight = pow(weight, exponent);\
                    color += sample * weight;\
                    total += weight;\
                }\
            }\
            gl_FragColor = color / total;\
        }\
    ');

    // Perform two iterations for stronger results
    for (var i = 0; i < 2; i++) {
        simpleShader.call(this, gl.denoise, {
            exponent: Math.max(0, exponent),
            texSize: [this.width, this.height]
        });
    }

    return this;
}

// src/filters/adjust/huesaturation.js
/**
 * @filter           Hue / Saturation
 * @description      Provides rotational hue and multiplicative saturation control. RGB color space
 *                   can be imagined as a cube where the axes are the red, green, and blue color
 *                   values. Hue changing works by rotating the color vector around the grayscale
 *                   line, which is the straight line from black (0, 0, 0) to white (1, 1, 1).
 *                   Saturation is implemented by scaling all color channel values either toward
 *                   or away from the average color channel value.
 * @param hue        -1 to 1 (-1 is 180 degree rotation in the negative direction, 0 is no change,
 *                   and 1 is 180 degree rotation in the positive direction)
 * @param saturation -1 to 1 (-1 is solid gray, 0 is no change, and 1 is maximum contrast)
 */
function hueSaturation(hue, saturation) {
    gl.hueSaturation = gl.hueSaturation || new Shader(null, '\
        uniform sampler2D texture;\
        uniform float hue;\
        uniform float saturation;\
        varying vec2 texCoord;\
        void main() {\
            vec4 color = texture2D(texture, texCoord);\
            \
            /* hue adjustment, wolfram alpha: RotationTransform[angle, {1, 1, 1}][{x, y, z}] */\
            float angle = hue * 3.14159265;\
            float s = sin(angle), c = cos(angle);\
            vec3 weights = (vec3(2.0 * c, -sqrt(3.0) * s - c, sqrt(3.0) * s - c) + 1.0) / 3.0;\
            float len = length(color.rgb);\
            color.rgb = vec3(\
                dot(color.rgb, weights.xyz),\
                dot(color.rgb, weights.zxy),\
                dot(color.rgb, weights.yzx)\
            );\
            \
            /* saturation adjustment */\
            float average = (color.r + color.g + color.b) / 3.0;\
            if (saturation > 0.0) {\
                color.rgb += (average - color.rgb) * (1.0 - 1.0 / (1.001 - saturation));\
            } else {\
                color.rgb += (average - color.rgb) * (-saturation);\
            }\
            \
            gl_FragColor = color;\
        }\
    ');

    simpleShader.call(this, gl.hueSaturation, {
        hue: clamp(-1, hue, 1),
        saturation: clamp(-1, saturation, 1)
    });

    return this;
}

// src/filters/adjust/noise.js
/**
 * @filter         Noise
 * @description    Adds black and white noise to the image.
 * @param amount   0 to 1 (0 for no effect, 1 for maximum noise)
 */
function noise(amount) {
    gl.noise = gl.noise || new Shader(null, '\
        uniform sampler2D texture;\
        uniform float amount;\
        varying vec2 texCoord;\
        float rand(vec2 co) {\
            return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\
        }\
        void main() {\
            vec4 color = texture2D(texture, texCoord);\
            \
            float diff = (rand(texCoord) - 0.5) * amount;\
            color.r += diff;\
            color.g += diff;\
            color.b += diff;\
            \
            gl_FragColor = color;\
        }\
    ');

    simpleShader.call(this, gl.noise, {
        amount: clamp(0, amount, 1)
    });

    return this;
}

// src/filters/adjust/sepia.js
/**
 * @filter         Sepia
 * @description    Gives the image a reddish-brown monochrome tint that imitates an old photograph.
 * @param amount   0 to 1 (0 for no effect, 1 for full sepia coloring)
 */
function sepia(amount) {
    gl.sepia = gl.sepia || new Shader(null, '\
        uniform sampler2D texture;\
        uniform float amount;\
        varying vec2 texCoord;\
        void main() {\
            vec4 color = texture2D(texture, texCoord);\
            float r = color.r;\
            float g = color.g;\
            float b = color.b;\
            \
            color.r = min(1.0, (r * (1.0 - (0.607 * amount))) + (g * (0.769 * amount)) + (b * (0.189 * amount)));\
            color.g = min(1.0, (r * 0.349 * amount) + (g * (1.0 - (0.314 * amount))) + (b * 0.168 * amount));\
            color.b = min(1.0, (r * 0.272 * amount) + (g * 0.534 * amount) + (b * (1.0 - (0.869 * amount))));\
            \
            gl_FragColor = color;\
        }\
    ');

    simpleShader.call(this, gl.sepia, {
        amount: clamp(0, amount, 1)
    });

    return this;
}

// src/filters/adjust/unsharpmask.js
/**
 * @filter         Unsharp Mask
 * @description    A form of image sharpening that amplifies high-frequencies in the image. It
 *                 is implemented by scaling pixels away from the average of their neighbors.
 * @param radius   The blur radius that calculates the average of the neighboring pixels.
 * @param strength A scale factor where 0 is no effect and higher values cause a stronger effect.
 */
function unsharpMask(radius, strength) {
    gl.unsharpMask = gl.unsharpMask || new Shader(null, '\
        uniform sampler2D blurredTexture;\
        uniform sampler2D originalTexture;\
        uniform float strength;\
        uniform float threshold;\
        varying vec2 texCoord;\
        void main() {\
            vec4 blurred = texture2D(blurredTexture, texCoord);\
            vec4 original = texture2D(originalTexture, texCoord);\
            gl_FragColor = mix(blurred, original, 1.0 + strength);\
        }\
    ');

    // Store a copy of the current texture in the second texture unit
    this._.extraTexture.ensureFormat(this._.texture);
    this._.texture.use();
    this._.extraTexture.drawTo(function() {
        Shader.getDefaultShader().drawRect();
    });

    // Blur the current texture, then use the stored texture to detect edges
    this._.extraTexture.use(1);
    this.triangleBlur(radius);
    gl.unsharpMask.textures({
        originalTexture: 1
    });
    simpleShader.call(this, gl.unsharpMask, {
        strength: strength
    });
    this._.extraTexture.unuse(1);

    return this;
}

// src/filters/adjust/vibrance.js
/**
 * @filter       Vibrance
 * @description  Modifies the saturation of desaturated colors, leaving saturated colors unmodified.
 * @param amount -1 to 1 (-1 is minimum vibrance, 0 is no change, and 1 is maximum vibrance)
 */
function vibrance(amount) {
    gl.vibrance = gl.vibrance || new Shader(null, '\
        uniform sampler2D texture;\
        uniform float amount;\
        varying vec2 texCoord;\
        void main() {\
            vec4 color = texture2D(texture, texCoord);\
            float average = (color.r + color.g + color.b) / 3.0;\
            float mx = max(color.r, max(color.g, color.b));\
            float amt = (mx - average) * (-amount * 3.0);\
            color.rgb = mix(color.rgb, vec3(mx), amt);\
            gl_FragColor = color;\
        }\
    ');

    simpleShader.call(this, gl.vibrance, {
        amount: clamp(-1, amount, 1)
    });

    return this;
}

// src/filters/adjust/vignette.js
/**
 * @filter         Vignette
 * @description    Adds a simulated lens edge darkening effect.
 * @param size     0 to 1 (0 for center of frame, 1 for edge of frame)
 * @param amount   0 to 1 (0 for no effect, 1 for maximum lens darkening)
 */
function vignette(size, amount) {
    gl.vignette = gl.vignette || new Shader(null, '\
        uniform sampler2D texture;\
        uniform float size;\
        uniform float amount;\
        varying vec2 texCoord;\
        void main() {\
            vec4 color = texture2D(texture, texCoord);\
            \
            float dist = distance(texCoord, vec2(0.5, 0.5));\
            color.rgb *= smoothstep(0.8, size * 0.799, dist * (amount + size));\
            \
            gl_FragColor = color;\
        }\
    ');

    simpleShader.call(this, gl.vignette, {
        size: clamp(0, size, 1),
        amount: clamp(0, amount, 1)
    });

    return this;
}

// src/filters/blur/lensblur.js
/**
 * @filter           Lens Blur
 * @description      Imitates a camera capturing the image out of focus by using a blur that generates
 *                   the large shapes known as bokeh. The polygonal shape of real bokeh is due to the
 *                   blades of the aperture diaphragm when it isn't fully open. This blur renders
 *                   bokeh from a 6-bladed diaphragm because the computation is more efficient. It
 *                   can be separated into three rhombi, each of which is just a skewed box blur.
 *                   This filter makes use of the floating point texture WebGL extension to implement
 *                   the brightness parameter, so there will be severe visual artifacts if brightness
 *                   is non-zero and the floating point texture extension is not available. The
 *                   idea was from John White's SIGGRAPH 2011 talk but this effect has an additional
 *                   brightness parameter that fakes what would otherwise come from a HDR source.
 * @param radius     the radius of the hexagonal disk convolved with the image
 * @param brightness -1 to 1 (the brightness of the bokeh, negative values will create dark bokeh)
 * @param angle      the rotation of the bokeh in radians
 */
function lensBlur(radius, brightness, angle) {
    // All averaging is done on values raised to a power to make more obvious bokeh
    // (we will raise the average to the inverse power at the end to compensate).
    // Without this the image looks almost like a normal blurred image. This hack is
    // obviously not realistic, but to accurately simulate this we would need a high
    // dynamic range source photograph which we don't have.
    gl.lensBlurPrePass = gl.lensBlurPrePass || new Shader(null, '\
        uniform sampler2D texture;\
        uniform float power;\
        varying vec2 texCoord;\
        void main() {\
            vec4 color = texture2D(texture, texCoord);\
            color = pow(color, vec4(power));\
            gl_FragColor = vec4(color);\
        }\
    ');

    var common = '\
        uniform sampler2D texture0;\
        uniform sampler2D texture1;\
        uniform vec2 delta0;\
        uniform vec2 delta1;\
        uniform float power;\
        varying vec2 texCoord;\
        ' + randomShaderFunc + '\
        vec4 sample(vec2 delta) {\
            /* randomize the lookup values to hide the fixed number of samples */\
            float offset = random(vec3(delta, 151.7182), 0.0);\
            \
            vec4 color = vec4(0.0);\
            float total = 0.0;\
            for (float t = 0.0; t <= 30.0; t++) {\
                float percent = (t + offset) / 30.0;\
                color += texture2D(texture0, texCoord + delta * percent);\
                total += 1.0;\
            }\
            return color / total;\
        }\
    ';

    gl.lensBlur0 = gl.lensBlur0 || new Shader(null, common + '\
        void main() {\
            gl_FragColor = sample(delta0);\
        }\
    ');
    gl.lensBlur1 = gl.lensBlur1 || new Shader(null, common + '\
        void main() {\
            gl_FragColor = (sample(delta0) + sample(delta1)) * 0.5;\
        }\
    ');
    gl.lensBlur2 = gl.lensBlur2 || new Shader(null, common + '\
        void main() {\
            vec4 color = (sample(delta0) + 2.0 * texture2D(texture1, texCoord)) / 3.0;\
            gl_FragColor = pow(color, vec4(power));\
        }\
    ').textures({ texture1: 1 });

    // Generate
    var dir = [];
    for (var i = 0; i < 3; i++) {
        var a = angle + i * Math.PI * 2 / 3;
        dir.push([radius * Math.sin(a) / this.width, radius * Math.cos(a) / this.height]);
    }
    var power = Math.pow(10, clamp(-1, brightness, 1));

    // Remap the texture values, which will help make the bokeh effect
    simpleShader.call(this, gl.lensBlurPrePass, {
        power: power
    });

    // Blur two rhombi in parallel into extraTexture
    this._.extraTexture.ensureFormat(this._.texture);
    simpleShader.call(this, gl.lensBlur0, {
        delta0: dir[0]
    }, this._.texture, this._.extraTexture);
    simpleShader.call(this, gl.lensBlur1, {
        delta0: dir[1],
        delta1: dir[2]
    }, this._.extraTexture, this._.extraTexture);

    // Blur the last rhombus and combine with extraTexture
    simpleShader.call(this, gl.lensBlur0, {
        delta0: dir[1]
    });
    this._.extraTexture.use(1);
    simpleShader.call(this, gl.lensBlur2, {
        power: 1 / power,
        delta0: dir[2]
    });

    return this;
}

// src/filters/blur/pixelate.js
/**
 * @filter        Pixelate
 * @description   Renders the image at a lower resolution using square tiles. Tile colors
 *                are nearest-neighbor sampled from the centers of the tiles.
 * @param centerX The x coordinate of the pattern center.
 * @param centerY The y coordinate of the pattern center.
 * @param scale   The width of an individual tile, in pixels.
 */
function pixelate(centerX, centerY, scale) {
    gl.pixelate = gl.pixelate || new Shader(null, '\
        uniform sampler2D texture;\
        uniform vec2 center;\
        uniform float scale;\
        uniform vec2 texSize;\
        varying vec2 texCoord;\
        void main() {\
            vec2 tex = (texCoord * texSize - center) / scale;\
            vec2 choice = floor(tex) + 0.5;\
            choice *= scale / texSize;\
            gl_FragColor = texture2D(texture, choice + center / texSize);\
        }\
    ');

    simpleShader.call(this, gl.pixelate, {
        center: [centerX, centerY],
        scale: scale,
        texSize: [this.width, this.height]
    });

    return this;
}

// src/filters/blur/tiltshift.js
/**
 * @filter               Tilt Shift
 * @description          Simulates the shallow depth of field normally encountered in close-up
 *                       photography, which makes the scene seem much smaller than it actually
 *                       is. This filter assumes the scene is relatively planar, in which case
 *                       the part of the scene that is completely in focus can be described by
 *                       a line (the intersection of the focal plane and the scene). An example
 *                       of a planar scene might be looking at a road from above at a downward
 *                       angle. The image is then blurred with a blur radius that starts at zero
 *                       on the line and increases further from the line.
 * @param startX         The x coordinate of the start of the line segment.
 * @param startY         The y coordinate of the start of the line segment.
 * @param endX           The x coordinate of the end of the line segment.
 * @param endY           The y coordinate of the end of the line segment.
 * @param blurRadius     The maximum radius of the pyramid blur.
 * @param gradientRadius The distance from the line at which the maximum blur radius is reached.
 */
function tiltShift(startX, startY, endX, endY, blurRadius, gradientRadius) {
    gl.tiltShift = gl.tiltShift || new Shader(null, '\
        uniform sampler2D texture;\
        uniform float blurRadius;\
        uniform float gradientRadius;\
        uniform vec2 start;\
        uniform vec2 end;\
        uniform vec2 delta;\
        uniform vec2 texSize;\
        varying vec2 texCoord;\
        ' + randomShaderFunc + '\
        void main() {\
            vec4 color = vec4(0.0);\
            float total = 0.0;\
            \
            /* randomize the lookup values to hide the fixed number of samples */\
            float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\
            \
            vec2 normal = normalize(vec2(start.y - end.y, end.x - start.x));\
            float radius = smoothstep(0.0, 1.0, abs(dot(texCoord * texSize - start, normal)) / gradientRadius) * blurRadius;\
            for (float t = -30.0; t <= 30.0; t++) {\
                float percent = (t + offset - 0.5) / 30.0;\
                float weight = 1.0 - abs(percent);\
                vec4 sample = texture2D(texture, texCoord + delta / texSize * percent * radius);\
                \
                /* switch to pre-multiplied alpha to correctly blur transparent images */\
                sample.rgb *= sample.a;\
                \
                color += sample * weight;\
                total += weight;\
            }\
            \
            gl_FragColor = color / total;\
            \
            /* switch back from pre-multiplied alpha */\
            gl_FragColor.rgb /= gl_FragColor.a + 0.00001;\
        }\
    ');

    var dx = endX - startX;
    var dy = endY - startY;
    var d = Math.sqrt(dx * dx + dy * dy);
    simpleShader.call(this, gl.tiltShift, {
        blurRadius: blurRadius,
        gradientRadius: gradientRadius,
        start: [startX, startY],
        end: [endX, endY],
        delta: [dx / d, dy / d],
        texSize: [this.width, this.height]
    });
    simpleShader.call(this, gl.tiltShift, {
        blurRadius: blurRadius,
        gradientRadius: gradientRadius,
        start: [startX, startY],
        end: [endX, endY],
        delta: [-dy / d, dx / d],
        texSize: [this.width, this.height]
    });

    return this;
}

// src/filters/blur/triangleblur.js
/**
 * @filter       Triangle Blur
 * @description  This is the most basic blur filter, which convolves the image with a
 *               pyramid filter. The pyramid filter is separable and is applied as two
 *               perpendicular triangle filters.
 * @param radius The radius of the pyramid convolved with the image.
 */
function triangleBlur(radius) {
    gl.triangleBlur = gl.triangleBlur || new Shader(null, '\
        uniform sampler2D texture;\
        uniform vec2 delta;\
        varying vec2 texCoord;\
        ' + randomShaderFunc + '\
        void main() {\
            vec4 color = vec4(0.0);\
            float total = 0.0;\
            \
            /* randomize the lookup values to hide the fixed number of samples */\
            float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\
            \
            for (float t = -30.0; t <= 30.0; t++) {\
                float percent = (t + offset - 0.5) / 30.0;\
                float weight = 1.0 - abs(percent);\
                vec4 sample = texture2D(texture, texCoord + delta * percent);\
                \
                /* switch to pre-multiplied alpha to correctly blur transparent images */\
                sample.rgb *= sample.a;\
                \
                color += sample * weight;\
                total += weight;\
            }\
            \
            gl_FragColor = color / total;\
            \
            /* switch back from pre-multiplied alpha */\
            gl_FragColor.rgb /= gl_FragColor.a + 0.00001;\
        }\
    ');

    simpleShader.call(this, gl.triangleBlur, {
        delta: [radius / this.width, 0]
    });
    simpleShader.call(this, gl.triangleBlur, {
        delta: [0, radius / this.height]
    });

    return this;
}

// src/filters/blur/zoomblur.js
/**
 * @filter         Zoom Blur
 * @description    Blurs the image away from a certain point, which looks like radial motion blur.
 * @param centerX  The x coordinate of the blur origin.
 * @param centerY  The y coordinate of the blur origin.
 * @param strength The strength of the blur. Values in the range 0 to 1 are usually sufficient,
 *                 where 0 doesn't change the image and 1 creates a highly blurred image.
 */
function zoomBlur(centerX, centerY, strength) {
    gl.zoomBlur = gl.zoomBlur || new Shader(null, '\
        uniform sampler2D texture;\
        uniform vec2 center;\
        uniform float strength;\
        uniform vec2 texSize;\
        varying vec2 texCoord;\
        ' + randomShaderFunc + '\
        void main() {\
            vec4 color = vec4(0.0);\
            float total = 0.0;\
            vec2 toCenter = center - texCoord * texSize;\
            \
            /* randomize the lookup values to hide the fixed number of samples */\
            float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\
            \
            for (float t = 0.0; t <= 40.0; t++) {\
                float percent = (t + offset) / 40.0;\
                float weight = 4.0 * (percent - percent * percent);\
                vec4 sample = texture2D(texture, texCoord + toCenter * percent * strength / texSize);\
                \
                /* switch to pre-multiplied alpha to correctly blur transparent images */\
                sample.rgb *= sample.a;\
                \
                color += sample * weight;\
                total += weight;\
            }\
            \
            gl_FragColor = color / total;\
            \
            /* switch back from pre-multiplied alpha */\
            gl_FragColor.rgb /= gl_FragColor.a + 0.00001;\
        }\
    ');

    simpleShader.call(this, gl.zoomBlur, {
        center: [centerX, centerY],
        strength: strength,
        texSize: [this.width, this.height]
    });

    return this;
}

// src/filters/fun/chromelogo.js
/**
 * @filter           Chrome Logo
 * @description      Overlays the logo of the Chrome browser.
 * @param centerX    The x coordinate of the logo.
 * @param centerY    The y coordinate of the logo.
 * @param angle      The angle of the logo in degrees.
 * @param radius     The diameter of the logo in pixels.
 * @param isInfinite Whether the logo stays within the circle or extends to the image border.
 */
function chromeLogo(centerX, centerY, angle, radius, isInfinite) {
    gl.chromeLogo = gl.chromeLogo || new Shader(null, '\
        uniform sampler2D texture;\
        uniform vec2 center;\
        uniform float angle;\
        uniform float radius;\
        uniform float isInfinite;\
        uniform vec2 texSize;\
        varying vec2 texCoord;\
        \
        void main() {\
            vec4 color = texture2D(texture, texCoord);\
            vec2 coord = (texCoord * texSize - center) / vec2(radius, -radius);\
            float s = sin(angle), c = cos(angle);\
            coord = vec2(dot(vec2(c, s), coord), dot(vec2(-s, c), coord));\
            \
            const float twopi = 6.283185307179586;\
            const float sin60 = 0.866025403784439;\
            const float blueRadius = 0.37;\
            const float whiteRadius = 0.44;\
            vec2 polar = vec2(fract((atan(coord.y, coord.x)) / twopi), length(coord));\
            if (polar.y < 1.0 || isInfinite == 1.0) {\
                color.rgb = vec3(color.r + color.g + color.b) / 3.0;\
                if (polar.y < blueRadius) {\
                    color.rgb *= vec3(0.25, 0.5, 0.75);\
                } else if (polar.y > whiteRadius) {\
                    if (polar.x < 0.25 && coord.y > whiteRadius || polar.x >= 0.25 && polar.x < 3.5 / 6.0 && dot(vec2(-sin60, -0.5), coord) < whiteRadius) {\
                        color.rgb *= vec3(1.0, 0.25, 0.0);\
                    } else if (polar.x >= 1.5 / 6.0 && polar.x < 5.5 / 6.0 && dot(vec2(sin60, -0.5), coord) < whiteRadius) {\
                        color.rgb *= vec3(0.5, 0.75, 0.25);\
                    } else {\
                        color.rgb *= vec3(1.0, 1.0, 0.25);\
                    }\
                }\
            }\
            \
            gl_FragColor = color;\
        }\
    ');

    simpleShader.call(this, gl.chromeLogo, {
        center: [centerX, centerY],
        angle: angle,
        radius: radius,
        isInfinite: +isInfinite,
        texSize: [this.width, this.height]
    });

    return this;
}

// src/filters/fun/colorhalftone.js
/**
 * @filter        Color Halftone
 * @description   Simulates a CMYK halftone rendering of the image by multiplying pixel values
 *                with a four rotated 2D sine wave patterns, one each for cyan, magenta, yellow,
 *                and black.
 * @param centerX The x coordinate of the pattern origin.
 * @param centerY The y coordinate of the pattern origin.
 * @param angle   The rotation of the pattern in radians.
 * @param size    The diameter of a dot in pixels.
 */
function colorHalftone(centerX, centerY, angle, size) {
    gl.colorHalftone = gl.colorHalftone || new Shader(null, '\
        uniform sampler2D texture;\
        uniform vec2 center;\
        uniform float angle;\
        uniform float scale;\
        uniform vec2 texSize;\
        varying vec2 texCoord;\
        \
        float pattern(float angle) {\
            float s = sin(angle), c = cos(angle);\
            vec2 tex = texCoord * texSize - center;\
            vec2 point = vec2(\
                c * tex.x - s * tex.y,\
                s * tex.x + c * tex.y\
            ) * scale;\
            return (sin(point.x) * sin(point.y)) * 4.0;\
        }\
        \
        void main() {\
            vec4 color = texture2D(texture, texCoord);\
            vec3 cmy = 1.0 - color.rgb;\
            float k = min(cmy.x, min(cmy.y, cmy.z));\
            cmy = (cmy - k) / (1.0 - k);\
            cmy = clamp(cmy * 10.0 - 3.0 + vec3(pattern(angle + 0.26179), pattern(angle + 1.30899), pattern(angle)), 0.0, 1.0);\
            k = clamp(k * 10.0 - 5.0 + pattern(angle + 0.78539), 0.0, 1.0);\
            gl_FragColor = vec4(1.0 - cmy - k, color.a);\
        }\
    ');

    simpleShader.call(this, gl.colorHalftone, {
        center: [centerX, centerY],
        angle: angle,
        scale: Math.PI / size,
        texSize: [this.width, this.height]
    });

    return this;
}

// src/filters/fun/dotscreen.js
/**
 * @filter        Dot Screen
 * @description   Simulates a black and white halftone rendering of the image by multiplying
 *                pixel values with a rotated 2D sine wave pattern.
 * @param centerX The x coordinate of the pattern origin.
 * @param centerY The y coordinate of the pattern origin.
 * @param angle   The rotation of the pattern in radians.
 * @param size    The diameter of a dot in pixels.
 */
function dotScreen(centerX, centerY, angle, size) {
    gl.dotScreen = gl.dotScreen || new Shader(null, '\
        uniform sampler2D texture;\
        uniform vec2 center;\
        uniform float angle;\
        uniform float scale;\
        uniform vec2 texSize;\
        varying vec2 texCoord;\
        \
        float pattern() {\
            float s = sin(angle), c = cos(angle);\
            vec2 tex = texCoord * texSize - center;\
            vec2 point = vec2(\
                c * tex.x - s * tex.y,\
                s * tex.x + c * tex.y\
            ) * scale;\
            return (sin(point.x) * sin(point.y)) * 4.0;\
        }\
        \
        void main() {\
            vec4 color = texture2D(texture, texCoord);\
            float average = (color.r + color.g + color.b) / 3.0;\
            gl_FragColor = vec4(vec3(average * 10.0 - 5.0 + pattern()), color.a);\
        }\
    ');

    simpleShader.call(this, gl.dotScreen, {
        center: [centerX, centerY],
        angle: angle,
        scale: Math.PI / size,
        texSize: [this.width, this.height]
    });

    return this;
}

// src/filters/fun/edgework.js
/**
 * @filter       Edge Work
 * @description  Picks out different frequencies in the image by subtracting two
 *               copies of the image blurred with different radii.
 * @param radius The radius of the effect in pixels.
 */
function edgeWork(radius) {
    gl.edgeWork1 = gl.edgeWork1 || new Shader(null, '\
        uniform sampler2D texture;\
        uniform vec2 delta;\
        varying vec2 texCoord;\
        ' + randomShaderFunc + '\
        void main() {\
            vec2 color = vec2(0.0);\
            vec2 total = vec2(0.0);\
            \
            /* randomize the lookup values to hide the fixed number of samples */\
            float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\
            \
            for (float t = -30.0; t <= 30.0; t++) {\
                float percent = (t + offset - 0.5) / 30.0;\
                float weight = 1.0 - abs(percent);\
                vec3 sample = texture2D(texture, texCoord + delta * percent).rgb;\
                float average = (sample.r + sample.g + sample.b) / 3.0;\
                color.x += average * weight;\
                total.x += weight;\
                if (abs(t) < 15.0) {\
                    weight = weight * 2.0 - 1.0;\
                    color.y += average * weight;\
                    total.y += weight;\
                }\
            }\
            gl_FragColor = vec4(color / total, 0.0, 1.0);\
        }\
    ');
    gl.edgeWork2 = gl.edgeWork2 || new Shader(null, '\
        uniform sampler2D texture;\
        uniform vec2 delta;\
        varying vec2 texCoord;\
        ' + randomShaderFunc + '\
        void main() {\
            vec2 color = vec2(0.0);\
            vec2 total = vec2(0.0);\
            \
            /* randomize the lookup values to hide the fixed number of samples */\
            float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\
            \
            for (float t = -30.0; t <= 30.0; t++) {\
                float percent = (t + offset - 0.5) / 30.0;\
                float weight = 1.0 - abs(percent);\
                vec2 sample = texture2D(texture, texCoord + delta * percent).xy;\
                color.x += sample.x * weight;\
                total.x += weight;\
                if (abs(t) < 15.0) {\
                    weight = weight * 2.0 - 1.0;\
                    color.y += sample.y * weight;\
                    total.y += weight;\
                }\
            }\
            float c = clamp(10000.0 * (color.y / total.y - color.x / total.x) + 0.5, 0.0, 1.0);\
            gl_FragColor = vec4(c, c, c, 1.0);\
        }\
    ');

    simpleShader.call(this, gl.edgeWork1, {
        delta: [radius / this.width, 0]
    });
    simpleShader.call(this, gl.edgeWork2, {
        delta: [0, radius / this.height]
    });

    return this;
}

// src/filters/fun/hexagonalpixelate.js
/**
 * @filter        Hexagonal Pixelate
 * @description   Renders the image using a pattern of hexagonal tiles. Tile colors
 *                are nearest-neighbor sampled from the centers of the tiles.
 * @param centerX The x coordinate of the pattern center.
 * @param centerY The y coordinate of the pattern center.
 * @param scale   The width of an individual tile, in pixels.
 */
function hexagonalPixelate(centerX, centerY, scale) {
    gl.hexagonalPixelate = gl.hexagonalPixelate || new Shader(null, '\
        uniform sampler2D texture;\
        uniform vec2 center;\
        uniform float scale;\
        uniform vec2 texSize;\
        varying vec2 texCoord;\
        void main() {\
            vec2 tex = (texCoord * texSize - center) / scale;\
            tex.y /= 0.866025404;\
            tex.x -= tex.y * 0.5;\
            \
            vec2 a;\
            if (tex.x + tex.y - floor(tex.x) - floor(tex.y) < 1.0) a = vec2(floor(tex.x), floor(tex.y));\
            else a = vec2(ceil(tex.x), ceil(tex.y));\
            vec2 b = vec2(ceil(tex.x), floor(tex.y));\
            vec2 c = vec2(floor(tex.x), ceil(tex.y));\
            \
            vec3 TEX = vec3(tex.x, tex.y, 1.0 - tex.x - tex.y);\
            vec3 A = vec3(a.x, a.y, 1.0 - a.x - a.y);\
            vec3 B = vec3(b.x, b.y, 1.0 - b.x - b.y);\
            vec3 C = vec3(c.x, c.y, 1.0 - c.x - c.y);\
            \
            float alen = length(TEX - A);\
            float blen = length(TEX - B);\
            float clen = length(TEX - C);\
            \
            vec2 choice;\
            if (alen < blen) {\
                if (alen < clen) choice = a;\
                else choice = c;\
            } else {\
                if (blen < clen) choice = b;\
                else choice = c;\
            }\
            \
            choice.x += choice.y * 0.5;\
            choice.y *= 0.866025404;\
            choice *= scale / texSize;\
            gl_FragColor = texture2D(texture, choice + center / texSize);\
        }\
    ');

    simpleShader.call(this, gl.hexagonalPixelate, {
        center: [centerX, centerY],
        scale: scale,
        texSize: [this.width, this.height]
    });

    return this;
}

// src/filters/fun/ink.js
/**
 * @filter         Ink
 * @description    Simulates outlining the image in ink by darkening edges stronger than a
 *                 certain threshold. The edge detection value is the difference of two
 *                 copies of the image, each blurred using a blur of a different radius.
 * @param strength The multiplicative scale of the ink edges. Values in the range 0 to 1
 *                 are usually sufficient, where 0 doesn't change the image and 1 adds lots
 *                 of black edges. Negative strength values will create white ink edges
 *                 instead of black ones.
 */
function ink(strength) {
    gl.ink = gl.ink || new Shader(null, '\
        uniform sampler2D texture;\
        uniform float strength;\
        uniform vec2 texSize;\
        varying vec2 texCoord;\
        void main() {\
            vec2 dx = vec2(1.0 / texSize.x, 0.0);\
            vec2 dy = vec2(0.0, 1.0 / texSize.y);\
            vec4 color = texture2D(texture, texCoord);\
            float bigTotal = 0.0;\
            float smallTotal = 0.0;\
            vec3 bigAverage = vec3(0.0);\
            vec3 smallAverage = vec3(0.0);\
            for (float x = -2.0; x <= 2.0; x += 1.0) {\
                for (float y = -2.0; y <= 2.0; y += 1.0) {\
                    vec3 sample = texture2D(texture, texCoord + dx * x + dy * y).rgb;\
                    bigAverage += sample;\
                    bigTotal += 1.0;\
                    if (abs(x) + abs(y) < 2.0) {\
                        smallAverage += sample;\
                        smallTotal += 1.0;\
                    }\
                }\
            }\
            vec3 edge = max(vec3(0.0), bigAverage / bigTotal - smallAverage / smallTotal);\
            gl_FragColor = vec4(color.rgb - dot(edge, edge) * strength * 100000.0, color.a);\
        }\
    ');

    simpleShader.call(this, gl.ink, {
        strength: strength * strength * strength * strength * strength,
        texSize: [this.width, this.height]
    });

    return this;
}

// src/filters/fun/invert.js
/**
 * @filter         Invert
 * @description    Inverts all color channels.
 */
function invert() {
    gl.invert = gl.invert || new Shader(null, '\
        uniform sampler2D texture;\
        varying vec2 texCoord;\
        void main() {\
            vec4 color = texture2D(texture, texCoord);\
            gl_FragColor = vec4(1.0 - color.rgb, color.a);\
        }\
    ');

    simpleShader.call(this, gl.invert);

    return this;
}

// src/filters/fun/oldfilm.js
/**
 * @filter      Old Film
 * @description Makes the image look like it was projected through an old projector.
 * @param frame The frame number of the animation (the random seed).
 */
function oldFilm(frame) {
    gl.oldFilm = gl.oldFilm || new Shader(null, '\
        uniform sampler2D texture;\
        uniform float frame;\
        varying vec2 texCoord;\
        \
        float random(float scale, float seed) {\
            return fract(sin(seed * scale) * 43758.5453 + seed * 234.45574);\
        }\
        \
        void main() {\
            /* Base color */\
            vec2 offset = (vec2(random(34.534, frame), random(78678.45, frame)) - 0.5) * 0.001;\
            offset.y += 0.1 * pow(0.5 - 0.5 * cos(frame) * cos(frame * 3.178236) * cos(frame * 2.718672), 20.0);\
            vec4 color = texture2D(texture, texCoord + offset);\
            \
            /* Sepia */\
            color.rgb = vec3(\
                dot(color.rgb, vec3(0.393, 0.769, 0.189)),\
                dot(color.rgb, vec3(0.349, 0.686, 0.168)),\
                dot(color.rgb, vec3(0.272, 0.534, 0.131))\
            );\
            \
            /* Vignette */\
            offset = (vec2(random(345.34, frame), random(8204.86, frame)) - 0.5) * 0.01;\
            vec2 darken = abs(texCoord + offset - 0.5) * (2.25 + 0.02 * cos(frame * 0.3));\
            darken = max(vec2(0.0), 1.0 - pow(darken, vec2(5.0)));\
            color.rgb = mix(vec3(0.1), color.rgb, length(darken.x * darken.y));\
            \
            /* Brightness */\
            color.rgb *= 0.75 + 0.25 * cos(frame * 0.1 + cos(frame * 0.4)) * cos(frame / 26.0);\
            \
            /* Lines */\
            float x = (texCoord.x + offset.x) * 100.0;\
            color.rgb *= 1.0 - pow((0.5 - 0.5 * cos(0.025 * frame + 5.0 * x)) * (0.5 - 0.5 * cos(x) * cos(x * 3.178236) * cos(x * 2.718672) * cos(x * 5.728309)), 20.0);\
            \
            /* Specks */\
            vec2 center = vec2(random(6461.345, frame), random(234.2423, frame)) * 2.0;\
            float angle = random(13467.33, frame) * 6.283185307179586;\
            float s = sin(angle), c = cos(angle);\
            vec2 delta = texCoord - center;\
            delta = vec2(dot(vec2(c, s), delta), dot(vec2(-s, c), delta));\
            float shape = 0.9 * random(456.6575, frame);\
            delta.x /= 1.0 - shape;\
            float scale = 200.0 + 200.0 * random(765343.875, frame);\
            float t = scale * length(delta) - 2.0;\
            color.rgb *= smoothstep(0.0, 1.0, t);\
            \
            gl_FragColor = color;\
        }\
    ');

    simpleShader.call(this, gl.oldFilm, {
        frame: frame,
        texSize: [this.width, this.height]
    });

    return this;
}

// src/filters/fun/photocopy.js
/**
 * @filter       Photocopy
 * @description  Makes the image look like it was printed by a photocopier.
 * @param cutoff The brightness threshold for the black/white boundary (0 to 1).
 * @param frame  The frame number of the animation (the random seed).
 */
function photocopy(cutoff, frame) {
    gl.photocopy = gl.photocopy || new Shader(null, '\
        uniform sampler2D texture;\
        uniform float frame;\
        uniform float cutoff;\
        varying vec2 texCoord;\
        \
        float random(float scale, float seed) {\
            return fract(sin(seed * scale) * 43758.5453 + seed * 234.45574);\
        }\
        \
        void main() {\
            vec4 color = texture2D(texture, texCoord);\
            \
            /* Drum lines */\
            float y = texCoord.y * 300.0;\
            color.rgb *= 1.0 + 0.1 * sin(y) * sin(y * 1.1) + 0.1 * sin(y * 2.317) * sin(y * 1.3648) + 0.1 * sin(y * 0.3673) * sin(y * 0.7836);\
            \
            /* Brightness */\
            color.rgb *= 1.0 + 0.05 * cos(frame * 0.1 + cos(frame * 0.4)) * cos(frame / 26.0);\
            \
            /* Black and white with high contrast */\
            float gray = (color.r + color.g + color.b) / 3.0;\
            color.rgb = vec3(smoothstep(0.0, 1.0, gray * 6.0 - cutoff * 7.0 + 1.0));\
            \
            gl_FragColor = color;\
        }\
    ');

    simpleShader.call(this, gl.photocopy, {
        frame: frame,
        cutoff: clamp(0, cutoff, 1),
        texSize: [this.width, this.height]
    });

    return this;
}

// src/filters/fun/quadcolor.js
/**
 * @filter       Quad Color
 * @description  Renders the image four times, each with a different color.
 * @param color1 An array with three values (0 to 1) for the top-left corner.
 * @param color2 An array with three values (0 to 1) for the top-right corner.
 * @param color3 An array with three values (0 to 1) for the bottom-left corner.
 * @param color4 An array with three values (0 to 1) for the bottom-right corner.
 */
function quadColor(color1, color2, color3, color4) {
    gl.quadColor = gl.quadColor || new Shader(null, '\
        uniform sampler2D texture;\
        uniform vec3 color1;\
        uniform vec3 color2;\
        uniform vec3 color3;\
        uniform vec3 color4;\
        varying vec2 texCoord;\
        \
        void main() {\
            vec4 color = texture2D(texture, fract(texCoord * 2.0));\
            color.rgb = vec3((color.r + color.g + color.b) / 3.0);\
            if (texCoord.y < 0.5) {\
                if (texCoord.x < 0.5) color.rgb *= color1;\
                else color.rgb *= color2;\
            } else {\
                if (texCoord.x < 0.5) color.rgb *= color3;\
                else color.rgb *= color4;\
            }\
            gl_FragColor = vec4(color);\
        }\
    ');

    simpleShader.call(this, gl.quadColor, {
        color1: color1,
        color2: color2,
        color3: color3,
        color4: color4
    });

    return this;
}

// src/filters/fun/quadrotate.js
/**
 * @filter       Quad Rotate
 * @description  Renders the image four times, each with a configurable orientation.
 * @param quad1  The q
 * @param color2 An array with three values (0 to 1) for the top-right corner.
 * @param color3 An array with three values (0 to 1) for the bottom-left corner.
 * @param color4 An array with three values (0 to 1) for the bottom-right corner.
 */
function quadRotate(dir1, dir2, dir3, dir4) {
    gl.quadRotate = gl.quadRotate || new Shader(null, '\
        uniform sampler2D texture;\
        uniform vec4 angles;\
        varying vec2 texCoord;\
        \
        void main() {\
            vec2 coord = fract(texCoord * 2.0) - 0.5;\
            vec2 a = vec2(texCoord.x < 0.5, texCoord.y < 0.5), b = 1.0 - a;\
            float angle = dot(angles, vec4(a.x * a.y, b.x * a.y, a.x * b.y, b.x * b.y));\
            float s = sin(angle), c = cos(angle);\
            coord = vec2(dot(vec2(c, s), coord), dot(vec2(-s, c), coord));\
            gl_FragColor = vec4(texture2D(texture, coord + 0.5));\
        }\
    ');

    simpleShader.call(this, gl.quadRotate, {
        angles: [
            dir1 * Math.PI * 0.5,
            dir2 * Math.PI * 0.5,
            dir3 * Math.PI * 0.5,
            dir4 * Math.PI * 0.5
        ]
    });

    return this;
}

// src/filters/fun/vhs.js
/**
 * @filter      VHS
 * @description Makes the image look like it was captured on VHS.
 * @param frame The frame number of the animation (the random seed).
 */
function vhs(frame) {
    gl.vhs = gl.vhs || new Shader(null, '\
        uniform sampler2D texture;\
        uniform float frame;\
        varying vec2 texCoord;\
        \
        float random(float scale, float seed) {\
            return fract(sin(seed * scale) * 43758.5453 + seed * 234.45574);\
        }\
        \
        void main() {\
            /* RGB to YCbCr */\
            vec4 color = texture2D(texture, texCoord);\
            vec3 rgb = color.rgb * 256.0;\
            vec3 ycbcr = vec3(\
                dot(vec3(0.299, 0.587, 0.114), rgb),\
                128.0 + dot(vec3(-0.1687, -0.3313, 0.5), rgb),\
                128.0 + dot(vec3(0.5, -0.4187, -0.0813), rgb)\
            );\
            \
            /* Color dimming */\
            ycbcr = mix(vec3(128.0), ycbcr, vec3(0.75, 0.5, 0.5));\
            \
            /* Scan lines */\
            float y = texCoord.y + frame * 0.005;\
            ycbcr.x *= 1.0 + 0.075 * sin(y * 300.0) * sin(y * 70.0) * sin(y * 10.0);\
            \
            /* Phosphor pattern */\
            ycbcr.x *= 1.0 + 0.25 * sin(dot(vec2(3.0, 1.0), gl_FragCoord.xy));\
            \
            /* YCbCr to RGB */\
            rgb = vec3(\
                ycbcr.x + 1.402 * (ycbcr.z - 128.0),\
                ycbcr.x - 0.34414 * (ycbcr.y - 128.0) - 0.71414 * (ycbcr.z - 128.0),\
                ycbcr.x + 1.772 * (ycbcr.y - 128.0)\
            );\
            gl_FragColor = vec4(rgb / 256.0, color.a);\
        }\
    ');

    // VHS is low resolution and runs a sharpening filter
    triangleBlur.call(this, 5);
    unsharpMask.call(this, 5, 10);

    simpleShader.call(this, gl.vhs, {
        frame: frame,
        texSize: [this.width, this.height]
    });

    return this;
}

// src/filters/warp/blockhead.js
/**
 * @filter         Blockhead
 * @description    Bulges or pinches the image in a rectangle.
 * @param centerX  The x coordinate of the center of the rectangle of effect.
 * @param centerY  The y coordinate of the center of the rectangle of effect.
 * @param width    The width of the rectangle of effect.
 * @param height   The height of the rectangle of effect.
 * @param strength -1 to 1 (-1 is strong pinch, 0 is no effect, 1 is strong bulge)
 */
function blockhead(centerX, centerY, width, height, strength) {
    gl.blockhead = gl.blockhead || warpShader('\
        uniform vec2 radius;\
        uniform float strength;\
        uniform vec2 center;\
        float warp(float coord) {\
            float percent = abs(coord);\
            if (percent < 1.0) {\
                float factor = mix(1.0, smoothstep(0.0, 1.0, percent), abs(strength) * 0.75);\
                if (strength > 0.0) coord *= factor;\
                else coord /= factor;\
            }\
            return coord;\
        }\
    ', '\
        coord = (coord - center) / radius;\
        coord.x = warp(coord.x);\
        coord.y = warp(coord.y);\
        coord = coord * radius + center;\
    ');

    simpleShader.call(this, gl.blockhead, {
        radius: [width / 2, height / 2],
        strength: clamp(-1, strength, 1),
        center: [centerX, centerY],
        texSize: [this.width, this.height]
    });

    return this;
}

// src/filters/warp/bulgepinch.js
/**
 * @filter         Bulge / Pinch
 * @description    Bulges or pinches the image in a circle.
 * @param centerX  The x coordinate of the center of the circle of effect.
 * @param centerY  The y coordinate of the center of the circle of effect.
 * @param radius   The radius of the circle of effect.
 * @param strength -1 to 1 (-1 is strong pinch, 0 is no effect, 1 is strong bulge)
 */
function bulgePinch(centerX, centerY, radius, strength) {
    gl.bulgePinch = gl.bulgePinch || warpShader('\
        uniform float radius;\
        uniform float strength;\
        uniform vec2 center;\
    ', '\
        coord -= center;\
        float distance = length(coord);\
        if (distance < radius) {\
            float percent = distance / radius;\
            if (strength > 0.0) {\
                coord *= mix(1.0, smoothstep(0.0, radius / distance, percent), strength * 0.75);\
            } else {\
                coord *= mix(1.0, pow(percent, 1.0 + strength * 0.75) * radius / distance, 1.0 - percent);\
            }\
        }\
        coord += center;\
    ');

    simpleShader.call(this, gl.bulgePinch, {
        radius: radius,
        strength: clamp(-1, strength, 1),
        center: [centerX, centerY],
        texSize: [this.width, this.height]
    });

    return this;
}

// src/filters/warp/kaleidoscope.js
/**
 * @filter         Kaleidoscope
 * @description    Renders the image as if looked at through a kaleidoscope
 *                 (a tube with three mirrors inside arranged in a triangle).
 * @param centerX  The x coordinate of the center of the triangular pattern.
 * @param centerY  The y coordinate of the center of the triangular pattern.
 * @param size     The length of one side of a triangle.
 * @param angle    The rotation of the triangular pattern, in radians.
 */
function kaleidoscope(centerX, centerY, size, angle) {
    gl.kaleidoscope = gl.kaleidoscope || warpShader('\
        uniform float size;\
        uniform float angle;\
        uniform vec2 center;\
        bool xor(bool a, bool b) { return (int(a) + int(b)) == 1; }\
    ', '\
        float c = cos(angle);\
        float s = sin(angle);\
        \
        /* Convert to triangle coordinates */\
        coord = (coord - center) / size;\
        coord = vec2(dot(vec2(c, s), coord), dot(vec2(-s, c), coord));\
        coord.y /= 0.866025404;\
        coord.x -= coord.y * 0.5;\
        \
        /* Apply mirrored reflections */\
        coord = 3.0 * fract(coord / 3.0);\
        if (coord.x + coord.y > 3.0) coord = 3.0 - coord.yx;\
        if (coord.x + coord.y > 2.0) coord = 2.0 - coord.yx;\
        if (coord.x > 1.0) {\
            if (coord.y > 0.0) coord = vec2(2.0 - coord.x - coord.y, coord.x - 1.0);\
            else coord = vec2(2.0 - coord.x, coord.x + coord.y - 1.0);\
        }\
        else if (coord.y > 1.0) {\
            if (coord.x > 0.0) coord = vec2(coord.y - 1.0, 2.0 - coord.x - coord.y);\
            else coord = vec2(coord.x + coord.y - 1.0, 2.0 - coord.y);\
        }\
        else if (coord.x + coord.y > 1.0) coord = 1.0 - coord.yx;\
        \
        /* Convert from triangle coordinates */\
        coord.x += coord.y * 0.5;\
        coord.y *= 0.866025404;\
        coord = vec2(dot(vec2(c, -s), coord), dot(vec2(s, c), coord));\
        coord = coord * size + center;\
    ');

    simpleShader.call(this, gl.kaleidoscope, {
        size: size,
        angle: angle,
        center: [centerX, centerY],
        texSize: [this.width, this.height]
    });

    return this;
}

// src/filters/warp/matrixwarp.js
/**
 * @filter                Matrix Warp
 * @description           Transforms an image by a 2x2 or 3x3 matrix. The coordinates used in
 *                        the transformation are (x, y) for a 2x2 matrix or (x, y, 1) for a
 *                        3x3 matrix, where x and y are in units of pixels.
 * @param matrix          A 2x2 or 3x3 matrix represented as either a list or a list of lists.
 *                        For example, the 3x3 matrix [[2,0,0],[0,3,0],[0,0,1]] can also be
 *                        represented as [2,0,0,0,3,0,0,0,1] or just [2,0,0,3].
 * @param inverse         A boolean value that, when true, applies the inverse transformation
 *                        instead. (optional, defaults to false)
 * @param useTextureSpace A boolean value that, when true, uses texture-space coordinates
 *                        instead of screen-space coordinates. Texture-space coordinates range
 *                        from -1 to 1 instead of 0 to width - 1 or height - 1, and are easier
 *                        to use for simple operations like flipping and rotating.
 */
function matrixWarp(matrix, inverse, useTextureSpace) {
    gl.matrixWarp = gl.matrixWarp || warpShader('\
        uniform mat3 matrix;\
        uniform bool useTextureSpace;\
    ', '\
        if (useTextureSpace) coord = coord / texSize * 2.0 - 1.0;\
        vec3 warp = matrix * vec3(coord, 1.0);\
        coord = warp.xy / warp.z;\
        if (useTextureSpace) coord = (coord * 0.5 + 0.5) * texSize;\
    ');

    // Flatten all members of matrix into one big list
    matrix = Array.prototype.concat.apply([], matrix);

    // Extract a 3x3 matrix out of the arguments
    if (matrix.length == 4) {
        matrix = [
            matrix[0], matrix[1], 0,
            matrix[2], matrix[3], 0,
            0, 0, 1
        ];
    } else if (matrix.length != 9) {
        throw 'can only warp with 2x2 or 3x3 matrix';
    }

    simpleShader.call(this, gl.matrixWarp, {
        matrix: inverse ? getInverse(matrix) : matrix,
        texSize: [this.width, this.height],
        useTextureSpace: useTextureSpace | 0
    });

    return this;
}

// src/filters/warp/mirror.js
/**
 * @filter      Mirror
 * @description Mirrors the image about a line.
 * @param angle The angle of the line of symmetry, in radians.
 */
function mirror(angle) {
    gl.mirror = gl.mirror || warpShader('\
        uniform float angle;\
    ', '\
        coord -= texSize * 0.5;\
        vec2 dir = vec2(cos(angle), sin(angle));\
        float dist = dot(dir, coord);\
        if (dist < 0.0) coord -= dir * dist * 2.0;\
        coord += texSize * 0.5;\
    ');

    simpleShader.call(this, gl.mirror, {
        angle: angle,
        texSize: [this.width, this.height]
    });

    return this;
}

// src/filters/warp/perspective.js
/**
 * @filter       Perspective
 * @description  Warps one quadrangle to another with a perspective transform. This can be used to
 *               make a 2D image look 3D or to recover a 2D image captured in a 3D environment.
 * @param before The x and y coordinates of four points before the transform in a flat list. This
 *               would look like [ax, ay, bx, by, cx, cy, dx, dy] for four points (ax, ay), (bx, by),
 *               (cx, cy), and (dx, dy).
 * @param after  The x and y coordinates of four points after the transform in a flat list, just
 *               like the other argument.
 */
function perspective(before, after) {
    var a = getSquareToQuad.apply(null, after);
    var b = getSquareToQuad.apply(null, before);
    var c = multiply(getInverse(a), b);
    return this.matrixWarp(c);
}

// src/filters/warp/swirl.js
/**
 * @filter        Swirl
 * @description   Warps a circular region of the image in a swirl.
 * @param centerX The x coordinate of the center of the circular region.
 * @param centerY The y coordinate of the center of the circular region.
 * @param radius  The radius of the circular region.
 * @param angle   The angle in radians that the pixels in the center of
 *                the circular region will be rotated by.
 */
function swirl(centerX, centerY, radius, angle) {
    gl.swirl = gl.swirl || warpShader('\
        uniform float radius;\
        uniform float angle;\
        uniform vec2 center;\
    ', '\
        coord -= center;\
        float distance = length(coord);\
        if (distance < radius) {\
            float percent = (radius - distance) / radius;\
            float theta = percent * percent * angle;\
            float s = sin(theta);\
            float c = cos(theta);\
            coord = vec2(\
                coord.x * c - coord.y * s,\
                coord.x * s + coord.y * c\
            );\
        }\
        coord += center;\
    ');

    simpleShader.call(this, gl.swirl, {
        radius: radius,
        center: [centerX, centerY],
        angle: angle,
        texSize: [this.width, this.height]
    });

    return this;
}

return exports;
})();

define("libs/webgl/glfx.min", function(){});

(function() {

  define('mylibs/preview/preview',['jQuery', 'Kendo', 'mylibs/utils/utils', 'libs/webgl/effects', 'libs/webgl/glfx.min'], function($, kendo, utils, effects) {
    var $container, canvas, draw, height, paused, preview, pub, update, video, webgl, width;
    $container = {};
    canvas = {};
    webgl = {};
    video = {};
    paused = true;
    preview = {};
    width = 460;
    height = 340;
    draw = function() {
      utils.getAnimationFrame()(draw);
      return update();
    };
    update = function() {
      var canvas2d, texture;
      if (!paused) {
        canvas2d = canvas.getContext('2d');
        canvas2d.clearRect();
        canvas2d.drawImage(video, 0, 0, video.width, video.height);
        texture = webgl.texture(canvas);
        if (preview.method !== "normal") {
          if (preview.hasFrames) {
            webgl.draw(texture)[preview.method].apply(webgl, [preview.params.frame]).update();
            if (preview.params.frame < preview.range.max) {
              ++preview.params.frame;
            } else {
              preview.params.frame = 0;
            }
          } else {
            webgl.draw(texture)[preview.method].apply(webgl, preview.paramsArray).update();
          }
        } else {
          webgl.draw(texture).update();
        }
        return texture.destroy();
      }
    };
    return pub = {
      init: function(container, v) {
        var $footer, $header, $preview, presets;
        $container = $("#" + container);
        $header = $container.find(".header");
        $preview = $container.find(".body");
        $footer = $container.find(".footer");
        video = v;
        presets = effects(width, height);
        canvas = document.createElement("canvas");
        webgl = fx.canvas();
        $preview.append(webgl);
        $.subscribe("/preview/show", function(e) {
          var param, paramValue, _ref;
          $.extend(preview, e);
          paused = false;
          preview.paramsArray = [];
          _ref = presets[preview.name].params;
          for (param in _ref) {
            paramValue = _ref[param];
            preview.paramsArray.push(paramValue);
          }
          video.width = canvas.width = width;
          video.height = canvas.height = height;
          $header.kendoStop(true).kendoAnimate({
            effects: "fadeIn",
            show: true,
            duration: 500
          });
          $preview.kendoStop(true).kendoAnimate({
            effects: "zoomIn fadeIn",
            show: true,
            duration: 500
          });
          return $footer.kendoStop(true).kendoAnimate({
            effects: "slideIn:up fadeIn",
            show: true,
            duration: 500,
            complete: function() {
              return $("footer").kendoStop(true).kendoAnimate({
                effects: "fadeIn",
                show: true,
                duration: 200
              });
            }
          });
        });
        $container.find("#effects").click(function() {
          paused = true;
          $("footer").kendoStop(true).kendoAnimate({
            effects: "fadeOut",
            hide: true,
            duration: 200
          });
          $header.kendoStop(true).kendoAnimate({
            effects: "fadeOut",
            hide: true,
            duration: 500
          });
          $preview.kendoStop(true).kendoAnimate({
            effects: "zoomOut fadeOut",
            hide: true,
            duration: 500
          });
          $footer.kendoStop(true).kendoAnimate({
            effects: "slide:down fadeOut",
            hide: true,
            duration: 500
          });
          return $.publish("/previews/show");
        });
        $.subscribe("/preview/snapshot", function() {
          var callback;
          callback = function() {
            return $(webgl).kendoAnimate({
              effects: "zoomOut: fadeOut",
              duration: 300,
              show: false
            }).kendoAnimate({
              effects: "zoomIn: fadeIn",
              duration: 300,
              show: true,
              complete: function() {
                $(webgl).show();
                return $.publish("/snapshot/create", [webgl.toDataURL()]);
              }
            });
          };
          return $.publish("/camera/countdown", [3, callback]);
        });
        $.subscribe("/preview/photobooth", function() {
          var callback, images, photoNumber;
          images = [];
          photoNumber = 2;
          callback = function() {
            --photoNumber;
            images.push(webgl.toDataURL());
            if (photoNumber > 0) {
              return $.publish("/camera/countdown", [3, callback]);
            } else {
              return $.publish("/photobooth/create", [images]);
            }
          };
          return $.publish("/camera/countdown", [3, callback]);
        });
        return draw();
      }
    };
  });

}).call(this);

define('text!mylibs/preview/views/preview.html',[],function () { return '<a href="#" class="preview">\n    # var canvas = fx.canvas(); # \n</a>\n\n\n<!--\npreview = {}\n                    $.extend(preview, value)\n\n                    preview.name = key\n                    preview.type = value.type\n\n                    preview.canvas = fx.canvas()\n\n                    preview.paramsArray = []\n                \n                    for effect, effectValue of value.params\n                        preview.paramsArray.push(effectValue)\n                                \n                    previews.push(preview)\n                \n                    $a = $("<a href=\'#\' class=\'preview\'></a>").append(preview.canvas).click(->\n                        paused = true\n                        $("footer").kendoStop(true).kendoAnimate({ effects: "fadeOut", hide: true, duration: 200 })\n                        $container.kendoStop(true).kendoAnimate({ effects: "zoomOut fadeOut", hide: true, duration: 500 })\n                        $.publish("/preview/show", [preview])\n                    )\n                \n                    $container.append($a)\n\n                    -->';});

(function() {

  define('mylibs/preview/selectPreview',['jQuery', 'Kendo', 'libs/webgl/effects', 'mylibs/utils/utils', 'text!mylibs/preview/views/preview.html'], function($, kendo, effects, utils, template) {
    var $container, canvas, draw, paused, previews, pub, update, video;
    paused = false;
    canvas = {};
    video = {};
    previews = [];
    $container = {};
    update = function() {
      var canvas2d, name, texture, _i, _len, _results;
      if (!paused) {
        canvas2d = canvas.getContext('2d');
        canvas2d.clearRect();
        canvas2d.drawImage(video, 0, 0, video.width, video.height);
        _results = [];
        for (_i = 0, _len = previews.length; _i < _len; _i++) {
          name = previews[_i];
          texture = name.canvas.texture(canvas);
          if (name.type === "shader") {
            if (name.hasFrames) {
              name.canvas.draw(texture)[name.method].apply(name.canvas, [name.params.frame]).update();
              if (name.params.frame < name.range.max) {
                ++name.params.frame;
              } else {
                name.params.frame = 0;
              }
            } else {
              name.canvas.draw(texture)[name.method].apply(name.canvas, name.paramsArray).update();
            }
          } else {
            name.canvas.draw(texture).update();
          }
          _results.push(texture.destroy());
          /*
                          else if (name.type == "face")
                      
                              ctx = name.canvas.getContext('2d')
                              ctx.drawImage(video, 0, 0, video.width, video.height)
                              comp = ccv.detect_objects(
                                  "canvas" : name.canvas
                                  "cascade" : cascade,
                                  "interval" : 5,
                                  "min_neighbors" : 1 )
          
                              for i in comp
                                  img = name.params.image()
                                  ctx.drawImage(img, i.x, i.y, i.width, i.height);
          */
        }
        return _results;
      }
    };
    draw = function() {
      utils.getAnimationFrame()(draw);
      return update();
    };
    return pub = {
      draw: function() {
        return draw();
      },
      init: function(container, c, v) {
        var key, value, _ref, _results;
        $.subscribe("/previews/show", function() {
          video.width = canvas.width = 200;
          video.height = canvas.height = 150;
          return $container.kendoStop(true).kendoAnimate({
            effects: "zoomIn fadeIn",
            show: true,
            duration: 500,
            complete: function() {
              $("footer").kendoStop(true).kendoAnimate({
                effects: "fadeIn",
                show: true,
                duration: 200
              });
              return paused = false;
            }
          });
        });
        previews = [];
        canvas = document.createElement("canvas");
        video = v;
        $container = $("#" + container);
        video.width = canvas.width = 200;
        video.height = canvas.height = 150;
        /*
                    $("#previews").kendoListView
                        dataSource: new kendo.data.DataSource
                            data: presets
                            pageSize: 8
                        template: template
        */
        _ref = effects(200, 150);
        _results = [];
        for (key in _ref) {
          value = _ref[key];
          _results.push((function() {
            var $a, effect, effectValue, preview, _ref2;
            preview = {};
            $.extend(preview, value);
            preview.name = key;
            preview.type = value.type;
            preview.canvas = fx.canvas();
            preview.paramsArray = [];
            _ref2 = value.params;
            for (effect in _ref2) {
              effectValue = _ref2[effect];
              preview.paramsArray.push(effectValue);
            }
            previews.push(preview);
            $a = $("<a href='#' class='preview'></a>").append(preview.canvas).click(function() {
              paused = true;
              $("footer").kendoStop(true).kendoAnimate({
                effects: "fadeOut",
                hide: true,
                duration: 200
              });
              $container.kendoStop(true).kendoAnimate({
                effects: "zoomOut fadeOut",
                hide: true,
                duration: 500
              });
              return $.publish("/preview/show", [preview]);
            });
            return $container.append($a);
          })());
        }
        return _results;
      },
      pause: function() {
        return paused = true;
      },
      resume: function() {
        return paused = false;
      },
      capture: function(callback) {
        return webgl.ToDataURL;
      }
    };
  });

}).call(this);

(function() {

  define('mylibs/camera/camera',['jQuery', 'Kendo', 'mylibs/camera/normalize', 'mylibs/preview/selectPreview', 'mylibs/preview/preview'], function($, kendo, normalize, selectPreview, preview) {
    var $counter, countdown, paused, pub, setup, turnOn, utils;
    $counter = {};
    utils = {};
    paused = false;
    setup = function(callback) {
      var videoDiv;
      videoDiv = document.createElement('div');
      document.body.appendChild(videoDiv);
      videoDiv.appendChild(pub.video);
      videoDiv.setAttribute("style", "display:none;");
      pub.video.play();
      pub.video.width = 200;
      pub.video.height = 150;
      if (callback) return callback();
    };
    turnOn = function(callback, testing) {
      var errback, hollaback;
      if (testing) {
        pub.video.src = "burke.mp4";
        pub.video.loop = "loop";
        return setup(callback);
      } else {
        hollaback = function(stream) {
          var e;
          e = window.URL || window.webkitURL;
          pub.video.src = e ? e.createObjectURL(stream) : stream;
          $(pub.video).attr("src", window.URL && window.URL.createObjectURL ? window.URL.createObjectURL(stream) : stream);
          $(pub.video).attr("prop", window.URL && window.URL.createObjectURL ? window.URL.createObjectURL(stream) : stream);
          return setup(callback);
        };
        errback = function() {
          return console.log("Your thing is not a thing.");
        };
        if (navigator.getUserMedia) {
          return navigator.getUserMedia(normalize({
            video: true,
            audio: false
          }), hollaback, errback);
        } else {
          return $.publish("/camera/unsupported");
        }
      }
    };
    countdown = function(num, hollaback) {
      var counters, index;
      counters = $counter.find("span");
      index = counters.length - num;
      return $(counters[index]).css("opacity", "1").animate({
        opacity: .1
      }, 1000, function() {
        if (num > 1) {
          num--;
          return countdown(num, hollaback);
        } else {
          return hollaback();
        }
      });
    };
    return pub = {
      init: function(utilities, counter, callback) {
        utils = utilities;
        $counter = $("#" + counter);
        pub.video = document.createElement("video");
        pub.video.crossOrigin = "";
        turnOn(callback, true);
        return $.subscribe("/camera/countdown", function(num, hollaback) {
          return countdown(num, hollaback);
        });
      },
      video: {}
    };
  });

}).call(this);

(function() {

  define('app',['jQuery', 'Kendo', 'mylibs/camera/camera', 'mylibs/snapshot/snapshot', 'mylibs/photobooth/photobooth', 'mylibs/controls/controls', 'mylibs/customize/customize', 'mylibs/effects/effects', 'mylibs/utils/utils', 'mylibs/file/file', 'mylibs/share/share', 'text!intro.html', 'mylibs/pictures/pictures', 'mylibs/preview/preview', 'mylibs/preview/selectPreview'], function($, kendo, camera, snapshot, photobooth, controls, customize, effects, utils, file, share, intro, pictures, preview, selectPreview) {
    var pub;
    return pub = {
      init: function() {
        utils.init();
        share.init();
        $.subscribe('/camera/unsupported', function() {
          return $('#pictures').append(intro);
        });
        return camera.init(utils, "countdown", function() {
          var $canvas;
          pictures.init("pictures");
          preview.init("camera", camera.video);
          selectPreview.init("previews", camera.canvas, camera.video);
          selectPreview.draw();
          snapshot.init(preview, "pictures");
          $canvas = $('#screen');
          photobooth.init(460, 340);
          controls.init("controls");
          customize.init("customize");
          effects.init();
          return file.init(50000);
        });
      }
    };
  });

}).call(this);

/*
 RequireJS order 1.0.5 Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 Available via the MIT or new BSD license.
 see: http://github.com/jrburke/requirejs for details
*/
(function(){function k(a){var b=a.currentTarget||a.srcElement,c;if(a.type==="load"||l.test(b.readyState)){a=b.getAttribute("data-requiremodule");j[a]=!0;for(a=0;c=g[a];a++)if(j[c.name])c.req([c.name],c.onLoad);else break;a>0&&g.splice(0,a);setTimeout(function(){b.parentNode.removeChild(b)},15)}}function m(a){var b,c;a.setAttribute("data-orderloaded","loaded");for(a=0;c=h[a];a++)if((b=i[c])&&b.getAttribute("data-orderloaded")==="loaded")delete i[c],require.addScriptToDom(b);else break;a>0&&h.splice(0,
a)}var f=typeof document!=="undefined"&&typeof window!=="undefined"&&document.createElement("script"),n=f&&(f.async||window.opera&&Object.prototype.toString.call(window.opera)==="[object Opera]"||"MozAppearance"in document.documentElement.style),o=f&&f.readyState==="uninitialized",l=/^(complete|loaded)$/,g=[],j={},i={},h=[],f=null;define('order',{version:"1.0.5",load:function(a,b,c,e){var d;b.nameToUrl?(d=b.nameToUrl(a,null),require.s.skipAsync[d]=!0,n||e.isBuild?b([a],c):o?(e=require.s.contexts._,!e.urlFetched[d]&&
!e.loaded[a]&&(e.urlFetched[d]=!0,require.resourcesReady(!1),e.scriptCount+=1,d=require.attach(d,e,a,null,null,m),i[a]=d,h.push(a)),b([a],c)):b.specified(a)?b([a],c):(g.push({name:a,req:b,onLoad:c}),require.attach(d,null,a,k,"script/cache"))):b([a],c)}})})();

(function() {

  require.config({
    paths: {
      jQuery: 'libs/jquery/jquery',
      Kendo: 'libs/kendo/kendo',
      WebGL: 'libs/webgl/glfx'
    }
  });

  require(['app', 'order!libs/webgl/glfx.min'], function(app) {
    return app.init();
  });

}).call(this);

define("main", function(){});
