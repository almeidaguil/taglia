// Square NFC Keychain
// Square keychain with NFC tag cavity and personalized name

// --- Parameters ---
Name          = "Maria";
Font          = "Bebas Neue";
Name_Size     = 28;
Side          = 45;
Corner_Radius = 6;
Thickness     = 5;
Ring_Hole_D   = 6;
NFC_Width     = 26;
NFC_Height    = 26;
NFC_Depth     = 1.2;
Text_Depth    = 1.2;

$fn = 40;

module name_shape(txt, fnt) {
  resize([Name_Size, 0, 0], auto=true)
  text(txt, size=10, font=fnt, halign="center", valign="center");
}

module square_body_2d() {
  offset(r=Corner_Radius) offset(-Corner_Radius)
  square([Side, Side], center=true);
}

module ring_stem_2d() {
  hull() {
    translate([0, Side / 2])
    circle(d=Ring_Hole_D + 6);
    translate([0, Side / 2 - 4])
    square([Ring_Hole_D + 6, 1], center=true);
  }
}

module keychain_2d() {
  union() {
    square_body_2d();
    ring_stem_2d();
  }
}

difference() {
  linear_extrude(Thickness)
  keychain_2d();

  // NFC cavity on back
  translate([0, 0, -0.5])
  linear_extrude(NFC_Depth + 0.5)
  offset(r=1) offset(-1)
  square([NFC_Width, NFC_Height], center=true);

  // Name engraved on front
  translate([0, -Side * 0.05, Thickness - Text_Depth])
  linear_extrude(Text_Depth + 0.5)
  name_shape(Name, str(Font, ":style=Bold"));

  // Ring hole
  translate([0, Side / 2 + Ring_Hole_D / 2 + 3, -0.5])
  linear_extrude(Thickness + 1)
  circle(d=Ring_Hole_D);
}
