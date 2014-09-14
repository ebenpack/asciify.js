!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.asciify=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
function luminance(r,g,b){
    return (0.2126*r + 0.7152*g + 0.0722*b) / 255;
    // TODO: try these other options, see which works best
    // (0.299*R + 0.587*G + 0.114*B)
    // sqrt( 0.299*R^2 + 0.587*G^2 + 0.114*B^2 )
    // (R+R+B+G+G+G)/6
}

function asciify(raw_imageData, canvas, font_size, monochrome){
    // Characters from 'darkest' to 'lightest'
    var ascii_luminance_map = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft\/|()1{}[]?-_+~<>i!lI;:,\"^`\'. ";
    // TODO: try these other options to see which works best
    // ".:*IVFNM"
    // " .'`,^:" + '";~-_+<>i!lI?/|()1{}[]rcvunxzjftLCJUYXZO0Qoahkbdpqwm*WMB8&%$#@
    var canvas_ctx = canvas.getContext('2d');
    var input_width = raw_imageData.width;
    var input_height = raw_imageData.height;
    var output_width = canvas.width;
    var output_height = canvas.height;
    var ratio = input_width / output_width;

    canvas_ctx.font = font_size + "pt Courier";
    var font_width = Math.round(canvas_ctx.measureText('W').width);
    var font_height = font_size;

    var input_sample_width = Math.floor(font_width * ratio);
    var input_sample_height = Math.floor(font_height * ratio);

    var image_data = raw_imageData.data;

    // For each ascii character in the output
    for (var x = 0; x < output_width; x+= font_width){
        for (var y = 0; y < output_height; y+= font_height){
            // Determine location and size of corresponding
            // rectangle in input

            // Loop over input sample, determine average RGB
            // and luminance values
            var block_luminance_total = 0;
            var red_tot = 0;
            var green_tot = 0;
            var blue_tot = 0;
            var area = 0;
            for (var x2=0; x2<input_sample_width; x2++){
                for (var y2=0; y2<input_sample_height; y2++){
                    var index = ((Math.round(x*ratio)+x2) + ((Math.round(y*ratio)+y2) * input_width)) * 4;
                    // TODO: 
                    if (index<image_data.length){
                        var red = image_data[index];
                        var green = image_data[index+1];
                        var blue = image_data[index+2];
                        red_tot += red;
                        green_tot += green;
                        blue_tot += blue;
                        block_luminance_total += luminance(red, green, blue);
                        area += 1;
                    }
                }
            }
            var block_luminance_avg = block_luminance_total / area;
            var map_length = ascii_luminance_map.length;
            var idx = Math.floor((map_length - 1) * block_luminance_avg);
            if (!monochrome){
                var r = Math.floor(red_tot / area);
                var g = Math.floor(green_tot / area);
                var b = Math.floor(blue_tot / area);
                canvas_ctx.fillStyle = "rgb(" + r +"," +g +","+b + ")";
            }
            var character = ascii_luminance_map[idx];
            canvas_ctx.fillText(character, x, y);
        }
    }
}

module.exports = asciify;
},{}]},{},[1])
(1)
});