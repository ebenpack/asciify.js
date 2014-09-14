var asciify = (function(){
function luminance(r,g,b){
    return (0.2126*r + 0.7152*g + 0.0722*b) / 255;
    // TODO: try these other options, see which works best
    // (0.299*R + 0.587*G + 0.114*B)
    // sqrt( 0.299*R^2 + 0.587*G^2 + 0.114*B^2 )
    // (R+R+B+G+G+G)/6
}

function asciify(raw_imageData, canvas_ctx, font_width, font_height, monochrome){
    // Characters from 'darkest' to 'lightest'
    var ascii_luminance_map = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft\/|()1{}[]?-_+~<>i!lI;:,\"^`\'. ";
    // TODO: try these other options to see which works best
    // ".:*IVFNM"
    // " .'`,^:" + '";~-_+<>i!lI?/|()1{}[]rcvunxzjftLCJUYXZO0Qoahkbdpqwm*WMB8&%$#@
    var input_width = raw_imageData.width;
    var input_height = raw_imageData.height;
    var output_width = canvas.width;
    var output_height = canvas.height;

    var ratio = input_width / output_width;
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
            for (var x2=0; x2<input_sample_width; x2++){
                for (var y2=0; y2<input_sample_height; y2++){
                    var index = ((Math.round(x*ratio)+x2) + ((Math.round(y*ratio)+y2) * input_width)) * 4;
                    var r = image_data[index];
                    var g = image_data[index+1];
                    var b = image_data[index+2];
                    red_tot += r;
                    green_tot += g;
                    blue_tot += b;
                    block_luminance_total += luminance(r, g, b);
                }
            }
            var area = input_sample_width * input_sample_height;
            var block_luminance_avg = block_luminance_total / area;
            var map_length = ascii_luminance_map.length;
            var idx = Math.floor((map_length - 1) * block_luminance_avg);
            if (!monochrome){
                var r = Math.floor(red_tot / area)
                var g = Math.floor(green_tot / area)
                var b = Math.floor(blue_tot / area)
                canvas_ctx.fillStyle = "rgb(" + r +"," +g +","+b + ")";
            }
            var character = ascii_luminance_map[idx];
            canvas_ctx.fillText(character, x, y);
        }
    }
}
return asciify;
})()