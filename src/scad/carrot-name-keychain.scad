// Carrot Name Keychain
// Carrot-shaped keychain with personalized name

// --- Parameters ---
Name          = "Maria";
Font          = "Bebas Neue";
Name_Size     = 25;
Carrot_Width  = 28;
Carrot_Height = 65;
Thickness     = 4;
Ring_Hole_D   = 6;
Text_Depth    = 1.5;

$fn = 50;

module name_shape(txt, fnt) {
  resize([Name_Size, 0, 0], auto=true)
  text(txt, size=10, font=fnt, halign="center", valign="center");
}

module carrot_body_2d(w, h) {
  // Tapered body: wide at top, pointed at bottom
  hull() {
    translate([0, h * 0.2])
    ellipse(w * 0.9, w * 0.55);
    translate([0, -h * 0.45])
    circle(r=1.5);
  }
}

module ellipse(rx, ry) {
  scale([rx, ry]) circle(1);
}

module leaf_2d(w, h) {
  // Three leaves at top
  for (a = [-20, 0, 20]) {
    rotate([0, 0, a])
    translate([0, h * 0.08])
    scale([0.35, 1])
    circle(r=h * 0.2);
  }
}

module carrot_2d(w, h) {
  union() {
    carrot_body_2d(w, h);
    leaf_2d(w, h);
  }
}

module ring_hole_pos() {
  translate([0, Carrot_Height * 0.42])
  children();
}

difference() {
  linear_extrude(Thickness)
  carrot_2d(Carrot_Width, Carrot_Height);

  // Ring hole
  ring_hole_pos()
  translate([0, 0, -0.5])
  linear_extrude(Thickness + 1)
  circle(d=Ring_Hole_D);

  // Engraved name
  translate([0, 0, Thickness - Text_Depth])
  linear_extrude(Text_Depth + 0.5)
  name_shape(Name, str(Font, ":style=Bold"));
}
