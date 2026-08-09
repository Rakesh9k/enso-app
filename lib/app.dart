import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class EnsoApp extends StatelessWidget {
  const EnsoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ProviderScope(
      child: MaterialApp(
        title: 'Enso',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF4F46E5)),
          useMaterial3: true,
          fontFamily: 'Inter',
        ),
        home: const Scaffold(
          body: Center(
            child: Text('Enso - Loading...'),
          ),
        ),
      ),
    );
  }
}
