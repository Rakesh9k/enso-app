import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_radius.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';

class DailySessionScreen extends ConsumerWidget {
  const DailySessionScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: AppColors.paper,
      appBar: AppBar(
        backgroundColor: AppColors.paper,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: AppColors.ink, size: 20),
          onPressed: () => context.pop(),
        ),
        title: Text('Daily Session', style: AppTypography.heading2.copyWith(color: AppColors.ink)),
        centerTitle: true,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.wb_sunny_outlined, size: 64, color: AppColors.primary),
              const SizedBox(height: AppSpacing.lg),
              Text(
                'Your Daily Practice',
                style: AppTypography.heading1.copyWith(color: AppColors.ink),
              ),
              const SizedBox(height: AppSpacing.md),
              Text(
                'Start your day with intention.\nChoose a room to begin.',
                textAlign: TextAlign.center,
                style: AppTypography.body.copyWith(color: AppColors.inkSecondary, height: 1.6),
              ),
              const SizedBox(height: AppSpacing.xl),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => context.push('/meditation'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.ink,
                    foregroundColor: AppColors.paper,
                    shape: RoundedRectangleBorder(borderRadius: AppRadius.buttonRadius),
                    padding: const EdgeInsets.symmetric(vertical: AppSpacing.md),
                  ),
                  child: Text('Begin Stillness', style: AppTypography.body.copyWith(color: AppColors.paper)),
                ),
              ),
              const SizedBox(height: AppSpacing.sm),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  onPressed: () => context.push('/journal'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.ink,
                    side: const BorderSide(color: AppColors.enso),
                    shape: RoundedRectangleBorder(borderRadius: AppRadius.buttonRadius),
                    padding: const EdgeInsets.symmetric(vertical: AppSpacing.md),
                  ),
                  child: Text('Begin Reflection', style: AppTypography.body.copyWith(color: AppColors.ink)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
