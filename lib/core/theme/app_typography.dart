import 'package:flutter/material.dart';

class AppTypography {
  static const String _fontSans = 'Inter';
  static const String _fontEditorial = 'Newsreader';

  static TextStyle heading1 = const TextStyle(fontSize: 32, fontWeight: FontWeight.w600, fontFamily: _fontEditorial);
  static TextStyle heading2 = const TextStyle(fontSize: 24, fontWeight: FontWeight.w600, fontFamily: _fontEditorial);
  static TextStyle body = const TextStyle(fontSize: 16, fontFamily: _fontSans);
  static TextStyle bodySmall = const TextStyle(fontSize: 14, fontFamily: _fontSans);
  static TextStyle caption = const TextStyle(fontSize: 12, fontFamily: _fontSans);
}
