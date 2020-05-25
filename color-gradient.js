//Credit to https://gist.github.com/gskema/2f56dc2e087894ffc756c11e6de1b5ed

function colorGradient(fadeFraction, rgbColor1, rgbColor2, rgbColor3) {
    var color1 = rgbColor1;
    var color2 = rgbColor2;
    var fade = fadeFraction;

    // Do we have 3 colors for the gradient? Need to adjust the params.
    if (rgbColor3) {
      fade = fade * 2;

      // Find which interval to use and adjust the fade percentage
      if (fade >= 1) {
        fade -= 1;
        color1 = rgbColor2;
        color2 = rgbColor3;
      }
    }

    var diffRed = color2.red - color1.red;
    var diffGreen = color2.green - color1.green;
    var diffBlue = color2.blue - color1.blue;

    var gradient = {
      red: parseInt(Math.floor(color1.red + (diffRed * fade)), 10),
      green: parseInt(Math.floor(color1.green + (diffGreen * fade)), 10),
      blue: parseInt(Math.floor(color1.blue + (diffBlue * fade)), 10),
    };

    return 'rgb(' + gradient.red + ',' + gradient.green + ',' + gradient.blue + ')';
  }

function betterColorGradient(fade){
  fade = Math.max(Math.min(1, fade), 0);
  let colorThreshold = 1 / (arguments.length - 2);
  let colorOrder = Math.floor(fade / colorThreshold);
  let startColor = arguments[colorOrder+1];
  let endColor = typeof arguments[colorOrder+2] != "undefined" ? arguments[colorOrder+2] : arguments[colorOrder+1];
  let percentFade = ((fade % colorThreshold) / colorThreshold);
  let changeRed = startColor[0] + (endColor[0] - startColor[0]) * percentFade;
  let changeGreen = startColor[1] + (endColor[1] - startColor[1]) * percentFade;
  let changeBlue = startColor[2] + (endColor[2] - startColor[2]) * percentFade;
  startColor[3] = typeof startColor[3] != "undefined" ? startColor[3] : 1;
  endColor[3] = typeof endColor[3] != "undefined" ? endColor[3] : 1;
  let changeAlpha = startColor[3] + (endColor[3] - startColor[3]) * percentFade;
  return [changeRed, changeGreen, changeBlue, changeAlpha];
}

// function floorSubTop(number){
//   return number != Math.floor(number) ? Math.floor(number) : number - 1;
// }
