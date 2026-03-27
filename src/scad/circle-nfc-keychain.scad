// Circle NFC Keychain
// Circular keychain with NFC tag cavity and personalized name

// --- Parameters ---
Name         = "Maria";
Font         = "Bebas Neue";
Name_Size    = 25;
Diameter     = 45;
Thickness    = 5;
Ring_Hole_D  = 6;
NFC_Diameter = 28;
NFC_Depth    = 1.2;
Text_Depth   = 1.2;

$fn = 60;

module name_shape(txt, fnt) {
  resize([Name_Size, 0, 0], auto=true)
  text(txt, size=10, font=fnt, halign="center", valign="center");
}

module ring_stem_2d() {
  hull() {
    translate([0, Diameter / 2])
    circle(d=Ring_Hole_D + 6);
    translate([0, Diameter / 2 - 4])
    square([Ring_Hole_D + 6, 1], center=true);
  }
}

module keychain_2d() {
  union() {
    circle(d=Diameter);
    ring_stem_2d();
  }
}

difference() {
  linear_extrude(Thickness)
  keychain_2d();

  // NFC cavity on back (circular)
  translate([0, 0, -0.5])
  linear_extrude(NFC_Depth + 0.5)
  circle(d=NFC_Diameter);

  // Name engraved on front
  translate([0, 0, Thickness - Text_Depth])
  linear_extrude(Text_Depth + 0.5)
  name_shape(Name, str(Font, ":style=Bold"));

  // Ring hole
  translate([0, Diameter / 2 + Ring_Hole_D / 2 + 3, -0.5])
  linear_extrude(Thickness + 1)
  circle(d=Ring_Hole_D);
}
