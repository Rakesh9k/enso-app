import 'package:flutter/material.dart';
import 'package:enso/app.dart';
import 'package:enso/core/config/firebase_options_prod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.prod,
  );

  runApp(
    const ProviderScope(
      child: EnsoApp(),
    ),
  );
}
