import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';

class ReportsScreen extends ConsumerWidget {
  const ReportsScreen({super.key});

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
        title: Text('Reports', style: AppTypography.heading2.copyWith(color: AppColors.ink)),
        centerTitle: true,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.assessment, size: 64, color: AppColors.primary),
              const SizedBox(height: AppSpacing.lg),
              Text(
                'Your Reports',
                style: AppTypography.heading1.copyWith(color: AppColors.ink),
              ),
              const SizedBox(height: AppSpacing.md),
              Text(
                'Detailed analytics and progress reports.\nAvailable with Premium.',
                textAlign: TextAlign.center,
                style: AppTypography.body.copyWith(color: AppColors.inkSecondary, height: 1.6),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
