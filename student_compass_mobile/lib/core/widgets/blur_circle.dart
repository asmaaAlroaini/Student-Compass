import 'package:flutter/material.dart';

class BlurCircle extends StatelessWidget {
  final Color color;
  final double size;

  const BlurCircle({super.key, required this.color, required this.size});

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      size: Size(size, size),
      painter: _BlurCirclePainter(color: color, size: size),
    );
  }
}

class _BlurCirclePainter extends CustomPainter {
  final Color color;
  final double size;

  _BlurCirclePainter({required this.color, required this.size});

  @override
  void paint(Canvas canvas, Size size) {
    final paint =
        Paint()
          ..color = color
          ..maskFilter = const MaskFilter.blur(
            BlurStyle.normal,
            50,
          ); // Blur effect

    canvas.drawCircle(
      Offset(size.width / 2, size.height / 2),
      size.width / 2,
      paint,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
