// Word Heart Sign - 2 Colors
// Two names with a heart shape between them

// --- Parameters ---
Word1        = "Ana";
Word2        = "João";
Font         = "Bebas Neue";
Word_Size    = 80;
Heart_Size   = 40;
Spacing      = 15;
Base_Width   = 270;
Tolerance    = 0.2;
Base_Height  = 3;
Layer_Height = 4;
Part         = "Base";

$fn = 40;
padding = 12;

base_h = max(Layer_Height * 0.6, Word_Size * 0.2);
bd = base_h + padding * 2;

module heart_2d(size=20) {
  r = size / 4;
  hull() {
    translate([-r, 0]) circle(r=r);
    translate([r, 0]) circle(r=r);
  }
  translate([0, -size * 0.18])
  rotate([0, 0, 45])
  square([size * 0.5, size * 0.5], center=true);
}

module word_shape(txt, fnt, sz) {
  resize([sz, 0, 0], auto=true)
  text(txt, size=30, font=fnt, halign="center", valign="center");
}

module top_shape() {
  hw = Word_Size / 2;
  hh = Heart_Size / 2;
  gap = Spacing;

  translate([-(hh + gap + hw), 0])
  word_shape(Word1, str(Font, ":style=Bold"), Word_Size);

  translate([0, Heart_Size * 0.05])
  heart_2d(Heart_Size);

  translate([hh + gap + hw, 0])
  word_shape(Word2, str(Font, ":style=Bold"), Word_Size);
}

module base_plate() {
  offset(r=5) offset(-5)
  square([Base_Width, bd], center=true);
}

module base_part() {
  difference() {
    linear_extrude(Base_Height)
    base_plate();

    translate([0, 0, Base_Height - Layer_Height + Tolerance])
    linear_extrude(Layer_Height + 1)
    offset(delta=Tolerance)
    top_shape();
  }
}

module top_part() {
  linear_extrude(Layer_Height)
  top_shape();
}

if (Part == "Base") {
  base_part();
} else if (Part == "Top") {
  translate([0, 0, Base_Height])
  top_part();
}
