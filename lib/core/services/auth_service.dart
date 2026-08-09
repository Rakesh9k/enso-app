import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:sign_in_with_apple/sign_in_with_apple.dart';

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final GoogleSignIn _google = GoogleSignIn();

  User? get currentUser => _auth.currentUser;
  Stream<User?> get authStateChanges => _auth.authStateChanges();

  Future<UserCredential> signInWithEmail(String email, String password) async {
    return await _auth.signInWithEmailAndPassword(email: email, password: password);
  }

  Future<UserCredential> signUpWithEmail(String email, String password, String displayName) async {
    final credential = await _auth.createUserWithEmailAndPassword(email: email, password: password);
    await credential.user?.updateDisplayName(displayName);
    await _createUserDoc(credential.user!, displayName: displayName);
    return credential;
  }

  Future<void> sendPasswordReset(String email) async {
    await _auth.sendPasswordResetEmail(email: email);
  }

  Future<UserCredential> signInWithGoogle() async {
    final googleUser = await _google.signIn();
    if (googleUser == null) throw Exception('Google sign in aborted');
    final googleAuth = await googleUser.authentication;
    final credential = GoogleAuthProvider.credential(
      accessToken: googleAuth.accessToken,
      idToken: googleAuth.idToken,
    );
    final result = await _auth.signInWithCredential(credential);
    if (result.additionalUserInfo?.isNewUser == true) {
      await _createUserDoc(result.user!);
    }
    return result;
  }

  Future<UserCredential> signInWithApple() async {
    final appleCredential = await SignInWithApple.getAppleIDCredential(
      scopes: [AppleIDAuthorizationScopes.email, AppleIDAuthorizationScopes.fullName],
    );
    final oauthCredential = OAuthProvider('apple.com').credential(
      idToken: appleCredential.identityToken,
      accessToken: appleCredential.authorizationCode,
    );
    final result = await _auth.signInWithCredential(oauthCredential);
    if (result.additionalUserInfo?.isNewUser == true) {
      final name = [appleCredential.givenName, appleCredential.familyName]
          .where((n) => n != null && n.isNotEmpty)
          .join(' ');
      await _createUserDoc(result.user!, displayName: name.isNotEmpty ? name : null);
    }
    return result;
  }

  Future<void> sendMagicLink(String email) async {
    await _auth.sendSignInLinkToEmail(
      email: email,
      actionCodeSettings: ActionCodeSettings(
        url: 'https://ensomode.com/login',
        handleCodeInApp: true,
        androidPackageName: 'com.enso.app',
        androidInstallApp: true,
      ),
    );
  }

  Future<void> signOut() async {
    await _google.signOut();
    await _auth.signOut();
  }

  Future<void> _createUserDoc(User user, {String? displayName}) async {
    await _firestore.collection('users').doc(user.uid).set({
      'email': user.email,
      'displayName': displayName ?? user.displayName,
      'photoURL': user.photoURL,
      'createdAt': FieldValue.serverTimestamp(),
      'lastLogin': FieldValue.serverTimestamp(),
      'subscription': 'free',
      'admin': false,
      'isPartner': false,
    });
  }

  Future<void> updateLastLogin() async {
    if (currentUser != null) {
      await _firestore.collection('users').doc(currentUser!.uid).update({
        'lastLogin': FieldValue.serverTimestamp(),
      });
    }
  }
}

final authServiceProvider = Provider<AuthService>((ref) => AuthService());

final authStateProvider = StreamProvider<User?>((ref) {
  return ref.watch(authServiceProvider).authStateChanges;
});
