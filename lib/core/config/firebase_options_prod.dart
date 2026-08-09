import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;

class DefaultFirebaseOptions {
  static FirebaseOptions get prod => const FirebaseOptions(
    apiKey: 'AIzaSyBZ2O2sCFY-XtZ27HzXZ0vdozPVDr3FZEQ',
    appId: '1:999199950757:web:PLACEHOLDER',
    messagingSenderId: '999199950757',
    projectId: 'enso-prod-app',
    storageBucket: 'enso-prod-app.appspot.com',
  );
}
