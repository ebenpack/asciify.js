function videoascii(canvas_id, video_id){
    var canvas = document.getElementById(canvas_id);
    var ctx = canvas.getContext('2d');
    var video = document.getElementById(video_id);
    var width = 200;
    var height = 200;

    function update(){
        if (video.paused || video.ended){
            window.requestAnimationFrame(update);
            return;
        }
        ctx.drawImage(video,0,0);
        window.requestAnimationFrame(update);
    }
    window.requestAnimationFrame(update);
}