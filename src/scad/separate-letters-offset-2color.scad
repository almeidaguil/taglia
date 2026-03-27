// Separate Letters - 2 Colors
// Generate one letter at a time with 2 color layers

// --- Parameters ---
Letter       = "A";
Font         = "Bebas Neue";
Letter_Size  = 60;
Padding      = 6;
Tolerance    = 0.2;
Base_Height  = 3;
Layer_Height = 4;
Part         = "Base";

$fn = 30;

module letter_shape(l, fnt) {
  resize([Letter_Size, 0, 0], auto=true)
  text(l, size=Letter_Size, font=fnt, halign="center", valign="center");
}

module base_part() {
  difference() {
    linear_extrude(Base_Height)
    offset(delta=Padding)
    letter_shape(Letter, str(Font, ":style=Bold"));

    translate([0, 0, Base_Height - Layer_Height + Tolerance])
    linear_extrude(Layer_Height + 1)
    offset(delta=Tolerance)
    letter_shape(Letter, str(Font, ":style=Bold"));
  }
}

module top_part() {
  linear_extrude(Layer_Height)
  letter_shape(Letter, str(Font, ":style=Bold"));
}

if (Part == "Base") {
  base_part();
} else if (Part == "Top") {
  translate([0, 0, Base_Height])
  top_part();
}
