function videoascii(canvas_id, video_id){
    var canvas = document.getElementById(canvas_id);
    var ctx = canvas.getContext('2d');
    var buffer_canvas = document.createElement('canvas');
    var buffer_ctx = buffer_canvas.getContext('2d');
    var video = document.getElementById(video_id);
    var width = Math.floor(video.getBoundingClientRect().width);
    var height = Math.floor(video.getBoundingClientRect().height);
    var image_data = buffer_ctx.getImageData(0,0,width,height);

    canvas.width = width;
    canvas.height = height;
    buffer_canvas.width = width;
    buffer_canvas.height = height;

    function asciify(image_data){

    }

    function update(){
        if (video.paused || video.ended){
            window.requestAnimationFrame(update);
            return;
        }
        // buffer_ctx.drawImage(video,0,0);
        // image_data = buffer_ctx.getImageData(0,0,width,height);
        // asciify(image_data);
        window.requestAnimationFrame(update);
    }
    window.requestAnimationFrame(update);
}