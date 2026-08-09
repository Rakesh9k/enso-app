import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:sign_in_with_apple/sign_in_with_apple.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';

class AuthScreen extends ConsumerStatefulWidget {
  const AuthScreen({super.key});

  @override
  ConsumerState<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends ConsumerState<AuthScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _nameController = TextEditingController();
  bool _isLogin = true;
  bool _loading = false;
  String? _error;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _nameController.dispose();
    super.dispose();
  }

  Future<void> _signInWithEmail() async {
    setState(() { _loading = true; _error = null; });
    try {
      if (_isLogin) {
        await FirebaseAuth.instance.signInWithEmailAndPassword(
          email: _emailController.text.trim(),
          password: _passwordController.text,
        );
      } else {
        final cred = await FirebaseAuth.instance.createUserWithEmailAndPassword(
          email: _emailController.text.trim(),
          password: _passwordController.text,
        );
        await cred.user?.updateDisplayName(_nameController.text.trim());
      }
      if (mounted) context.go('/dashboard');
    } on FirebaseAuthException catch (e) {
      setState(() { _error = e.message; });
    } finally {
      if (mounted) setState(() { _loading = false; });
    }
  }

  Future<void> _signInWithGoogle() async {
    setState(() { _loading = true; _error = null; });
    try {
      final googleUser = await GoogleSignIn().signIn();
      if (googleUser == null) { setState(() { _loading = false; }); return; }
      final googleAuth = await googleUser.authentication;
      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );
      await FirebaseAuth.instance.signInWithCredential(credential);
      if (mounted) context.go('/dashboard');
    } catch (e) {
      setState(() { _error = 'Google sign in failed'; });
    } finally {
      if (mounted) setState(() { _loading = false; });
    }
  }

  Future<void> _signInWithApple() async {
    setState(() { _loading = true; _error = null; });
    try {
      final appleCredential = await SignInWithApple.getAppleIDCredential(
        scopes: [AppleIDAuthorizationScopes.email, AppleIDAuthorizationScopes.fullName],
      );
      final oauthCredential = OAuthProvider('apple.com').credential(
        idToken: appleCredential.identityToken,
        accessToken: appleCredential.authorizationCode,
      );
      await FirebaseAuth.instance.signInWithCredential(oauthCredential);
      if (mounted) context.go('/dashboard');
    } catch (e) {
      setState(() { _error = 'Apple sign in failed'; });
    } finally {
      if (mounted) setState(() { _loading = false; });
    }
  }

  Future<void> _sendMagicLink() async {
    if (_emailController.text.trim().isEmpty) return;
    setState(() { _loading = true; _error = null; });
    try {
      await FirebaseAuth.instance.sendSignInLinkToEmail(
        email: _emailController.text.trim(),
        actionCodeSettings: ActionCodeSettings(
          url: 'https://ensomode.com/login',
          handleCodeInApp: true,
          androidPackageName: 'com.enso.app',
          androidInstallApp: true,
        ),
      );
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Check your email for the sign in link')),
        );
      }
    } catch (e) {
      setState(() { _error = 'Failed to send magic link'; });
    } finally {
      if (mounted) setState(() { _loading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.paper,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: AppColors.enso, width: 2),
                  ),
                  child: Center(
                    child: Text(
                      'enso',
                      style: AppTypography.bodySmall.copyWith(
                        color: AppColors.inkSecondary,
                        fontStyle: FontStyle.italic,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: AppSpacing.lg),
                Text(
                  _isLogin ? 'Welcome back' : 'Begin your practice',
                  style: AppTypography.heading1.copyWith(color: AppColors.ink),
                ),
                const SizedBox(height: AppSpacing.xs),
                Text(
                  _isLogin ? 'Continue where you left off' : 'A space for your inner life',
                  style: AppTypography.bodySmall.copyWith(color: AppColors.inkSecondary),
                ),
                const SizedBox(height: AppSpacing.xl),

                if (!_isLogin) ...[
                  _buildTextField(_nameController, 'Your name', Icons.person_outline),
                  const SizedBox(height: AppSpacing.md),
                ],

                _buildTextField(_emailController, 'Email', Icons.email_outlined, keyboardType: TextInputType.emailAddress),
                const SizedBox(height: AppSpacing.md),

                _buildTextField(_passwordController, 'Password', Icons.lock_outline, obscure: true),
                const SizedBox(height: AppSpacing.sm),

                if (_isLogin)
                  Align(
                    alignment: Alignment.centerRight,
                    child: TextButton(
                      onPressed: () async {
                        if (_emailController.text.trim().isNotEmpty) {
                          try {
                            await FirebaseAuth.instance.sendPasswordResetEmail(
                              email: _emailController.text.trim(),
                            );
                            if (mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Password reset email sent')),
                              );
                            }
                          } catch (e) {
                            setState(() { _error = 'Failed to send reset email'; });
                          }
                        }
                      },
                      child: Text('Forgot password?', style: AppTypography.caption.copyWith(color: AppColors.primary)),
                    ),
                  ),

                if (_error != null)
                  Padding(
                    padding: const EdgeInsets.only(bottom: AppSpacing.md),
                    child: Text(_error!, style: AppTypography.caption.copyWith(color: AppColors.danger)),
                  ),

                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    onPressed: _loading ? null : _signInWithEmail,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.ink,
                      foregroundColor: AppColors.paper,
                      shape: RoundedRectangleBorder(borderRadius: AppRadius.buttonRadius),
                    ),
                    child: _loading
                        ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.paper))
                        : Text(_isLogin ? 'Sign In' : 'Create Account'),
                  ),
                ),

                const SizedBox(height: AppSpacing.md),
                Row(
                  children: [
                    const Expanded(child: Divider(color: AppColors.ensoLight)),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
                      child: Text('or', style: AppTypography.caption.copyWith(color: AppColors.inkSecondary)),
                    ),
                    const Expanded(child: Divider(color: AppColors.ensoLight)),
                  ],
                ),
                const SizedBox(height: AppSpacing.md),

                _socialButton('Continue with Google', Icons.g_mobiledata, _signInWithGoogle),
                const SizedBox(height: AppSpacing.sm),
                _socialButton('Continue with Apple', Icons.apple, _signInWithApple),
                const SizedBox(height: AppSpacing.sm),
                _socialButton('Continue with Magic Link', Icons.mail_outline, _sendMagicLink),

                const SizedBox(height: AppSpacing.lg),
                GestureDetector(
                  onTap: () => setState(() { _isLogin = !_isLogin; _error = null; }),
                  child: Text(
                    _isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in',
                    style: AppTypography.bodySmall.copyWith(color: AppColors.primary),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTextField(TextEditingController controller, String label, IconData icon, {bool obscure = false, TextInputType? keyboardType}) {
    return TextField(
      controller: controller,
      obscureText: obscure,
      keyboardType: keyboardType,
      style: AppTypography.body,
      decoration: InputDecoration(
        labelText: label,
        labelStyle: AppTypography.bodySmall.copyWith(color: AppColors.inkSecondary),
        prefixIcon: Icon(icon, color: AppColors.inkSecondary, size: 20),
        filled: true,
        fillColor: AppColors.paperLight,
        border: OutlineInputBorder(
          borderRadius: AppRadius.buttonRadius,
          borderSide: BorderSide(color: AppColors.ensoLight),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: AppRadius.buttonRadius,
          borderSide: BorderSide(color: AppColors.ensoLight),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: AppRadius.buttonRadius,
          borderSide: const BorderSide(color: AppColors.primary),
        ),
      ),
    );
  }

  Widget _socialButton(String label, IconData icon, VoidCallback onPressed) {
    return SizedBox(
      width: double.infinity,
      height: 44,
      child: OutlinedButton.icon(
        onPressed: _loading ? null : onPressed,
        icon: Icon(icon, size: 20),
        label: Text(label, style: AppTypography.bodySmall),
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.ink,
          side: const BorderSide(color: AppColors.ensoLight),
          shape: RoundedRectangleBorder(borderRadius: AppRadius.buttonRadius),
        ),
      ),
    );
  }
}
