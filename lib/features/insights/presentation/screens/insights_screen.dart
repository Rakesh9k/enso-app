import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';

class InsightsScreen extends ConsumerStatefulWidget {
  const InsightsScreen({super.key});

  @override
  ConsumerState<InsightsScreen> createState() => _InsightsScreenState();
}

class _InsightsScreenState extends ConsumerState<InsightsScreen> {
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
        title: Text('Insights', style: AppTypography.heading2.copyWith(color: AppColors.ink)),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Your patterns and growth',
              style: AppTypography.body.copyWith(color: AppColors.inkSecondary),
            ),
            const SizedBox(height: AppSpacing.xl),

            // AI Insights section
            _sectionHeader('AI Insights', Icons.auto_awesome),
            const SizedBox(height: AppSpacing.md),

            StreamBuilder<QuerySnapshot>(
              stream: FirebaseFirestore.instance
                  .collection('aiInsights')
                  .where('uid', '==', user?.uid)
                  .orderBy('createdAt', descending: true)
                  .limit(5)
                  .snapshots(),
              builder: (context, snapshot) {
                if (!snapshot.hasData || snapshot.data!.docs.isEmpty) {
                  return _emptyCard('Complete a few journal entries and meditation sessions to unlock AI insights about your patterns and growth.');
                }
                return Column(
                  children: snapshot.data!.docs.map((doc) {
                    final data = doc.data() as Map<String, dynamic>;
                    return _insightCard(
                      data['title'] ?? 'Insight',
                      data['description'] ?? '',
                      data['type'] ?? 'pattern',
                    );
                  }).toList(),
                );
              },
            ),

            const SizedBox(height: AppSpacing.xl),

            // Mood patterns
            _sectionHeader('Mood Patterns', Icons.mood),
            const SizedBox(height: AppSpacing.md),

            _moodChart(),

            const SizedBox(height: AppSpacing.xl),

            // Weekly summary
            _sectionHeader('Weekly Summary', Icons.calendar_view_week),
            const SizedBox(height: AppSpacing.md),

            _weeklySummary(),

            const SizedBox(height: AppSpacing.xl),

            // Streak
            _sectionHeader('Your Streak', Icons.local_fire_department),
            const SizedBox(height: AppSpacing.md),

            _streakCard(),

            const SizedBox(height: 100),
          ],
        ),
      ),
      bottomNavigationBar: _bottomNav(context),
    );
  }

  Widget _sectionHeader(String title, IconData icon) {
    return Row(
      children: [
        Icon(icon, color: AppColors.primary, size: 20),
        const SizedBox(width: AppSpacing.sm),
        Text(title, style: AppTypography.heading2.copyWith(color: AppColors.ink)),
      ],
    );
  }

  Widget _emptyCard(String message) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: AppColors.paperLight,
        borderRadius: AppRadius.cardRadius,
        border: Border.all(color: AppColors.ensoLight),
      ),
      child: Text(
        message,
        style: AppTypography.bodySmall.copyWith(color: AppColors.inkSecondary, height: 1.6),
      ),
    );
  }

  Widget _insightCard(String title, String description, String type) {
    final icons = {
      'pattern': Icons.psychology,
      'growth': Icons.trending_up,
      'mood': Icons.mood,
      'habit': Icons.repeat,
    };
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: AppSpacing.sm),
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.paperLight,
        borderRadius: AppRadius.cardRadius,
        border: Border.all(color: AppColors.ensoLight),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icons[type] ?? Icons.lightbulb, color: AppColors.primary, size: 20),
          const SizedBox(width: AppSpacing.sm),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: AppTypography.body.copyWith(color: AppColors.ink, fontWeight: FontWeight.w600)),
                const SizedBox(height: AppSpacing.xs),
                Text(description, style: AppTypography.bodySmall.copyWith(color: AppColors.inkSecondary)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _moodChart() {
    return Container(
      width: double.infinity,
      height: 120,
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.paperLight,
        borderRadius: AppRadius.cardRadius,
        border: Border.all(color: AppColors.ensoLight),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: List.generate(7, (i) {
          final height = [0.4, 0.6, 0.3, 0.8, 0.5, 0.7, 0.9][i];
          final days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
          return Column(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              Container(
                width: 24,
                height: 80 * height,
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.6),
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
              const SizedBox(height: AppSpacing.xs),
              Text(days[i], style: AppTypography.caption.copyWith(color: AppColors.inkSecondary)),
            ],
          );
        }),
      ),
    );
  }

  Widget _weeklySummary() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        color: AppColors.paperLight,
        borderRadius: AppRadius.cardRadius,
        border: Border.all(color: AppColors.ensoLight),
      ),
      child: Column(
        children: [
          _summaryRow('Journal entries', '3'),
          const Divider(color: AppColors.ensoLight),
          _summaryRow('Meditation minutes', '25'),
          const Divider(color: AppColors.ensoLight),
          _summaryRow('Consistency', '71%'),
        ],
      ),
    );
  }

  Widget _summaryRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppSpacing.xs),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: AppTypography.bodySmall.copyWith(color: AppColors.inkSecondary)),
          Text(value, style: AppTypography.body.copyWith(color: AppColors.ink, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }

  Widget _streakCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [AppColors.warning.withOpacity(0.1), AppColors.warning.withOpacity(0.05)],
        ),
        borderRadius: AppRadius.cardRadius,
        border: Border.all(color: AppColors.warning.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          const Icon(Icons.local_fire_department, color: AppColors.warning, size: 32),
          const SizedBox(width: AppSpacing.md),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('5 day streak', style: AppTypography.heading2.copyWith(color: AppColors.ink)),
              const SizedBox(height: AppSpacing.xs),
              Text('Keep your practice going', style: AppTypography.caption.copyWith(color: AppColors.inkSecondary)),
            ],
          ),
        ],
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
              _navItem(context, Icons.home_outlined, 'Home', false, onTap: () => context.go('/dashboard')),
              _navItem(context, Icons.edit_note, 'Journal', false, onTap: () => context.push('/journal')),
              _navItem(context, Icons.self_improvement, 'Meditate', false, onTap: () => context.push('/meditation')),
              _navItem(context, Icons.insights, 'Insights', true),
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
