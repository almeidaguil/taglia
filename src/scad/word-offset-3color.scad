// Word Sign - 3 Layers
// Parametric word sign with 3 color layers (Base, Middle, Top)
// Parameters are injected by the renderer

// --- Parameters ---
Text        = "Mafa3D";
Font        = "Bebas Neue";
Target_Size = 150;     // mm - target text width
Base_Width  = 180;     // mm - base plate width
Offset      = 2;       // mm - layer offset
Tolerance   = 0.2;     // mm - fit tolerance
Base_Height = 3;       // mm - base plate height
Layer_Height = 4;      // mm - height per color layer
Part        = "Base";  // "Base" | "Middle" | "Top"

// --- Constants ---
$fn = 30;
padding = 8;           // padding around text on base plate

// --- Computed ---
base_depth = Base_Height;
text_h     = Layer_Height;
mid_h      = Layer_Height;
top_h      = Layer_Height;

// Estimated base height from bounding box
base_h = max(
  text_h * 0.6,
  Target_Size * 0.15
);

// Base plate dimensions
bw = Base_Width;
bd = base_h + padding * 2;

// --- Modules ---

module text_shape(txt, size, fnt) {
  resize([Target_Size, 0, 0], auto=true)
  text(txt, size=size, font=fnt, halign="center", valign="center");
}

module base_plate() {
  // Rounded rectangle base
  offset(r=4) offset(-4)
  square([bw, bd], center=true);
}

module base_part() {
  difference() {
    // Base plate
    linear_extrude(base_depth)
    base_plate();

    // Pocket for middle layer
    translate([0, 0, base_depth - text_h + Tolerance])
    linear_extrude(text_h + 1)
    offset(delta=Tolerance)
    text_shape(Text, 40, str(Font, ":style=Bold"));
  }
}

module middle_part() {
  difference() {
    // Offset shell
    linear_extrude(mid_h)
    offset(delta=Offset)
    text_shape(Text, 40, str(Font, ":style=Bold"));

    // Pocket for top layer
    translate([0, 0, mid_h - top_h + Tolerance])
    linear_extrude(top_h + 1)
    offset(delta=Tolerance)
    text_shape(Text, 40, str(Font, ":style=Bold"));
  }
}

module top_part() {
  linear_extrude(top_h)
  text_shape(Text, 40, str(Font, ":style=Bold"));
}

// --- Render ---
if (Part == "Base") {
  base_part();
} else if (Part == "Middle") {
  translate([0, 0, base_depth])
  middle_part();
} else if (Part == "Top") {
  translate([0, 0, base_depth + mid_h])
  top_part();
}
