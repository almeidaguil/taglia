// Candy Mold (Brigadeiro)
// Parametric mold with dome-shaped cavities

// --- Parameters ---
Cols         = 4;
Rows         = 3;
Cavity_D     = 35;
Cavity_Depth = 14;
Wall         = 3;
Base_H       = 2;
Spacing      = 5;

$fn = 50;

cavity_r = Cavity_D / 2;
cell_w   = Cavity_D + Spacing;
cell_h   = Cavity_D + Spacing;
plate_w  = Cols * cell_w + Wall * 2;
plate_h  = Rows * cell_h + Wall * 2;
plate_t  = Base_H + Cavity_Depth;

module dome_cavity() {
  // Half-sphere cavity
  translate([0, 0, plate_t - Cavity_Depth])
  intersection() {
    translate([0, 0, -cavity_r + Cavity_Depth])
    sphere(r=cavity_r);
    cylinder(h=Cavity_Depth + 1, r=cavity_r + 1);
  }
}

difference() {
  // Base plate
  translate([-plate_w/2, -plate_h/2, 0])
  cube([plate_w, plate_h, plate_t]);

  // Cavity grid
  for (c = [0:Cols-1], r = [0:Rows-1]) {
    x = (c - (Cols-1)/2) * cell_w;
    y = (r - (Rows-1)/2) * cell_h;
    translate([x, y, 0])
    dome_cavity();
  }
}
