var el = document.querySelector('.view');
var num = getCookie('view')


if (window.performance) {
  }
    if (performance.navigation.type == 1) {
    } else {
      document.cookie = "view=0";
    }

odom = new Odometer({
    el: el
})

setInterval(() => {
    getView()
}, 2000)

function getView(){
    var kue = getCookie('id')
    fetch(`https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${kue}&key=<your google auth key>`).then(res => res.json()).then((out) => {
        var viewer = out.items[0].liveStreamingDetails.concurrentViewers
        if (viewer > num){
            num = viewer
            document.cookie = `view=${viewer}`;
        }
        odo_view(num)
    }).catch(err => console.error(err));
}   

function odo_view(viewer){
    odom.update(viewer)
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
