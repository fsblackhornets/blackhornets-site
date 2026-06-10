(function() {
    var canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    var ctx = canvas.getContext('2d');

    // Draw dark gradient background (site colors)
    var grad = ctx.createLinearGradient(0, 0, 64, 64);
    grad.addColorStop(0, '#1a1a1a');
    grad.addColorStop(1, '#111111');
    ctx.fillStyle = grad;

    // Rounded square
    var r = 12;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(64 - r, 0);
    ctx.quadraticCurveTo(64, 0, 64, r);
    ctx.lineTo(64, 64 - r);
    ctx.quadraticCurveTo(64, 64, 64 - r, 64);
    ctx.lineTo(r, 64);
    ctx.quadraticCurveTo(0, 64, 0, 64 - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.fill();

    // Subtle gold border
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Load the logo and tint it gold
    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function() {
        // Draw logo onto a temp canvas to get pixel data
        var tmp = document.createElement('canvas');
        tmp.width = 64;
        tmp.height = 64;
        var tmpCtx = tmp.getContext('2d');

        // Draw the logo centered with padding
        var pad = 6;
        var size = 64 - pad * 2;
        tmpCtx.drawImage(img, pad, pad, size, size);

        // Get pixel data and tint white pixels to gold
        var imageData = tmpCtx.getImageData(0, 0, 64, 64);
        var data = imageData.data;
        for (var i = 0; i < data.length; i += 4) {
            if (data[i + 3] > 0) {
                // Replace white with gold (#FFD700)
                var alpha = data[i + 3] / 255;
                data[i]     = 255;  // R
                data[i + 1] = 215;  // G
                data[i + 2] = 0;    // B
                data[i + 3] = Math.round(alpha * 255);
            }
        }
        tmpCtx.putImageData(imageData, 0, 0);

        // Composite the gold logo onto the gradient background
        ctx.drawImage(tmp, 0, 0);

        // Set as favicon
        var link = document.querySelector('link[rel="icon"]');
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.type = 'image/png';
        link.href = canvas.toDataURL('image/png');
    };
    img.src = '/public/assets/images/W logo.png';
})();
