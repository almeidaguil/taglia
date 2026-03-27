// Full Name Keychain
// Simple flat keychain with name text, single color

// --- Parameters ---
Name         = "Maria";
Font         = "Bebas Neue";
Name_Size    = 50;
Padding      = 5;
Thickness    = 4;
Ring_Hole_D  = 6;

$fn = 40;

module name_shape(txt, fnt) {
  resize([Name_Size, 0, 0], auto=true)
  text(txt, size=20, font=fnt, halign="center", valign="center");
}

module ring_hole() {
  // Position hole above the text bounding box
  translate([0, Name_Size * 0.35 + Padding + Ring_Hole_D, 0])
  circle(d=Ring_Hole_D);
}

module keychain_2d(txt, fnt) {
  union() {
    // Text with padding as background
    offset(delta=Padding)
    name_shape(txt, fnt);

    // Stem to ring hole
    hull() {
      translate([0, Name_Size * 0.35 + Padding])
      circle(d=Ring_Hole_D + Padding * 2);

      translate([-Ring_Hole_D / 2, Name_Size * 0.35 + Padding * 0.5])
      square([Ring_Hole_D, 1]);
    }
  }
}

difference() {
  linear_extrude(Thickness)
  keychain_2d(Name, str(Font, ":style=Bold"));

  translate([0, Name_Size * 0.35 + Padding + Ring_Hole_D, Thickness / 2 - Ring_Hole_D / 2])
  linear_extrude(Thickness + 1)
  circle(d=Ring_Hole_D);
}
