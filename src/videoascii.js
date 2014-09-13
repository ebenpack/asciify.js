function videoascii(canvas_id, video_id, output_width, font_size, monochrome){

    // Characters from 'darkest' to 'lightest'
    var ascii_luminance_map = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft\/|()1{}[]?-_+~<>i!lI;:,\"^`\'. ";
    // TODO: try these other options to see which works best
    // ".:*IVFNM"
    // " .'`,^:" + '";~-_+<>i!lI?/|()1{}[]rcvunxzjftLCJUYXZO0Qoahkbdpqwm*WMB8&%$#@

    var pixels_per_char = [7,15];

    var width, height, image_data, ascii_data, output_char_height,
        output_char_width, ascii_array, aspect_ratio, output_height,
        input_block_width, input_block_height, output_block_width, output_block_height;
    var canvas = document.getElementById(canvas_id);
    var ctx = canvas.getContext('2d');
    var buffer_canvas = document.createElement('canvas');
    var buffer_ctx = buffer_canvas.getContext('2d');
    var video = document.getElementById(video_id);
    var monochrome = (monochrome === undefined) ? true : monochrome;

    ctx.font = "20pt Courier";

    // TODO: use measureText to determine pixels_per_char
    //fillText() //Draws the specified text using the text style specified by the font attribute, 
    // ctx.measureText() // Returns an object containing the width, in pixels, that the specified text will be when drawn in the current text style.
    // ctx.mozPathText() //Adds the strokes from the specified text to the current path.
    // strokeText() //Strokes the specified text using the text style specified by the font attribute, t

    // Initialization
    // Given output width, and output 'resolution', calculate block size(?)

    video.addEventListener('loadeddata', function(){
        width = Math.floor(video.getBoundingClientRect().width);
        height = Math.floor(video.getBoundingClientRect().height);
        aspect_ratio = width / height;
        output_height = Math.floor(output_width / aspect_ratio);
        canvas.width = output_width;
        canvas.height = output_height;
        buffer_canvas.width = width;
        buffer_canvas.height = height;
        image_data = buffer_ctx.getImageData(0,0,width,height);
        ascii_data = buffer_ctx.getImageData(0,0,width,height);
        output_char_height = Math.floor(output_height / pixels_per_char[1]);
        output_char_width = Math.floor(output_width / pixels_per_char[0]);
        window.requestAnimationFrame(update);
    });

    function luminance(r,g,b){
        return (0.2126*r + 0.7152*g + 0.0722*b) / 255;
        // TODO: try these other options, see which works best
        // (0.299*R + 0.587*G + 0.114*B)
        // sqrt( 0.299*R^2 + 0.587*G^2 + 0.114*B^2 )
        // (R+R+B+G+G+G)/6
    }

    function getPixel(x, y, img){
        var index = (x + y * img.width) * 4;
        var r = img.data[index];
        var g =img.data[index+1];
        var b = img.data[index+2];
        return {'r': r, 'g':g, 'b':b};
    }

    function asciify(raw_imageData, block_size){
        var image_data = raw_imageData.data;
        var img_width = raw_imageData.width;
        for (var x=0, xlen=raw_imageData.width; x<xlen; x+=block_size*4){
            for (var y=0, ylen=raw_imageData.width; y<ylen; y+=block_size*4){
                var block_luminance_total = 0;
                var red_tot = 0;
                var green_tot = 0;
                var blue_tot = 0;
                for (var x2 = 0; x2<block_size*4; x2+=4){
                    for (var y2 = 0; y2<block_size*4; y2+=4){
                        var index = ((x+x2) + ((y+y2) * img_width)) * 4;
                        var r = image_data[index];
                        var g = image_data[index+1];
                        var b = image_data[index+2];
                        red_tot += r;
                        green_tot += g;
                        blue_tot += b;
                        block_luminance_total += luminance(r, g, b);
                    } 
                }
                var block_luminance_avg = block_luminance_total / (block_size * block_size);
                var map_length = ascii_luminance_map.length;
                var idx = Math.floor((map_length - 1) * block_luminance_avg);
                if (!monochrome){
                    var r = Math.floor(red_tot / (block_size * block_size))
                    var g = Math.floor(green_tot / (block_size * block_size))
                    var b = Math.floor(blue_tot / (block_size * block_size))
                    ctx.fillStyle = "rgb(" + r +"," +g +","+b + ")";
                }
                var character = ascii_luminance_map[idx];
                ctx.fillText(character, x, y);
            }
        }
    }

    function update(){
        if (video.paused || video.ended){
            window.requestAnimationFrame(update);
            return;
        }
        buffer_ctx.drawImage(video,0,0);
        image_data = buffer_ctx.getImageData(0,0,width,height);
        ctx.clearRect(0, 0, output_width, output_height);
        asciify(image_data, 2);
        window.requestAnimationFrame(update);
    }
}