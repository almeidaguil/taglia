// Candy Mold Rounded
// Parametric mold with cylindrical rounded-bottom cavities

// --- Parameters ---
Cols         = 4;
Rows         = 3;
Cavity_D     = 32;
Cavity_Depth = 15;
Wall         = 3;
Base_H       = 2;
Spacing      = 6;
Round_Base   = 8;

$fn = 50;

cell_w  = Cavity_D + Spacing;
cell_h  = Cavity_D + Spacing;
plate_w = Cols * cell_w + Wall * 2;
plate_h = Rows * cell_h + Wall * 2;
plate_t = Base_H + Cavity_Depth;

module rounded_cavity() {
  r  = Cavity_D / 2;
  rb = min(Round_Base, r);
  union() {
    // Cylinder upper part
    translate([0, 0, plate_t - Cavity_Depth])
    cylinder(h=Cavity_Depth - rb + 0.1, r=r);

    // Rounded bottom
    translate([0, 0, plate_t - Cavity_Depth + rb])
    minkowski() {
      cylinder(h=0.01, r=r - rb);
      sphere(r=rb);
    }
  }
}

difference() {
  translate([-plate_w/2, -plate_h/2, 0])
  cube([plate_w, plate_h, plate_t]);

  for (c = [0:Cols-1], r = [0:Rows-1]) {
    x = (c - (Cols-1)/2) * cell_w;
    y = (r - (Rows-1)/2) * cell_h;
    translate([x, y, 0])
    rounded_cavity();
  }
}
