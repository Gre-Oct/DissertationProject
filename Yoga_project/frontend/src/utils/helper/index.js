
export function drawSegment(ctx, [mx, my], [tx, ty], color) {
    ctx.beginPath()
    ctx.moveTo(mx, my)
    ctx.lineTo(tx, ty)
    ctx.lineWidth = 5
    ctx.strokeStyle = color
    ctx.stroke()
}

export function drawPoint(pose, ctx, x, y, r, color, name, noseX, noseY, multiplier, margin) {
    //console.log(name);
    //console.log("nose ", noseX, " | ", noseY);
    //console.log(noseX - x , '  ' , noseY - y);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);

    if (pose == 'Chair') {
        switch (name) {
            case 'left_eye':
                validatePoint(ctx, noseX, noseY, x, y, -2, 5, color, multiplier, margin);
                break;
            case 'right_eye':
                validatePoint(ctx, noseX, noseY, x, y, 3, 5, color, multiplier, margin);
                break;
            case 'left_ear':
                validatePoint(ctx, noseX, noseY, x, y, -2, 5, color, multiplier, margin);
                break;
            case 'right_ear':
                validatePoint(ctx, noseX, noseY, x, y, 8, 5, color, multiplier, margin);
                break;
            case 'left_shoulder':
                validatePoint(ctx, noseX, noseY, x, y, -3, -11, color, multiplier, margin);
                break;
            case 'right_shoulder':
                validatePoint(ctx, noseX, noseY, x, y, 15, -12, color, multiplier, margin);
                break;
            case 'left_elbow':
                validatePoint(ctx, noseX, noseY, x, y, 0, 30, color, multiplier, margin);
                break;
            case 'right_elbow':
                validatePoint(ctx, noseX, noseY, x, y, 0, 30, color, multiplier, margin);
                break;
            case 'left_wrist':
                validatePoint(ctx, noseX, noseY, x, y, -21, 70, color, multiplier, margin);
                break;
            case 'right_wrist':
                validatePoint(ctx, noseX, noseY, x, y, -20, 70, color, multiplier, margin);
                break;
            case 'left_hip':
                validatePoint(ctx, noseX, noseY, x, y, 60, -62, color, multiplier, margin);
                break;
            case 'right_hip':
                validatePoint(ctx, noseX, noseY, x, y, 60, -62, color, multiplier, margin);
                break;
            case 'left_knee':
                validatePoint(ctx, noseX, noseY, x, y, 13, -110, color, multiplier, margin);
                break;
            case 'right_knee':
                validatePoint(ctx, noseX, noseY, x, y, 15, -110, color, multiplier, margin);
                break;
            case 'left_ankle':
                validatePoint(ctx, noseX, noseY, x, y, 40, -155, color, multiplier, margin);
                break;
            case 'right_ankle':
                validatePoint(ctx, noseX, noseY, x, y, 40, -155, color, multiplier, margin);
                break;
            default:
                ctx.fillStyle = color;
                break;
        }
    }
    else if (pose == 'Triangle') {
        switch (name) {
            case 'left_eye':
                validatePoint(ctx, noseX, noseY, x, y, -8, -12, color, multiplier, margin);
                break;
            case 'right_eye':
                validatePoint(ctx, noseX, noseY, x, y, -5, -2, color, multiplier, margin);
                break;
            case 'left_ear':
                validatePoint(ctx, noseX, noseY, x, y, -4, -22, color, multiplier, margin);
                break;
            case 'right_ear':
                validatePoint(ctx, noseX, noseY, x, y, -4, -10, color, multiplier, margin);
                break;
            case 'left_shoulder':
                validatePoint(ctx, noseX, noseY, x, y, 15, -45, color, multiplier, margin);
                break;
            case 'right_shoulder':
                validatePoint(ctx, noseX, noseY, x, y, 25, 9, color, multiplier, margin);
                break;
            case 'left_elbow':
                validatePoint(ctx, noseX, noseY, x, y, 15, -75, color, multiplier, margin);
                break;
            case 'right_elbow':
                validatePoint(ctx, noseX, noseY, x, y, 27, 47, color, multiplier, margin);
                break;
            case 'left_wrist':
                validatePoint(ctx, noseX, noseY, x, y, 7, -107, color, multiplier, margin);
                break;
            case 'right_wrist':
                validatePoint(ctx, noseX, noseY, x, y, 25, 80, color, multiplier, margin);
                break;
            case 'left_hip':
                validatePoint(ctx, noseX, noseY, x, y, 57, -45, color, multiplier, margin);
                break;
            case 'right_hip':
                validatePoint(ctx, noseX, noseY, x, y, 80, -30, color, multiplier, margin);
                break;
            case 'left_knee':
                validatePoint(ctx, noseX, noseY, x, y, 25, -95, color, multiplier, margin);
                break;
            case 'right_knee':
                validatePoint(ctx, noseX, noseY, x, y, 100, -90, color, multiplier, margin);
                break;
            case 'left_ankle':
                validatePoint(ctx, noseX, noseY, x, y, 5, -140, color, multiplier, margin);
                break;
            case 'right_ankle':
                validatePoint(ctx, noseX, noseY, x, y, 120, -150, color, multiplier, margin);
                break;
            default:
                ctx.fillStyle = color;
                break;
        }
    }
    else if (pose == 'Tree') {
        switch (name) {
            case 'left_eye':
                validatePoint(ctx, noseX, noseY, x, y, -3, 5, color, multiplier, margin);
                break;
            case 'right_eye':
                validatePoint(ctx, noseX, noseY, x, y, 3, 5, color, multiplier, margin);
                break;
            case 'left_ear':
                validatePoint(ctx, noseX, noseY, x, y, -6, 2, color, multiplier, margin);
                break;
            case 'right_ear':
                validatePoint(ctx, noseX, noseY, x, y, 8, 2, color, multiplier, margin);
                break;
            case 'left_shoulder':
                validatePoint(ctx, noseX, noseY, x, y, -15, -25, color, multiplier, margin);
                break;
            case 'right_shoulder':
                validatePoint(ctx, noseX, noseY, x, y, 15, -25, color, multiplier, margin);
                break;
            case 'left_elbow':
                validatePoint(ctx, noseX, noseY, x, y, -33, -55, color, multiplier, margin);
                break;
            case 'right_elbow':
                validatePoint(ctx, noseX, noseY, x, y, 33, -55, color, multiplier, margin);
                break;
            case 'left_wrist':
                validatePoint(ctx, noseX, noseY, x, y, -6, -50, color, multiplier, margin);
                break;
            case 'right_wrist':
                validatePoint(ctx, noseX, noseY, x, y, 6, -50, color, multiplier, margin);
                break;
            case 'left_hip':
                validatePoint(ctx, noseX, noseY, x, y, -10, -100, color, multiplier, margin);
                break;
            case 'right_hip':
                validatePoint(ctx, noseX, noseY, x, y, 10, -97, color, multiplier, margin);
                break;
            case 'left_knee':
                validatePoint(ctx, noseX, noseY, x, y, -8, -160, color, multiplier, margin);
                break;
            case 'right_knee':
                validatePoint(ctx, noseX, noseY, x, y, 56, -120, color, multiplier, margin);
                break;
            case 'left_ankle':
                validatePoint(ctx, noseX, noseY, x, y, 1, -210, color, multiplier, margin);
                break;
            case 'right_ankle':
                validatePoint(ctx, noseX, noseY, x, y, 13, -140, color, multiplier, margin);
                break;
            default:
                ctx.fillStyle = color;
                break;
        }
    }

    ctx.fill();
}

function validatePoint(ctx, noseX, noseY, x, y, deltaX, deltaY, color, multiplier, margin)
{
    if((noseX - x > deltaX * multiplier - margin && noseX - x < deltaX * multiplier + margin) &&
       (noseY - y > deltaY * multiplier - margin && noseY - y < deltaY * multiplier + margin))
    {
        ctx.fillStyle = color;
    }
    else
    {
        ctx.fillStyle = 'rgb(255,0,0)';
    }
}