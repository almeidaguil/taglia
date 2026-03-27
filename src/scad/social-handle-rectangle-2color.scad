// Social Handle Rectangle Sign - 2 Colors

// --- Parameters ---
Handle        = "mafa3d";
Show_At       = true;
Font          = "Bebas Neue";
Target_Size   = 140;
Rect_Width    = 220;
Rect_Height   = 80;
Corner_Radius = 8;
Tolerance     = 0.2;
Base_Height   = 3;
Layer_Height  = 4;
Part          = "Base";

$fn = 40;

display_text = Show_At ? str("@", Handle) : Handle;

module text_shape(txt, fnt) {
  resize([Target_Size, 0, 0], auto=true)
  text(txt, size=40, font=fnt, halign="center", valign="center");
}

module rect_plate() {
  offset(r=Corner_Radius) offset(-Corner_Radius)
  square([Rect_Width, Rect_Height], center=true);
}

module base_part() {
  difference() {
    linear_extrude(Base_Height)
    rect_plate();

    translate([0, 0, Base_Height - Layer_Height + Tolerance])
    linear_extrude(Layer_Height + 1)
    offset(delta=Tolerance)
    text_shape(display_text, str(Font, ":style=Bold"));
  }
}

module top_part() {
  linear_extrude(Layer_Height)
  text_shape(display_text, str(Font, ":style=Bold"));
}

if (Part == "Base") {
  base_part();
} else if (Part == "Top") {
  translate([0, 0, Base_Height])
  top_part();
}
