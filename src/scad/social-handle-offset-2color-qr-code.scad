// Social Handle + QR Code Placeholder - 2 Colors
// Handle sign with a QR code area (placeholder for sticker or separate print)

// --- Parameters ---
Handle        = "mafa3d";
Show_At       = true;
Font          = "Bebas Neue";
Text_Size     = 100;
QR_Size       = 70;
Rect_Width    = 280;
Rect_Height   = 100;
Corner_Radius = 8;
Tolerance     = 0.2;
Base_Height   = 3;
Layer_Height  = 4;
QR_Depth      = 1;
Part          = "Base";

$fn = 40;

display_text = Show_At ? str("@", Handle) : Handle;

// Layout: QR on left, text on right
text_offset_x = QR_Size / 2 + 10;
qr_offset_x   = -(Rect_Width / 2 - QR_Size / 2 - 10);

module text_shape(txt, fnt) {
  avail = Rect_Width - QR_Size - 30;
  sz = min(Text_Size, avail);
  resize([sz, 0, 0], auto=true)
  text(txt, size=40, font=fnt, halign="center", valign="center");
}

module qr_placeholder() {
  // Corner squares (QR code corners)
  s = QR_Size * 0.25;
  for (cx = [-1, 1], cy = [-1, 1]) {
    if (!(cx == 1 && cy == -1)) { // 3 corners only
      translate([cx * (QR_Size/2 - s/2), cy * (QR_Size/2 - s/2)])
      difference() {
        square([s, s], center=true);
        square([s * 0.55, s * 0.55], center=true);
      }
    }
  }
  // Data area dots (decorative)
  for (i = [0:3], j = [0:3]) {
    if ((i + j) % 2 == 0)
    translate([(i - 1.5) * QR_Size * 0.15, (j - 1.5) * QR_Size * 0.15])
    square([QR_Size * 0.08, QR_Size * 0.08], center=true);
  }
}

module rect_plate() {
  offset(r=Corner_Radius) offset(-Corner_Radius)
  square([Rect_Width, Rect_Height], center=true);
}

module base_part() {
  difference() {
    linear_extrude(Base_Height)
    rect_plate();

    // Text pocket
    translate([text_offset_x, 0, Base_Height - Layer_Height + Tolerance])
    linear_extrude(Layer_Height + 1)
    offset(delta=Tolerance)
    text_shape(display_text, str(Font, ":style=Bold"));

    // QR placeholder pocket (shallow)
    translate([qr_offset_x, 0, Base_Height - QR_Depth])
    linear_extrude(QR_Depth + 1)
    square([QR_Size, QR_Size], center=true);
  }
}

module top_part() {
  union() {
    // Text
    translate([text_offset_x, 0, 0])
    linear_extrude(Layer_Height)
    text_shape(display_text, str(Font, ":style=Bold"));

    // QR placeholder raised pattern
    translate([qr_offset_x, 0, 0])
    linear_extrude(Layer_Height)
    qr_placeholder();
  }
}

if (Part == "Base") {
  base_part();
} else if (Part == "Top") {
  translate([0, 0, Base_Height])
  top_part();
}
