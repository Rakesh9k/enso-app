import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';

class SubscriptionScreen extends ConsumerStatefulWidget {
  const SubscriptionScreen({super.key});

  @override
  ConsumerState<SubscriptionScreen> createState() => _SubscriptionScreenState();
}

class _SubscriptionScreenState extends ConsumerState<SubscriptionScreen> {
  String _selectedPlan = 'yearly';
  bool _loading = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.paper,
      appBar: AppBar(
        backgroundColor: AppColors.paper,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: AppColors.ink, size: 20),
          onPressed: () => context.pop(),
        ),
        title: Text('Premium', style: AppTypography.heading2.copyWith(color: AppColors.ink)),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.lg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Center(
              child: Column(
                children: [
                  Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: LinearGradient(
                        colors: [AppColors.primary, AppColors.primaryLight],
                      ),
                    ),
                    child: const Center(
                      child: Text('enso', style: TextStyle(color: Colors.white, fontStyle: FontStyle.italic)),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.lg),
                  Text(
                    'Unlock your full practice',
                    style: AppTypography.heading1.copyWith(color: AppColors.ink),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  Text(
                    'Everything you need for deeper self-understanding',
                    style: AppTypography.body.copyWith(color: AppColors.inkSecondary),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),

            const SizedBox(height: AppSpacing.xl),

            // Features
            _feature('Voice Journaling', 'Speak your thoughts naturally'),
            _feature('AI Insights', 'Daily, weekly & monthly reflections'),
            _feature('Pattern Analysis', 'Understand your emotional patterns'),
            _feature('Journey Road', 'See your growth over time'),
            _feature('Priority Support', 'Get help when you need it'),

            const SizedBox(height: AppSpacing.xl),

            // Plan selection
            Text('Choose your plan', style: AppTypography.heading2.copyWith(color: AppColors.ink)),
            const SizedBox(height: AppSpacing.md),

            GestureDetector(
              onTap: () => setState(() => _selectedPlan = 'monthly'),
              child: _planCard('Monthly', '₹299', '/month', false),
            ),
            const SizedBox(height: AppSpacing.sm),
            GestureDetector(
              onTap: () => setState(() => _selectedPlan = 'yearly'),
              child: _planCard('Yearly', '₹2,700', '/year', true),
            ),

            const SizedBox(height: AppSpacing.xl),

            // Subscribe button
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: _loading ? null : _subscribe,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: AppRadius.buttonRadius),
                ),
                child: _loading
                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                    : Text(
                        _selectedPlan == 'yearly' ? 'Start Yearly Plan — ₹2,700' : 'Start Monthly Plan — ₹299',
                        style: AppTypography.body.copyWith(color: Colors.white),
                      ),
              ),
            ),

            const SizedBox(height: AppSpacing.md),

            Center(
              child: Text(
                'Cancel anytime. Billed through Google Play.',
                style: AppTypography.caption.copyWith(color: AppColors.inkSecondary),
              ),
            ),

            const SizedBox(height: 100),
          ],
        ),
      ),
    );
  }

  Widget _feature(String title, String subtitle) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppSpacing.sm),
      child: Row(
        children: [
          const Icon(Icons.check_circle, color: AppColors.success, size: 20),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: AppTypography.body.copyWith(color: AppColors.ink, fontWeight: FontWeight.w600)),
                Text(subtitle, style: AppTypography.caption.copyWith(color: AppColors.inkSecondary)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _planCard(String title, String price, String period, bool popular) {
    final selected = _selectedPlan == (title == 'Yearly' ? 'yearly' : 'monthly');
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: selected ? AppColors.primary.withOpacity(0.05) : AppColors.paperLight,
        borderRadius: AppRadius.cardRadius,
        border: Border.all(
          color: selected ? AppColors.primary : AppColors.ensoLight,
          width: selected ? 2 : 1,
        ),
      ),
      child: Row(
        children: [
          Radio(
            value: title == 'Yearly' ? 'yearly' : 'monthly',
            groupValue: _selectedPlan,
            onChanged: (v) => setState(() => _selectedPlan = v!),
            activeColor: AppColors.primary,
          ),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(title, style: AppTypography.body.copyWith(color: AppColors.ink, fontWeight: FontWeight.w600)),
                    if (popular) ...[
                      const SizedBox(width: AppSpacing.sm),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.success,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text('SAVE 25%', style: AppTypography.caption.copyWith(color: Colors.white, fontSize: 10)),
                      ),
                    ],
                  ],
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(price, style: AppTypography.heading2.copyWith(color: AppColors.ink)),
              Text(period, style: AppTypography.caption.copyWith(color: AppColors.inkSecondary)),
            ],
          ),
        ],
      ),
    );
  }

  Future<void> _subscribe() async {
    setState(() => _loading = true);
    // In production, this would integrate with Google Play Billing
    await Future.delayed(const Duration(seconds: 2));
    if (mounted) {
      setState(() => _loading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Subscription flow would start here')),
      );
    }
  }
}
