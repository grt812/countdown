$(function(){

  let init = true;
  let imageArray = [];
  let mouseX = -200;
  let mouseY = -200;
  let mouseCoords = [];
  for(let i = 0; i < 20; i++){
    mouseCoords.unshift({x:-200, y:-200});
  }
  let submitValue = false;
  let deleteCountdown = false;

  window.onbeforeunload = function() {
    if (deleteCountDown) {
      deleteCountDown = false;
      return "";
    }
  }

  let backgroundInterval = setInterval(function(){
    // updateTime();
    let tempURL = new URL(window.location.href);
    if(tempURL.searchParams == ""){
      // console.log("Search Params: "+ tempURL.searchParams);
      drawBackground(false);
    } else {
      $("#input-popup").hide();
      // console.log(tempURL.searchParams.length);
      readURL(window.location.href);
    }
  }, 10);

  function updateTime(startDate, endDate, title, progress){
    // let startDate = new Date(2020, 4, 16);
    // let endDate = new Date(2020, 7, 12);
    let timeLeft = endDate.getTime() - Date.now();
    let percentFinished = 1 - (Date.now() - startDate.getTime()) / (endDate.getTime() - startDate.getTime());
    let daysLeft = Math.floor(timeLeft / 24 / 60 / 60 / 1000);
    timeLeft -= daysLeft * 24 * 60 * 60 * 1000;
    let hoursLeft = Math.floor(timeLeft / 60 / 60 / 1000);
    timeLeft -= hoursLeft * 60 * 60 * 1000;
    let minutesLeft = Math.floor(timeLeft / 60 / 1000);
    timeLeft -= minutesLeft * 60 * 1000;
    let secondsLeft = Math.floor(timeLeft / 1000);
    timeLeft -= secondsLeft * 1000;
    let label = title;
    let textColor = betterColorGradient(1 - percentFinished, [255, 0, 0, 0.1], [255, 0, 0, 1]);
    $("#title").text(`${label}`);
    $("#countdown-display").text(`${daysLeft}D ${hoursLeft}H ${minutesLeft}M ${secondsLeft}S`).css("background-color",`rgb(${textColor[0]}, ${textColor[1]}, ${textColor[2]}, ${textColor[3]})`);
    // $("#time-left").html(`${label != "" ? `<h2>${label}</h2><br>` : ""}`).find("h1")
    if(progress == "true"){
      $("#progress-bar").attr("style", "box-shadow: -"+Math.floor($("#progress-bar").width() * percentFinished)+"px 0 0 0 rgba(15, 15, 15) inset;");
      let formatStartDate = moment(startDate).format('MMM Do, YYYY');
      let formatEndDate = moment(endDate).format('MMM Do, YYYY');
      $("#start-date-progress").text(formatStartDate);
      $("#percent-progress").text(((1 - percentFinished).toFixed(2) * 100)+"%");
      $("#end-date-progress").text(formatEndDate);
    } else {
      $("#progress-bar").hide();
    }
  }

  function drawBackground(drawTrails){
    let canvas = $("#background")[0];
    if (canvas.getContext){
      let ctx = canvas.getContext('2d');
      let img = $("#coronavirus")[0];
      if(init){
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        for(let i = 0; i < 30; i++){
          imageArray.push({x: Math.floor(Math.random() * canvas.width), y: Math.floor(Math.random() * canvas.height), size: Math.floor(Math.random() * 100 + 20), direction: Math.random()*2*Math.PI, rotateLeft: Math.random() >= 0.5, rotationDirection: Math.random() * Math.PI * 2, rotationSpeed: Math.random() * 0.001, growth: Math.random()*0.1-0.05});
        }
        init = false;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      imageArray.sort(function(a, b){
        return parseFloat(a.size) - parseFloat(b.size);
      });
      imageArray.forEach(function(e, i){
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, e.x + (mouseX - canvas.width / 2) * 0.001 * e.size, e.y + (mouseY - canvas.height / 2) * 0.001 * e.size);
        ctx.rotate(e.rotationDirection);
        ctx.drawImage(img, - e.size/2, - e.size/2, e.size, e.size);
        ctx.restore();
        e.rotationDirection += e.rotateLeft ? -e.rotationSpeed : e.rotationSpeed;
        e.x += Math.cos(e.direction) * e.size * 0.001; //0.001
        e.y += Math.sin(e.direction) * e.size * 0.001;
        if((e.x + e.size / 2 < 0 || e.x - e.size / 2 > canvas.width || e.y + e.size / 2 < 0 || e.y - e.size / 2 > canvas.height) && !e.spawnOutside){
          // console.log("die");
          let side = Math.floor(Math.random() * 4);
          let tempX;
          let tempY;
          let size = Math.floor(Math.random() * 100 + 20);
          let direction;

          if(side == 0){ //Top of Screen
            tempX = Math.floor(Math.random() * canvas.width);
            tempY = 0 - size / 2;
            direction = Math.random() * Math.PI;
          } else if(side == 1){ //Left of Screen
            tempX = 0 - size / 2;
            tempY = Math.floor(Math.random() * canvas.height);
            direction = Math.random() * Math.PI - Math.PI / 2;
          } else if(side == 2){ //Bottom of Screen
            tempX = Math.floor(Math.random() * canvas.width);
            tempY = canvas.height + size / 2;
            direction = Math.random() * Math.PI + Math.PI;
          } else if(side == 3){ //Right of Screen
            tempX = canvas.width + size / 2;
            tempY = Math.floor(Math.random() * canvas.height);
            direction = Math.random() * Math.PI + Math.PI / 2;
          }
          imageArray.splice(i, 1, {x: tempX, y: tempY, size: size, direction: direction, rotateLeft: Math.random() >= 0.5,  rotationDirection: Math.random() * Math.PI * 2, rotationSpeed: Math.random() * 0.001, growth: Math.random()*0.1-0.05, spawnOutside: true});
        } else if(e.spawnOutside){
          if(!(e.x + e.size / 2 < 0 || e.x - e.size / 2 > canvas.width || e.y + e.size / 2 < 0 || e.y - e.size / 2 > canvas.height)){
            e.spawnOutside = false;
          }
        }
      });
      if(drawTrails){
        drawMouseTrail(ctx);
      }
    }
  }

  function drawMouseTrail(ctx){
    ctx.beginPath();
    for(let i = 0; i < mouseCoords.length; i++){
      ctx.arc(mouseCoords[i].x, mouseCoords[i].y, 10 - i * 0.5, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'rgb(0, 0, 0, 0.2)';
      ctx.fill();
      ctx.closePath()
    }
    mouseCoords.unshift({x: mouseX, y: mouseY});
    mouseCoords.pop();
  }

  $(window).resize(function(){
    $("#background").attr("width",$(this).innerWidth());
    $("#background").attr("height",$(this).innerHeight());
  });

  $(document).on("mousemove",function(e){
    mouseX = e.pageX;
    mouseY = e.pageY;
  });

  $("#submit").click(function(e){
    e.preventDefault();
    let newURL = window.location.protocol + "//" + window.location.host + window.location.pathname + "?startDate=" + $("#start-date").val() + "&endDate=" + $("#end-date").val() + "&title=" + $("#title-input").val() + "&progress="+$("#progress-input").is(":checked");
    window.history.pushState({ path: newURL }, '', newURL);
    $("#input-popup").fadeOut(function(){
      $(this).hide();
    });
    readURL(newURL);
  });

  function readURL(urlString){
    let url = new URL(urlString);
    clearInterval(backgroundInterval);
    $("#countdown").show();
    backgroundInterval = setInterval(function(){
      // updateTime(new Date(parseInt(url.searchParams.get("startDate"))), new Date(parseInt(url.searchParams.get("endDate"))), url.searchParams.get("title"));
      updateTime(new Date(url.searchParams.get("startDate")), new Date(url.searchParams.get("endDate")), url.searchParams.get("title"), url.searchParams.get("progress") == null ? true: url.searchParams.get("progress"));
      drawBackground(true);
    }, 10);
  }

  $("#share-button").click(function(){
      $("#copy-popup").fadeIn(250);
      $("#copy-url").show();
      $("#copy-url").val(window.location.href);
      $("#copy-url").focus().select();
      setTimeout(function(){
        let result = document.execCommand('copy');
        if(result) {
          $("#copy-message").text("The url is copied to your clipboard!");
          $("#copy-url").hide();
          setTimeout(function(){
            $("#copy-popup").fadeOut();
          }, 1500);
        } else {
          $("#copy-message").text("Share this by copying and pasting the url:");
          $("#copy-url").show();
        }
      }, 50);
  });

  $("#close-copy-popup").click(function(){
    $("#copy-popup").fadeOut();
  });

  $("#settings-button").click(function(){
    let url = new URL(window.location.href);
    $("#countdown").fadeOut();
    // let startDate = new Date(parseInt(url.searchParams.get("startDate"))).toISOString();
    // let endDate = new Date(parseInt(url.searchParams.get("endDate"))).toISOString();
    let title = url.searchParams.get("title");
    $("#input-popup").fadeIn();
    // $("#start-date").val(startDate.slice(0, startDate.length - 1));
    // $("#end-date").val(endDate.slice(0, endDate.length - 1));
    $("#start-date").val(url.searchParams.get("startDate"));
    $("#end-date").val(url.searchParams.get("endDate"));
    $("#title-date").val(url.searchParams.get("title"));
    $("#progress-input").prop("checked", url.searchParams.get("progress") == null ? true: url.searchParams.get("progress") == "true");
    // console.log(url.searchParams.get("progress"));
  });

  $("#delete-button").click(function(){
    deleteCountDown = true;
    let newURL = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.pushState({path: newURL}, document.title, newURL);
    window.location.reload();
  });


});
