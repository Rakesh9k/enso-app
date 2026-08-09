import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'auth_providers.dart';

final subscriptionProvider = StreamProvider<Map<String, dynamic>?>((ref) {
  final userId = ref.watch(currentUserIdProvider);
  if (userId == null) return Stream.value(null);

  return FirebaseFirestore.instance
      .collection('users')
      .doc(userId)
      .snapshots()
      .map((doc) => doc.data());
});

final isPremiumProvider = Provider<bool>((ref) {
  final userData = ref.watch(subscriptionProvider);
  if (!userData.hasValue) return false;
  final sub = userData.value?['subscription'];
  return sub == 'premium' || sub == 'active';
});
