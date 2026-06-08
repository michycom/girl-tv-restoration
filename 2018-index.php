<!DOCTYPE html>
<html>
<head>
    <title>girl.tv listens to "nothing in this bus"</title>
    <script src="https://girl.tv/js/jquery-3.7.1.min.js"></script>
    <style>
        video {
            height: 80%;
            width: 80%;
            margin: 0 auto;
            display: block;
        }
    </style>
</head>
<body style="background:white;">
    <div style="margin:100px; text-align:center;">
        <video id="myvideo" controls playsinline autoplay loop>
            <source src="https://girl.tv/bus/NOTHING_IN_THIS_BUS_480p.mp4" type="video/mp4"/>
        </video>
    </div>
    <script>
        $(document).ready(function(){
            $("html").click(function(){
                document.getElementById('myvideo').play();
            });
        });
    </script>
</body>
</html>
