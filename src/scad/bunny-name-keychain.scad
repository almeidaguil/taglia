// Bunny Name Keychain
// Bunny-shaped keychain with personalized name

// --- Parameters ---
Name         = "Maria";
Font         = "Bebas Neue";
Name_Size    = 20;
Bunny_Size   = 55;
Thickness    = 4;
Ring_Hole_D  = 6;
Text_Depth   = 1.5;

$fn = 50;

module name_shape(txt, fnt) {
  resize([Name_Size, 0, 0], auto=true)
  text(txt, size=10, font=fnt, halign="center", valign="center");
}

module bunny_2d(sz) {
  head_r  = sz * 0.28;
  ear_rx  = sz * 0.10;
  ear_ry  = sz * 0.28;
  body_rx = sz * 0.30;
  body_ry = sz * 0.22;

  union() {
    // Body
    translate([0, -sz * 0.10])
    scale([body_rx, body_ry]) circle(1);

    // Head
    translate([0, sz * 0.14])
    circle(r=head_r);

    // Left ear
    translate([-sz * 0.14, sz * 0.37])
    scale([ear_rx, ear_ry]) circle(1);

    // Right ear
    translate([sz * 0.14, sz * 0.37])
    scale([ear_rx, ear_ry]) circle(1);

    // Tail
    translate([sz * 0.22, -sz * 0.15])
    circle(r=sz * 0.07);
  }
}

difference() {
  linear_extrude(Thickness)
  bunny_2d(Bunny_Size);

  // Ring hole at top of ear
  translate([0, Bunny_Size * 0.46, -0.5])
  linear_extrude(Thickness + 1)
  circle(d=Ring_Hole_D);

  // Engraved name on body
  translate([0, -Bunny_Size * 0.10, Thickness - Text_Depth])
  linear_extrude(Text_Depth + 0.5)
  name_shape(Name, str(Font, ":style=Bold"));
}
