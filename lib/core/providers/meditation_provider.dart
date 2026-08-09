import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'auth_providers.dart';

final meditationSessionsProvider = StreamProvider<QuerySnapshot>((ref) {
  final userId = ref.watch(currentUserIdProvider);
  if (userId == null) return const Stream.empty();

  return FirebaseFirestore.instance
      .collection('meditationSessions')
      .where('uid', isEqualTo: userId)
      .orderBy('createdAt', descending: true)
      .limit(20)
      .snapshots();
});
