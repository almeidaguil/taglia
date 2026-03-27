// Sized Pen Holder
// Parametric pen/pencil holder with configurable hole sizes

// --- Parameters ---
Outer_D      = 80;
Height       = 100;
Wall         = 4;
Hole1_D      = 8;
Hole2_D      = 10;
Hole3_D      = 14;
Holes_Per_Ring = 6;
Base_H       = 3;

$fn = 60;

inner_r = Outer_D / 2 - Wall;

module hole_ring(hole_d, ring_r, n) {
  for (i = [0:n-1]) {
    angle = i * 360 / n;
    translate([ring_r * cos(angle), ring_r * sin(angle), 0])
    circle(d=hole_d);
  }
}

difference() {
  // Outer cylinder
  cylinder(h=Height, d=Outer_D);

  // Inner hollow
  translate([0, 0, Base_H])
  cylinder(h=Height, d=Outer_D - Wall * 2);

  // Small holes (innermost ring)
  translate([0, 0, -0.5])
  linear_extrude(Height + 1)
  hole_ring(Hole1_D, inner_r * 0.4, Holes_Per_Ring);

  // Medium holes (middle ring)
  translate([0, 0, -0.5])
  linear_extrude(Height + 1)
  hole_ring(Hole2_D, inner_r * 0.7, Holes_Per_Ring);

  // Large holes (outer ring)
  translate([0, 0, -0.5])
  linear_extrude(Height + 1)
  hole_ring(Hole3_D, inner_r * 0.9, Holes_Per_Ring);
}
