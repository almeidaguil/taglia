// Text Placement Helper
// Ruler and guide tool for positioning text on 3D prints

// --- Parameters ---
Width        = 200;
Height       = 30;
Thickness    = 2.5;
Grid_Spacing = 10;
Mark_Depth   = 0.6;
Mark_H       = 3;
Label_Size   = 5;
Font         = "Roboto Mono";
Corner_Radius = 3;

$fn = 30;

module ruler_body() {
  offset(r=Corner_Radius) offset(-Corner_Radius)
  square([Width, Height], center=true);
}

module tick(x, size, depth) {
  translate([x, -size/2, Thickness - depth])
  cube([0.8, size, depth + 0.2], center=true);
}

module number_label(n, x) {
  translate([x, -Height * 0.22, Thickness - Mark_Depth])
  linear_extrude(Mark_Depth + 0.2)
  resize([Label_Size, 0, 0], auto=true)
  text(str(n), size=Label_Size, font=Font, halign="center", valign="center");
}

// Base plate
linear_extrude(Thickness)
ruler_body();

// Grid marks
for (i = [0: floor(Width / Grid_Spacing)]) {
  x = -Width/2 + i * Grid_Spacing;
  if (i % 5 == 0) {
    // Major tick
    translate([x, 0, 0])
    tick(0, Mark_H * 1.5, Mark_Depth);
  } else {
    // Minor tick
    translate([x, 0, 0])
    tick(0, Mark_H, Mark_Depth);
  }
}

// Center mark
translate([0, 0, 0])
tick(0, Height * 0.6, Mark_Depth);

// Number labels every 50mm
for (i = [0: floor(Width / 50)]) {
  x = -Width/2 + i * 50;
  number_label(i * 50, x);
}
