// Scratch-Off Counter
// Grid of numbered circles to scratch off (advent calendar / challenge tracker)

// --- Parameters ---
Cols         = 5;
Rows         = 6;
Circle_D     = 22;
Spacing      = 4;
Base_H       = 3;
Wall         = 3;
Recess_D     = 18;
Recess_Depth = 0.8;
Number_Size  = 8;
Font         = "Bebas Neue";

$fn = 40;

cell_w  = Circle_D + Spacing;
cell_h  = Circle_D + Spacing;
plate_w = Cols * cell_w + Wall * 2;
plate_h = Rows * cell_h + Wall * 2;
total   = Cols * Rows;

module number_text(n) {
  t = str(n);
  resize([Number_Size * (len(t) > 1 ? 1.2 : 0.8), 0, 0], auto=true)
  text(t, size=Number_Size, font=str(Font, ":style=Bold"),
       halign="center", valign="center");
}

module cell(n) {
  x = ((n % Cols) - (Cols-1)/2) * cell_w;
  y = (floor(n / Cols) - (Rows-1)/2) * cell_h;
  translate([x, y, 0]) {
    // Recess circle
    translate([0, 0, Base_H - Recess_Depth])
    linear_extrude(Recess_Depth + 0.5)
    circle(d=Recess_D);

    // Number raised
    translate([0, 0, Base_H])
    linear_extrude(1.5)
    number_text(n + 1);
  }
}

difference() {
  // Base plate
  translate([-plate_w/2, -plate_h/2, 0])
  cube([plate_w, plate_h, Base_H]);

  // Recesses
  for (n = [0:total-1]) {
    x = ((n % Cols) - (Cols-1)/2) * cell_w;
    y = (floor(n / Cols) - (Rows-1)/2) * cell_h;
    translate([x, y, Base_H - Recess_Depth - 0.5])
    linear_extrude(Recess_Depth + 0.5)
    circle(d=Recess_D);
  }
}

// Numbers on top
for (n = [0:total-1]) {
  x = ((n % Cols) - (Cols-1)/2) * cell_w;
  y = (floor(n / Cols) - (Rows-1)/2) * cell_h;
  translate([x, y, Base_H])
  linear_extrude(1.5)
  number_text(n + 1);
}
