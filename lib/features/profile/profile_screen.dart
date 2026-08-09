import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';

class ProfileScreen extends ConsumerStatefulWidget {
  const ProfileScreen({super.key});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen> {
  Map<String, dynamic> _userData = {};
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) return;
    final doc = await FirebaseFirestore.instance.collection('users').doc(user.uid).get();
    if (mounted) {
      setState(() {
        _userData = doc.data() ?? {};
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser;

    return Scaffold(
      backgroundColor: AppColors.paper,
      appBar: AppBar(
        backgroundColor: AppColors.paper,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: AppColors.ink, size: 20),
          onPressed: () => context.pop(),
        ),
        title: Text('Profile', style: AppTypography.heading2.copyWith(color: AppColors.ink)),
        centerTitle: true,
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: AppColors.primary))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: Column(
                children: [
                  // Avatar
                  CircleAvatar(
                    radius: 40,
                    backgroundColor: AppColors.ensoLight,
                    backgroundImage: user?.photoURL != null ? NetworkImage(user!.photoURL!) : null,
                    child: user?.photoURL == null
                        ? Text(
                            (user?.displayName ?? user?.email ?? '?')[0].toUpperCase(),
                            style: AppTypography.heading1.copyWith(color: AppColors.ink),
                          )
                        : null,
                  ),
                  const SizedBox(height: AppSpacing.md),
                  Text(
                    user?.displayName ?? 'Anonymous',
                    style: AppTypography.heading2.copyWith(color: AppColors.ink),
                  ),
                  const SizedBox(height: AppSpacing.xs),
                  Text(
                    user?.email ?? '',
                    style: AppTypography.bodySmall.copyWith(color: AppColors.inkSecondary),
                  ),

                  const SizedBox(height: AppSpacing.xl),

                  // Subscription badge
                  _subscriptionBadge(),

                  const SizedBox(height: AppSpacing.xl),

                  // Stats
                  _statsGrid(),

                  const SizedBox(height: AppSpacing.xl),

                  // Settings links
                  _settingsLink('Account', Icons.person_outline, () {}),
                  _settingsLink('Notifications', Icons.notifications_outlined, () {}),
                  _settingsLink('Appearance', Icons.palette_outlined, () {}),
                  _settingsLink('Privacy', Icons.lock_outline, () {}),
                  _settingsLink('Help & Support', Icons.help_outline, () {}),

                  const SizedBox(height: AppSpacing.lg),

                  // Sign out
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton(
                      onPressed: () async {
                        await FirebaseAuth.instance.signOut();
                        if (context.mounted) context.go('/login');
                      },
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppColors.danger,
                        side: const BorderSide(color: AppColors.danger),
                        shape: RoundedRectangleBorder(borderRadius: AppRadius.buttonRadius),
                        padding: const EdgeInsets.symmetric(vertical: AppSpacing.md),
                      ),
                      child: Text('Sign Out', style: AppTypography.body.copyWith(color: AppColors.danger)),
                    ),
                  ),

                  const SizedBox(height: 100),
                ],
              ),
            ),
    );
  }

  Widget _subscriptionBadge() {
    final sub = _userData['subscription'] ?? 'free';
    final isPremium = sub == 'premium' || sub == 'active';
    return GestureDetector(
      onTap: () => context.push('/subscription'),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(AppSpacing.md),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: isPremium
                ? [AppColors.success.withOpacity(0.1), AppColors.success.withOpacity(0.05)]
                : [AppColors.primary.withOpacity(0.1), AppColors.primary.withOpacity(0.05)],
          ),
          borderRadius: AppRadius.cardRadius,
          border: Border.all(color: isPremium ? AppColors.success.withOpacity(0.3) : AppColors.primary.withOpacity(0.3)),
        ),
        child: Row(
          children: [
            Icon(isPremium ? Icons.workspace_premium : Icons.upgrade, color: isPremium ? AppColors.success : AppColors.primary),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    isPremium ? 'Enso Premium' : 'Upgrade to Premium',
                    style: AppTypography.body.copyWith(color: AppColors.ink, fontWeight: FontWeight.w600),
                  ),
                  Text(
                    isPremium ? 'All features unlocked' : 'Unlock voice journaling, AI insights & more',
                    style: AppTypography.caption.copyWith(color: AppColors.inkSecondary),
                  ),
                ],
              ),
            ),
            const Icon(Icons.chevron_right, color: AppColors.inkSecondary),
          ],
        ),
      ),
    );
  }

  Widget _statsGrid() {
    return GridView.count(
      crossAxisCount: 3,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: AppSpacing.md,
      crossAxisSpacing: AppSpacing.md,
      childAspectRatio: 1.2,
      children: [
        _statCard('${_userData['journalCount'] ?? 0}', 'Entries', AppColors.primary),
        _statCard('${_userData['meditationMinutes'] ?? 0}', 'Minutes', AppColors.success),
        _statCard('${_calculateStreak()}', 'Day Streak', AppColors.warning),
      ],
    );
  }

  Widget _statCard(String value, String label, Color color) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.paperLight,
        borderRadius: AppRadius.cardRadius,
        border: Border.all(color: AppColors.ensoLight),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(value, style: AppTypography.heading1.copyWith(color: color, fontSize: 24)),
          const SizedBox(height: AppSpacing.xs),
          Text(label, style: AppTypography.caption.copyWith(color: AppColors.inkSecondary)),
        ],
      ),
    );
  }

  int _calculateStreak() {
    return _userData['currentStreak'] ?? 0;
  }

  Widget _settingsLink(String label, IconData icon, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: AppSpacing.md),
        decoration: const BoxDecoration(
          border: Border(bottom: BorderSide(color: AppColors.ensoLight)),
        ),
        child: Row(
          children: [
            Icon(icon, color: AppColors.inkSecondary, size: 20),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: Text(label, style: AppTypography.body.copyWith(color: AppColors.ink)),
            ),
            const Icon(Icons.chevron_right, color: AppColors.inkSecondary, size: 20),
          ],
        ),
      ),
    );
  }
}
