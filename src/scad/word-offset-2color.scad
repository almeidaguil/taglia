// Word Sign - 2 Layers
// Parametric word sign with 2 color layers (Base, Top)

// --- Parameters ---
Text        = "Mafa3D";
Font        = "Bebas Neue";
Target_Size = 150;
Base_Width  = 180;
Offset      = 2;
Tolerance   = 0.2;
Base_Height = 3;
Layer_Height = 4;
Part        = "Base";

$fn = 30;
padding = 8;

base_h = max(Layer_Height * 0.6, Target_Size * 0.15);
bw = Base_Width;
bd = base_h + padding * 2;

module text_shape(txt, fnt) {
  resize([Target_Size, 0, 0], auto=true)
  text(txt, size=40, font=fnt, halign="center", valign="center");
}

module base_plate() {
  offset(r=4) offset(-4)
  square([bw, bd], center=true);
}

module base_part() {
  difference() {
    linear_extrude(Base_Height)
    base_plate();

    translate([0, 0, Base_Height - Layer_Height + Tolerance])
    linear_extrude(Layer_Height + 1)
    offset(delta=Tolerance)
    text_shape(Text, str(Font, ":style=Bold"));
  }
}

module top_part() {
  linear_extrude(Layer_Height)
  text_shape(Text, str(Font, ":style=Bold"));
}

if (Part == "Base") {
  base_part();
} else if (Part == "Top") {
  translate([0, 0, Base_Height])
  top_part();
}
