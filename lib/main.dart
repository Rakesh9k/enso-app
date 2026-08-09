import 'package:flutter/material.dart';
import 'package:enso/app.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  await Firebase.initializeApp();

  runApp(
    const ProviderScope(
      child: EnsoApp(),
    ),
  );
}
