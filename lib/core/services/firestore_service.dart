import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class FirestoreService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  Future<DocumentSnapshot> getUser(String uid) async {
    return await _db.collection('users').doc(uid).get();
  }

  Future<void> updateUser(String uid, Map<String, dynamic> data) async {
    await _db.collection('users').doc(uid).update(data);
  }

  Stream<QuerySnapshot> getJournalEntries(String uid, {int limit = 50}) {
    return _db
        .collection('journalEntries')
        .where('uid', isEqualTo: uid)
        .orderBy('createdAt', descending: true)
        .limit(limit)
        .snapshots();
  }

  Future<DocumentReference> addJournalEntry(String uid, Map<String, dynamic> data) async {
    return await _db.collection('journalEntries').add({
      ...data,
      'uid': uid,
      'createdAt': FieldValue.serverTimestamp(),
    });
  }

  Stream<QuerySnapshot> getMeditationSessions(String uid, {int limit = 50}) {
    return _db
        .collection('meditationSessions')
        .where('uid', isEqualTo: uid)
        .orderBy('createdAt', descending: true)
        .limit(limit)
        .snapshots();
  }

  Future<DocumentReference> addMeditationSession(String uid, Map<String, dynamic> data) async {
    return await _db.collection('meditationSessions').add({
      ...data,
      'uid': uid,
      'createdAt': FieldValue.serverTimestamp(),
    });
  }

  Stream<QuerySnapshot> getAiInsights(String uid, {int limit = 10}) {
    return _db
        .collection('aiInsights')
        .where('uid', isEqualTo: uid)
        .orderBy('createdAt', descending: true)
        .limit(limit)
        .snapshots();
  }

  Future<DocumentSnapshot> getSubscription(String uid) async {
    return await _db.collection('userSubscriptions').doc(uid).get();
  }

  Stream<DocumentSnapshot> getSubscriptionStream(String uid) {
    return _db.collection('userSubscriptions').doc(uid).snapshots();
  }

  Future<void> updateUserPreferences(String uid, Map<String, dynamic> prefs) async {
    await _db.collection('users').doc(uid).update({'preferences': prefs});
  }

  Stream<QuerySnapshot> getRoomProgress(String uid) {
    return _db
        .collection('roomProgress')
        .where('uid', isEqualTo: uid)
        .snapshots();
  }

  Future<void> updateRoomProgress(String uid, String roomId, Map<String, dynamic> data) async {
    await _db.collection('roomProgress').doc('${uid}_$roomId').set({
      ...data,
      'uid': uid,
      'roomId': roomId,
      'updatedAt': FieldValue.serverTimestamp(),
    }, SetOptions(merge: true));
  }

  Future<Map<String, dynamic>> getPartnerStats(String uid) async {
    final doc = await _db.collection('partners').doc(uid).get();
    return doc.exists ? doc.data()! : {};
  }

  Stream<DocumentSnapshot> getDailyReflection(String uid, DateTime date) {
    final dateStr = '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
    return _db.collection('dailyReflections').doc('${uid}_$dateStr').snapshots();
  }

  Future<void> saveDailyReflection(String uid, DateTime date, Map<String, dynamic> data) async {
    final dateStr = '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
    final ref = _db.collection('dailyReflections').doc('${uid}_$dateStr');
    final existing = await ref.get();
    final allowed = <String>{
      'question', 'answer', 'content', 'reflection', 'mood', 'source',
    };
    final safeData = Map<String, dynamic>.from(data)
      ..removeWhere((key, _) => !allowed.contains(key));
    final payload = <String, dynamic>{
      ...safeData,
      'uid': uid,
      'date': dateStr,
      'updatedAt': FieldValue.serverTimestamp(),
    };
    if (existing.exists) {
      // Keep the original creation timestamp immutable on updates.
      await ref.update(payload);
    } else {
      await ref.set({...payload, 'createdAt': FieldValue.serverTimestamp()});
    }
  }
}

final firestoreServiceProvider = Provider<FirestoreService>((ref) => FirestoreService());
