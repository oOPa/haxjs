function segment_arc(st, segment){
    var seg = segment_points(st, segment);

    var arc = data(segment, 'arc');

    if(arc && arc.a[0] == seg.a[0] && arc.a[1] == seg.a[1] &&
       arc.b[0] == seg.b[0] && arc.b[1] ==seg.b[1] && arc.curve == segment.curve){
        return arc;
    }

    arc = {a: seg.a, b: seg.b, curve: segment.curve};

    var curve = segment.curve;

    $.extend(arc, calculate_arc(seg.a, seg.b, curve));
    
    data(segment, 'arc', arc);

    return arc;
}
function render_segment_arc(ctx, segment, arc){
    ctx.beginPath();
    if(arc.curve){
        ctx.arc(arc.center[0], arc.center[1], arc.radius, arc.from, arc.to, false);
    }else{
        ctx.moveTo(arc.a[0], arc.a[1]);
        ctx.lineTo(arc.b[0], arc.b[1]);
    }
}
function segment_arc_to_point(st, segment, pt){
    var s = complete(st, segment);
    var arc = segment_arc(st, segment);
    var o = circumcenter(pt, arc.a, arc.b);
    var new_arc = { a: arc.a, b: arc.b };
    
    if(!o){
        new_arc.curve = 0;
        return new_arc;
    }

    var a = arc.a;
    var b = arc.b;
    var height = height_line_point(a, b, pt);

    new_arc.curve = curve_from_center(o, a, b, height);

    if(Math.abs(new_arc.curve) > maximum_curve){
        new_arc.curve = sign(new_arc.curve) * maximum_curve;
        $.extend(new_arc, calculate_arc(arc.a, arc.b, new_arc.curve));
        return new_arc;
    }

    
    new_arc.center = o;
    new_arc.radius = dist(o, pt);
    new_arc.from = angle_to(o, a);
    new_arc.to = angle_to(o, b);

    if(new_arc.curve < 0){
        var c = new_arc.from;
        new_arc.from = new_arc.to;
        new_arc.to = c;
    }

    return new_arc;
}

function calculate_arc(a, b, curve){
    var arc = {};

    if(curve === 0)
        return arc;

    if(curve < 0){
        curve = -curve;
        var c = a;
        a = b;
        b = c;
    }

    var c = [b[0] - a[0], b[1] - a[1]];
    var d = [
        a[0] + c[0] / 2,
        a[1] + c[1] / 2
    ];
    var nc = norm(c);

    if(curve == 180){
        arc.radius = nc/2;
        arc.center = d;
        arc.from = angle_to(d, a);
        arc.to = angle_to(d, b);
        return arc;
    }

    // |a-b| / sin A = r / sin (90 - A/2)
    var angle = curve * Math.PI / 180;
    var spa2 = Math.sin(Math.PI/2 - angle/2);
    var radius = Math.abs(nc * spa2 / Math.sin(angle));
    
    
    var cp = normalise([c[1], -c[0]]);

    var l = Math.sqrt((nc*nc/4) + radius*radius - nc*radius*Math.cos(Math.PI/2 - angle/2));

    if(curve > 180)
        l = -l;

    arc.radius = radius;
    
    arc.center = [
        d[0] - cp[0] * l,
        d[1] - cp[1] * l
    ];

    arc.from = angle_to(arc.center, a);
    arc.to = angle_to(arc.center, b);
    
    return arc;
}