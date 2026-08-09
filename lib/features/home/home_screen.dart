import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = FirebaseAuth.instance.currentUser;

    return Scaffold(
      backgroundColor: AppColors.paper,
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(AppSpacing.lg, AppSpacing.lg, AppSpacing.lg, 0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _getGreeting(),
                              style: AppTypography.heading1.copyWith(color: AppColors.ink),
                            ),
                            const SizedBox(height: AppSpacing.xs),
                            Text(
                              user?.displayName ?? 'Welcome',
                              style: AppTypography.body.copyWith(color: AppColors.inkSecondary),
                            ),
                          ],
                        ),
                        GestureDetector(
                          onTap: () => context.push('/profile'),
                          child: CircleAvatar(
                            radius: 20,
                            backgroundColor: AppColors.ensoLight,
                            backgroundImage: user?.photoURL != null ? NetworkImage(user!.photoURL!) : null,
                            child: user?.photoURL == null
                                ? Text(
                                    (user?.displayName ?? user?.email ?? '?')[0].toUpperCase(),
                                    style: AppTypography.body.copyWith(color: AppColors.ink),
                                  )
                                : null,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.xl),

                    // Daily intention card
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(AppSpacing.lg),
                      decoration: BoxDecoration(
                        color: AppColors.paperLight,
                        borderRadius: AppRadius.cardRadius,
                        border: Border.all(color: AppColors.ensoLight),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Today\'s Intention',
                            style: AppTypography.caption.copyWith(color: AppColors.inkSecondary),
                          ),
                          const SizedBox(height: AppSpacing.sm),
                          Text(
                            'What would make today meaningful?',
                            style: AppTypography.heading2.copyWith(
                              color: AppColors.ink,
                              fontStyle: FontStyle.italic,
                            ),
                          ),
                          const SizedBox(height: AppSpacing.md),
                          GestureDetector(
                            onTap: () => context.push('/journal'),
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm),
                              decoration: BoxDecoration(
                                color: AppColors.paper,
                                borderRadius: AppRadius.buttonRadius,
                                border: Border.all(color: AppColors.enso),
                              ),
                              child: Text(
                                'Begin writing...',
                                style: AppTypography.bodySmall.copyWith(color: AppColors.inkSecondary),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: AppSpacing.xl),

                    // Rooms section
                    Text(
                      'Rooms',
                      style: AppTypography.heading2.copyWith(color: AppColors.ink),
                    ),
                    const SizedBox(height: AppSpacing.md),
                  ],
                ),
              ),
            ),

            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
              sliver: SliverGrid(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  mainAxisSpacing: AppSpacing.md,
                  crossAxisSpacing: AppSpacing.md,
                  childAspectRatio: 1.2,
                ),
                delegate: SliverChildListDelegate([
                  _roomCard(context, 'Stillness', 'Meditation & breath', Icons.self_improvement, () => context.push('/meditation')),
                  _roomCard(context, 'Reflection', 'Journal & writing', Icons.edit_note, () => context.push('/journal')),
                  _roomCard(context, 'Awareness', 'Insights & patterns', Icons.insights, () => context.push('/insights')),
                  _roomCard(context, 'Journey', 'Your path forward', Icons.route, () => context.push('/journal')),
                ]),
              ),
            ),

            const SliverToBoxAdapter(
              child: SizedBox(height: 100),
            ),
          ],
        ),
      ),
      bottomNavigationBar: _bottomNav(context),
    );
  }

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  Widget _roomCard(BuildContext context, String title, String subtitle, IconData icon, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.md),
        decoration: BoxDecoration(
          color: AppColors.paperLight,
          borderRadius: AppRadius.cardRadius,
          border: Border.all(color: AppColors.ensoLight),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Icon(icon, color: AppColors.primary, size: 28),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: AppTypography.body.copyWith(color: AppColors.ink, fontWeight: FontWeight.w600)),
                const SizedBox(height: AppSpacing.xs),
                Text(subtitle, style: AppTypography.caption.copyWith(color: AppColors.inkSecondary)),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _bottomNav(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.paperLight,
        border: Border(top: BorderSide(color: AppColors.ensoLight)),
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: AppSpacing.sm),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _navItem(context, Icons.home_outlined, 'Home', true),
              _navItem(context, Icons.edit_note, 'Journal', false, onTap: () => context.push('/journal')),
              _navItem(context, Icons.self_improvement, 'Meditate', false, onTap: () => context.push('/meditation')),
              _navItem(context, Icons.insights, 'Insights', false, onTap: () => context.push('/insights')),
              _navItem(context, Icons.person_outline, 'Profile', false, onTap: () => context.push('/profile')),
            ],
          ),
        ),
      ),
    );
  }

  Widget _navItem(BuildContext context, IconData icon, String label, bool active, {VoidCallback? onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: active ? AppColors.primary : AppColors.inkSecondary, size: 24),
          const SizedBox(height: 2),
          Text(label, style: AppTypography.caption.copyWith(color: active ? AppColors.primary : AppColors.inkSecondary)),
        ],
      ),
    );
  }
}
