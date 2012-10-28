// graphite.js

(function ($) {

controls = {
	from:
	[
		'-2hours',
		'-4hours',
		'-12hours',
		'-1days',
		'-3days'
	],
	until:
	[
		'now',
		'-2hours',
		'-4hours',
		'-12hours',
		'-1days',
		'-3days'
	]
}
    $.fn.graphite = function (options) {
        if (options === "update") {
            $.fn.graphite.update(this, arguments[1]);
            return this;
        }

        // Initialize plugin //
        options = options || {};
        var settings = $.extend({}, $.fn.graphite.defaults, options);

        return this.each(function () {
            $this = $(this);

            $this.data("graphOptions", settings);
            $.fn.graphite.render($this, settings);
        });

    };

    $.fn.graphite.render = function($img, options) {
        // Render a new image. //
        var src = options.url + "?";

        // use random parameter to force image refresh
        options["_t"] = options["_t"] || Math.random();

        $.each(options, function (key, value) {
            if (key === "target") {
                $.each(value, function (index, value) {
                    src += "&target=" + value;
                });
            } else if (value !== null && key !== "url") {
                src += "&" + key + "=" + value;
 	     }
        });
        
        src = src.replace(/\?&/, "?");
        $img.attr("src", src);
        $img.attr("height", options.height);
        $img.attr("width", options.width);

	// If the option has not been set to include he controls, then dont add
	// the controls.

	if( options["addcontrols"] !== true ) {
		return;
	}

	// Add extra controls, assume we have an outer div
	div = $img.parent();

	// Loop over the above json to generate the graph_control's
	$.each(controls, function( w,x){
		control = $("<select name='" + w + "' class='graph_control'>");
		control.append("<option disabled=disabed selected='true'>" + w + "</option>");
		control.append("<option disabled=disabed>---------</option>");
		$.each(x, function(y,z){
			control.append("<option value='" + z + "'>" + z + "</option>");
		});
		div.append( control );
	});
	
    };

    $.fn.graphite.update = function($img, options) {
        options = options || {};
        $img.each(function () {
            $this = $(this);
            var settings = $.extend({}, $this.data("graphOptions"), options);
            $this.data("graphOptions", settings);
            $.fn.graphite.render($this, settings);
        });
    };

    // Default settings. 
    // Override with the options argument for per-case setup
    // or set $.fn.graphite.defaults.<value> for global changes
    $.fn.graphite.defaults = {
        from: "-1hour",
        height: "300",
        until: "now",
        url: "/render/",
        width: "940"
    };


    // live function that will catch any interactions with the graph_control
    // items.
    $(".graph_control").live("click", function(data) {
	key = $(this).attr('name');
	value = $(this).attr('value');
	img = $(this).parent().find('img');
	var options = { addcontrols: true };
	options[key] =  value;
	$.fn.graphite.update( img, options );
    });

}(jQuery));
