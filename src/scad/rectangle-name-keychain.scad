// Rectangle Name Keychain
// Rectangular keychain with name text

// --- Parameters ---
Name          = "Maria";
Font          = "Bebas Neue";
Name_Size     = 40;
Rect_Width    = 70;
Rect_Height   = 30;
Corner_Radius = 5;
Thickness     = 4;
Ring_Hole_D   = 6;
Border        = 1.5;

$fn = 40;

module name_shape(txt, fnt) {
  resize([Name_Size, 0, 0], auto=true)
  text(txt, size=16, font=fnt, halign="center", valign="center");
}

module rect_2d(w, h, r) {
  offset(r=r) offset(-r)
  square([w, h], center=true);
}

module ring_stem() {
  hull() {
    translate([0, Rect_Height / 2])
    rect_2d(Ring_Hole_D + 4, Ring_Hole_D + 4, 2);
    translate([0, Rect_Height / 2 - 4])
    square([Ring_Hole_D + 4, 1], center=true);
  }
}

module keychain_2d() {
  union() {
    rect_2d(Rect_Width, Rect_Height, Corner_Radius);
    ring_stem();
  }
}

difference() {
  linear_extrude(Thickness)
  keychain_2d();

  // Border cutout
  translate([0, 0, Border])
  linear_extrude(Thickness)
  offset(delta=-Border)
  rect_2d(Rect_Width, Rect_Height, Corner_Radius);

  // Ring hole
  translate([0, Rect_Height / 2 + Ring_Hole_D / 2 + 2, -0.5])
  linear_extrude(Thickness + 1)
  circle(d=Ring_Hole_D);

  // Name text (engrave)
  translate([0, 0, Thickness - 1.5])
  linear_extrude(2)
  name_shape(Name, str(Font, ":style=Bold"));
}
