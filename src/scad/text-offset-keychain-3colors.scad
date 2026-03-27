// Text Offset Keychain - 3 Colors

// --- Parameters ---
Name          = "Maria";
Font          = "Bebas Neue";
Name_Size     = 40;
Rect_Width    = 75;
Rect_Height   = 32;
Corner_Radius = 5;
Offset        = 1.5;
Tolerance     = 0.2;
Base_Height   = 3;
Layer_Height  = 2.5;
Ring_Hole_D   = 6;
Part          = "Base";

$fn = 40;

module name_shape(txt, fnt) {
  resize([Name_Size, 0, 0], auto=true)
  text(txt, size=16, font=fnt, halign="center", valign="center");
}

module rect_2d(w, h, r) {
  offset(r=r) offset(-r)
  square([w, h], center=true);
}

module body_2d() {
  union() {
    rect_2d(Rect_Width, Rect_Height, Corner_Radius);
    hull() {
      translate([0, Rect_Height / 2])
      circle(d=Ring_Hole_D + 6);
      translate([0, Rect_Height / 2 - 3])
      square([Ring_Hole_D + 6, 1], center=true);
    }
  }
}

module ring_hole_cut() {
  translate([0, Rect_Height / 2 + Ring_Hole_D / 2 + 3, -0.5])
  linear_extrude(Base_Height + Layer_Height * 2 + 1)
  circle(d=Ring_Hole_D);
}

module base_part() {
  difference() {
    linear_extrude(Base_Height)
    body_2d();

    translate([0, 0, Base_Height - Layer_Height + Tolerance])
    linear_extrude(Layer_Height + 1)
    offset(delta=Tolerance)
    name_shape(Name, str(Font, ":style=Bold"));

    ring_hole_cut();
  }
}

module middle_part() {
  difference() {
    linear_extrude(Layer_Height)
    offset(delta=Offset)
    name_shape(Name, str(Font, ":style=Bold"));

    translate([0, 0, Layer_Height - Layer_Height + Tolerance])
    linear_extrude(Layer_Height + 1)
    offset(delta=Tolerance)
    name_shape(Name, str(Font, ":style=Bold"));
  }
}

module top_part() {
  linear_extrude(Layer_Height)
  name_shape(Name, str(Font, ":style=Bold"));
}

if (Part == "Base") {
  base_part();
} else if (Part == "Middle") {
  translate([0, 0, Base_Height])
  middle_part();
} else if (Part == "Top") {
  translate([0, 0, Base_Height + Layer_Height])
  top_part();
}
