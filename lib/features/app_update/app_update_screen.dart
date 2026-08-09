import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';

class AppUpdateScreen extends ConsumerWidget {
  const AppUpdateScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: AppColors.paper,
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.system_update, size: 64, color: AppColors.primary),
              const SizedBox(height: AppSpacing.lg),
              Text('Update Available', style: AppTypography.heading1.copyWith(color: AppColors.ink)),
              const SizedBox(height: AppSpacing.md),
              Text(
                'A new version of Enso is available.\nPlease update to continue.',
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
